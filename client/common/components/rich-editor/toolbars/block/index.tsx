import * as classNames from "classnames";
import { EditorState, Entity, Modifier, RichUtils } from "draft-js";
import { Cancelable, debounce, isNull, map } from "lodash";
import * as React from "react";
import { Icon, Tooltip } from "react-mdl";

import ElementHelper from "./../../../../helpers/element-helper";
import translate from "./../../../../translation";
import BlockType from "./../../model/block-type";
import IDecoratorFormulaData from "./../../model/decorator-formula-data";
import EditorChangeType from "./../../model/editor-change-type";
import EntityMutability from "./../../model/entity-mutability";
import EntityType from "./../../model/entity-type";

import { hidden } from "./../../styles/common.scss";
import {
    blockToolbar,
    expandBox,
    highlighted,
    selectedToolbarButton,
    toolbarButton,
    toolbarIcon,
} from "./style.scss";

enum MenuItem {
    AddObject,
    BlockSyntax,
}

interface IBlockToolbarState {
    activeMenu?: MenuItem;
    closePopup?: Function & Cancelable;
}

interface IBlockToolbarProps {
    blockRect: ClientRect;
    editorRect: ClientRect;
    editorState: EditorState;
    updateEditorState: (editorState: EditorState) => void;
}

const blockStyles: Array<{ iconName?: string, style: string, text?: string, translationKey: string }> = [
    { style: BlockType.headerOne, text: "H1", translationKey: "headerOne" },
    { style: BlockType.headerTwo, text: "H2", translationKey: "headerTwo" },
    { iconName: "format_list_bulleted", style: BlockType.unorderedListItem, translationKey: "unorderedListItem" },
    { iconName: "format_list_numbered", style: BlockType.orderedListItem, translationKey: "orderedListItem" },
    { iconName: "format_quote", style: BlockType.blockquote, translationKey: "blockquote" },
];

const blockObjects: Array<{ iconName?: string, text?: string, translationKey: string, type: string }> = [
    { text: "FX", translationKey: "formula", type: EntityType.formula },
];

export default class BlockToolbar extends React.Component<IBlockToolbarProps, IBlockToolbarState> {
    public constructor(props: IBlockToolbarProps) {
        super(props);

        this.state = {
            activeMenu: null,
            closePopup: debounce(() => this.setState({ activeMenu: null }), 500),
        };
    }

    public render(): JSX.Element {
        const { blockRect } = this.props;

        if (!blockRect) {
            return null;
        }

        const { activeMenu, closePopup } = this.state;
        const closePopupHandler = () => closePopup();

        return (
            <div ref={this.updatePopupPosition.bind(this)} className={classNames(blockToolbar, hidden)}>
                <Icon
                    className={classNames(toolbarIcon, { [highlighted]: activeMenu === MenuItem.AddObject })}
                    name="add"
                    onMouseOver={this.updateSelectedMenuItem.bind(this, MenuItem.AddObject, null)}
                    onMouseOut={closePopupHandler}
                />
                <Icon
                    className={classNames(toolbarIcon, { [highlighted]: activeMenu === MenuItem.BlockSyntax })}
                    name="menu"
                    onMouseOver={this.updateSelectedMenuItem.bind(this, MenuItem.BlockSyntax, null)}
                    onMouseOut={closePopupHandler}
                />

                {!isNull(activeMenu) && (
                    <div
                        className={expandBox}
                        onMouseOver={this.cancelClose.bind(this)}
                        onMouseOut={closePopupHandler}
                    >
                        {activeMenu === MenuItem.AddObject && this.buildAddObjectMenu()}
                        {activeMenu === MenuItem.BlockSyntax && this.buildBlockSyntaxMenu()}
                    </div>
                )}
            </div>
        );
    }

    private insertEntity(type: string, blockData: IDecoratorFormulaData, event: React.MouseEvent) {
        if (event) {
            event.preventDefault();
        }

        this.setState({ activeMenu: null });

        const { editorState, updateEditorState } = this.props;
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        const entityKey = Entity.create(type, EntityMutability.immutable, blockData);
        const firstBlank = Modifier.insertText(contentState, selectionState, " ", null, null);
        const withEntity = Modifier.insertText(firstBlank, selectionState, " ", null, entityKey);
        const withBlank = Modifier.insertText(withEntity, selectionState, " ", null, null);

        updateEditorState(EditorState.push(editorState, withBlank, EditorChangeType.insertCharacters));
    }

    private buildAddObjectMenu(): Array<JSX.Element> {
        return map(blockObjects, blockObject => (
            <Tooltip
                key={blockObject.type}
                className={toolbarButton}
                label={translate("BlockToolbar", blockObject.translationKey)}
                position="bottom"
                onMouseDown={this.insertEntity.bind(this, blockObject.type, { text: "" })}
            >
                {blockObject.iconName
                    ? <Icon name={blockObject.iconName} />
                    : blockObject.text
                }
            </Tooltip>
        ));
    }

    private setBlockStyle(blockStyle: string, event: React.MouseEvent) {
        if (event) {
            event.preventDefault();
        }

        const { editorState, updateEditorState } = this.props;

        this.setState({ activeMenu: null });

        updateEditorState(RichUtils.toggleBlockType(editorState, blockStyle));
    }

    private buildBlockSyntaxMenu(): Array<JSX.Element> {
        const { editorState } = this.props;
        const selection = editorState.getSelection();
        const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

        return map(blockStyles, blockStyle => (
            <Tooltip
                key={blockStyle.style}
                className={classNames(toolbarButton, { [selectedToolbarButton]: blockStyle.style === blockType})}
                label={translate("BlockToolbar", blockStyle.translationKey)}
                position="bottom"
                onMouseDown={this.setBlockStyle.bind(this, blockStyle.style)}
            >
                {blockStyle.iconName
                    ? <Icon name={blockStyle.iconName} />
                    : blockStyle.text
                }
            </Tooltip>
        ));
    }

    private updateSelectedMenuItem(menuItem: MenuItem, activeMenu: MenuItem) {
        if (isNull(activeMenu)) {
            this.cancelClose();

            this.setState({ activeMenu: menuItem });
        } else if (activeMenu === menuItem) {
            this.state.closePopup();

            this.setState({ activeMenu: null });
        }
    }

    private cancelClose() {
        const { closePopup } = this.state;

        closePopup.cancel();
    }

    private updatePopupPosition(element: HTMLElement) {
        if (!element) {
            return;
        }

        const { blockRect, editorRect } = this.props;
        const elementRect = ElementHelper.getElementRect(element);

        const top = blockRect.top + (blockRect.height - elementRect.height) / 2;
        const realTop = Math.max(blockRect.top, Math.min(blockRect.bottom - elementRect.height, top));

        element.style.left = `${editorRect.left}px`;
        element.style.top = `${realTop}px`;
        element.classList.remove(hidden);
    }
}
