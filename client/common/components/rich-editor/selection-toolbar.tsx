import * as classNames from "classnames";
import { CharacterMetadata, EditorState, Entity, RichUtils } from "draft-js";
import { first, includes, isEmpty, isNull, map } from "lodash";
import * as React from "react";
import { Icon, Tooltip } from "react-mdl";

import ElementHelper from "./../../helpers/element-helper";
import KeyCodes from "./../../helpers/key-codes";
import translate from "./../../translation";
import Action from "./model/action";
import IActionLinkData from "./model/action-link-data";
import EditorChangeType from "./model/editor-change-type";
import EntityMutability from "./model/entity-mutability";
import EntityType from "./model/entity-type";

import {
    actionInput,
    disabledToolbarButton,
    selectedToolbarButton,
    selectionToolbar,
    toolbarButton,
} from "./styles/index.scss";

interface ISelectionToolbarState {
    action?: Action;
    actionSelection?: {
        endKey?: string;
        endOffset?: number;
        startKey?: string;
        startOffset?: number;
    };
    selectionRect?: ClientRect;
    textValue?: string;
}

interface ISelectionToolbarProps {
    editorRect: ClientRect;
    editorState: EditorState;
    selectionRect: ClientRect;
    updateEditorState: (editorState: EditorState) => void;
}

const inlineStyles: Array<{ iconName: string, style: string, translationKey: string }> = [
    { iconName: "format_bold", style: "BOLD", translationKey: "bold" },
    { iconName: "format_italic", style: "ITALIC", translationKey: "italic" },
    { iconName: "format_underline", style: "UNDERLINE", translationKey: "underline" },
];

export default class SelectionToolbar extends React.Component<ISelectionToolbarProps, ISelectionToolbarState> {
    constructor(props: ISelectionToolbarProps) {
        super(props);

        this.state = {
            action: null,
            selectionRect: props.selectionRect,
        };
    }

    public componentWillReceiveProps(nextProps: ISelectionToolbarProps) {
        const { action, actionSelection } = this.state;
        const { selectionRect } = nextProps;

        let hasAction = !isNull(action);

        if (hasAction && actionSelection) {
            const { editorState } = nextProps;
            const selectionState = editorState.getSelection();
            const startKey = selectionState.getStartKey();
            const endKey = selectionState.getEndKey();
            const startOffset = selectionState.getStartOffset();
            const endOffset = selectionState.getEndOffset();

            const needResetAction = !actionSelection ||
                actionSelection.startKey !== startKey ||
                actionSelection.endKey !== endKey ||
                actionSelection.startOffset !== startOffset ||
                actionSelection.endOffset !== endOffset;

            if (needResetAction) {
                hasAction = false;

                this.setState({
                    action: null,
                    actionSelection: null,
                });
            }
        }

        if (!hasAction || selectionRect) {
            this.setState({ selectionRect });
        }
    }

    public render() {
        const { selectionRect } = this.state;

        if (!selectionRect) {
            return null;
        }

        const { action } = this.state;
        const actionEmpty = isNull(action);

        return (
            <div ref={this.updatePopupPosition.bind(this)} className={selectionToolbar}>
                {actionEmpty && this.renderInlineStylesButtons()}
                {actionEmpty && this.renderLinkButtons()}
                {!actionEmpty && this.renderAction()}
            </div>
        );
    }

    private updatePopupPosition(element: HTMLElement) {
        if (!element) {
            return;
        }

        const { selectionRect } = this.state;
        const { editorRect } = this.props;
        const elementRect = ElementHelper.getElementRect(element);

        const left = selectionRect.left + (selectionRect.width - elementRect.width) / 2;
        const top = selectionRect.top - elementRect.height;

        const realLeft = Math.max(editorRect.left, Math.min(editorRect.right - elementRect.width, left));
        const realTop = top > editorRect.top ? top : selectionRect.bottom;

        element.style.left = `${realLeft}px`;
        element.style.top = `${realTop}px`;
    }

    private inlineStyleHandler(inlineStyle: string, event: React.MouseEvent) {
        if (event) {
            event.preventDefault();
        }

        const { editorState, updateEditorState } = this.props;

        updateEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    }

    private setAction(action: Action, data: IActionLinkData, event: React.MouseEvent = null) {
        if (event) {
            event.preventDefault();
        }

        const buildSelection = () => {
            const { editorState } = this.props;
            const selectionState = editorState.getSelection();

            return {
                endKey: selectionState.getEndKey(),
                endOffset: selectionState.getEndOffset(),
                startKey: selectionState.getStartKey(),
                startOffset: selectionState.getStartOffset(),
            };
        };

        switch (action) {
            case Action.link:
                this.setState({
                    action,
                    actionSelection: buildSelection(),
                    textValue: data.url,
                });
                break;

            default:
                this.setState({
                    action: null,
                    actionSelection: null,
                    selectionRect: null,
                    textValue: null,
                });
                break;
        }
    }

