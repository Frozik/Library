import * as classNames from "classnames";
import { EditorState, RichUtils } from "draft-js";
import { Cancelable, debounce, isNull, map } from "lodash";
import * as React from "react";
import { Icon, Tooltip } from "react-mdl";

import ElementHelper from "./../../helpers/element-helper";
import translate from "./../../translation";

import { blockToolbar, expandBox, highlighted, selectedToolbarButton, toolbarButton, toolbarIcon } from "./index.scss";

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
    { style: "header-one", text: "H1", translationKey: "headerOne" },
    { style: "header-two", text: "H2", translationKey: "headerTwo" },
    { iconName: "format_list_bulleted", style: "unordered-list-item", translationKey: "unorderedListItem" },
    { iconName: "format_list_numbered", style: "ordered-list-item", translationKey: "orderedListItem" },
    { iconName: "format_quote", style: "blockquote", translationKey: "blockquote" },
];

export default class BlockToolbar extends React.Component<IBlockToolbarProps, IBlockToolbarState> {
    public constructor(props: IBlockToolbarProps) {
        super(props);

        this.state = {
            activeMenu: null,
            closePopup: debounce(() => this.setState({ activeMenu: null }), 500),
        };
    }

    public render() {
        const { activeMenu, closePopup } = this.state;

        return (
            <div ref={this.updatePopupPosition.bind(this)} className={blockToolbar}>
                <Icon
                    className={classNames(toolbarIcon, { [highlighted]: activeMenu === MenuItem.AddObject })}
                    name="add"
                    onMouseOver={this.updateSelectedMenuItem.bind(this, MenuItem.AddObject, null)}
                    onMouseOut={closePopup}
                />
                <Icon
                    className={classNames(toolbarIcon, { [highlighted]: activeMenu === MenuItem.BlockSyntax })}
                    name="menu"
                    onMouseOver={this.updateSelectedMenuItem.bind(this, MenuItem.BlockSyntax, null)}
                    onMouseOut={closePopup}
                />

                {!isNull(activeMenu) && (
                    <div
                        className={expandBox}
                        onMouseOver={this.cancelClose.bind(this)}
                        onMouseOut={closePopup}
                    >
                        {activeMenu === MenuItem.AddObject && this.buildAddObjectMenu()}
                        {activeMenu === MenuItem.BlockSyntax && this.buildBlockSyntaxMenu()}
                    </div>
                )}
            </div>
        );
    }

    private buildAddObjectMenu(): Array<JSX.Element> {
        return null;
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
                onMouseDown={this.getBlockStyleHandler.bind(this, blockStyle.style)}
            >
                {blockStyle.iconName
                    ? <Icon name={blockStyle.iconName} />
                    : blockStyle.text
                }
            </Tooltip>
        ));
    }

    private getBlockStyleHandler(blockStyle: string, event: React.MouseEvent) {
        event.preventDefault();

        const { editorState, updateEditorState } = this.props;

        this.setState({ activeMenu: null });

        updateEditorState(RichUtils.toggleBlockType(editorState, blockStyle));
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

        const left = editorRect.left + (editorRect.width - blockRect.width - elementRect.width) / 2;
        const top = blockRect.top + (blockRect.height - elementRect.height) / 2;

        const realLeft = Math.max(
            editorRect.left,
            Math.min(editorRect.right - blockRect.width - elementRect.width, left));
        const realTop = Math.max(blockRect.top, Math.min(blockRect.bottom - elementRect.height, top));

        element.style.left = `${realLeft}px`;
        element.style.top = `${realTop}px`;
    }
}