    private renderInlineStylesButtons(): Array<JSX.Element> {
        const { editorState } = this.props;
        const currentStyle = editorState.getCurrentInlineStyle();

        return map(inlineStyles, inlineStyle => (
            <Tooltip
                key={inlineStyle.style}
                className={classNames(
                    toolbarButton,
                    { [selectedToolbarButton]: currentStyle.has(inlineStyle.style) }
                )}
                label={translate("SelectionToolbar", inlineStyle.translationKey)}
                position="bottom"
                onMouseDown={this.inlineStyleHandler.bind(this, inlineStyle.style)}
            >
                <Icon name={inlineStyle.iconName} />
            </Tooltip>
        ));
    }

    private renderLinkButtons(): Array<JSX.Element> {
        const { editorState } = this.props;
        const selectionState = editorState.getSelection();
        const currentBlock = editorState.getCurrentContent().getBlockForKey(selectionState.getStartKey());
        const startOffset = selectionState.getStartOffset();
        const endOffset = selectionState.getEndOffset();
        const minOffset = Math.min(startOffset, endOffset);
        const maxOffset = Math.max(startOffset, endOffset);

        const links: Array<string> = [];

        for (let offset = minOffset; offset < maxOffset; offset++) {
            const entityKey = currentBlock.getEntityAt(offset);

            if (isNull(entityKey)) {
                continue;
            }

            const entity = Entity.get(entityKey);
            const { url = null }: IActionLinkData = entity.getData();

            if (entity.getType() === EntityType.link && !isNull(url) && !includes(links, url)) {
                links.push(url);
            }
        }

        const hasLink = !isEmpty(links);

        const buttons = [
            (
                <Tooltip
                    key="add-link"
                    className={classNames(toolbarButton, { [selectedToolbarButton]: hasLink })}
                    label={translate("SelectionToolbar", "addLink")}
                    position="bottom"
                    onMouseDown={this.setAction.bind(this, Action.link, { url: first(links) || "" })}
                >
                    <Icon name="link" />
                </Tooltip>
            ),
        ];

        if (hasLink) {
            buttons.push(
                <Tooltip
                    key="remove-link"
                    className={classNames(toolbarButton, { [selectedToolbarButton]: hasLink })}
                    label={translate("SelectionToolbar", "removeLink")}
                    position="bottom"
                    onMouseDown={this.setAction.bind(this, Action.link, { url: first(links) || "" })}
                >
                    <Icon name="link" />
                </Tooltip>
            );
        }

        return buttons;
    }

    private renderAction(): Array<JSX.Element> | JSX.Element | null {
        const { action } = this.state;

        switch (action) {
            case Action.link:
                return this.renderAddLinkAction();

            default:
                return null;
        }
    }

    private removeLink(url: string, event: React.MouseEvent = null) {
        if (event) {
            event.preventDefault();
        }

        const { editorState, updateEditorState } = this.props;
        const selectionState = editorState.getSelection();
        const selectionBlockKey = selectionState.getStartKey();
        const startOffset = selectionState.getStartOffset();
        const endOffset = selectionState.getEndOffset();
        const minOffset = Math.min(startOffset, endOffset);
        const maxOffset = Math.max(startOffset, endOffset);
        const contentState = editorState.getCurrentContent();
        const blockMap = contentState.getBlockMap();
        const block = blockMap.get(selectionBlockKey);
        const charList = block.getCharacterList();
        const newCharList = charList.map((characterMetadata: CharacterMetadata, index: number) =>
            index >= minOffset && index < maxOffset
                ? CharacterMetadata.applyEntity(characterMetadata, null)
                : characterMetadata
        );
        block.set("characterList", newCharList);
        const newBlockMap = blockMap.set(selectionBlockKey, block);
        contentState.set("blockMap", newBlockMap);

        return EditorState.push(editorState, contentState, EditorChangeType.applyEntity);
    }

    private addLink(url: string, event: React.MouseEvent = null) {
        this.setAction(null, null, event);

        const { editorState, updateEditorState } = this.props;
        const selectionState = editorState.getSelection();

        const entityKey = Entity.create(EntityType.link, EntityMutability.mutable, { url });

        updateEditorState(RichUtils.toggleLink(editorState, selectionState, entityKey));
    }

    private updateTextValue(event: React.FormEvent) {
        this.setState({ textValue: (event.target as HTMLInputElement).value });
    }

    private handleActionKeyDown(event: SyntheticKeyboardEvent) {
        const { textValue = "" } = this.state;

        switch (event.keyCode) {
            case KeyCodes.escape:
                this.setAction(null, null);
                break;

            case KeyCodes.enter:
                if (textValue) {
                    this.addLink(textValue);
                }
                break;

            default: break;
        }
    }

    private renderAddLinkAction(): Array<JSX.Element> {
        const { textValue = "" } = this.state;

        return [
            (
                <input
                    key="input"
                    ref={ElementHelper.focusElement}
                    className={actionInput}
                    type="text"
                    value={textValue}
                    onChange={this.updateTextValue.bind(this)}
                    onKeyDown={this.handleActionKeyDown.bind(this)}
                    onBlur={this.setAction.bind(this, null, null)}
                />
            ),
            (
                <Tooltip
                    key="action"
                    className={classNames(toolbarButton, { [disabledToolbarButton]: !textValue })}
                    label={translate("SelectionToolbar", "addLink")}
                    position="bottom"
                    onMouseDown={!!textValue && this.addLink.bind(this, textValue)}
                >
                    <Icon name="link" />
                </Tooltip>
            ),
        ];
    }
}
