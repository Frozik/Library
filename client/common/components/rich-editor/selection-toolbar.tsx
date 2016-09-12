import * as classNames from "classnames";
import { EditorState, RichUtils } from "draft-js";
import { map } from "lodash";
import * as React from "react";
import { Icon, Tooltip } from "react-mdl";

import Translation from "./../../../translation";
import ElementHelper from "./../../helpers/element-helper";

import { selectedToolbarButton, selectionToolbar, toolbarButton } from "./index.scss";

interface ISelectionToolbarState {}

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
    public render() {
        const { editorState } = this.props;

        const currentStyle = editorState.getCurrentInlineStyle();

        return (
            <div ref={this.updatePopupPosition.bind(this)} className={selectionToolbar}>
                {map(inlineStyles, inlineStyle => (
                    <Tooltip
                        key={inlineStyle.style}
                        className={classNames(
                            toolbarButton,
                            { [selectedToolbarButton]: currentStyle.has(inlineStyle.style) }
                        )}
                        label={Translation.translate("common", "SelectionToolbar", inlineStyle.translationKey)}
                        position="bottom"
                        onMouseDown={this.getInlineStyleHandler.bind(this, inlineStyle.style)}
                    >
                        <Icon name={inlineStyle.iconName} />
                    </Tooltip>
                ))}
            </div>
        );
    }

    private updatePopupPosition(element: HTMLElement) {
        if (!element) {
            return;
        }

        const { editorRect, selectionRect } = this.props;
        const elementRect = ElementHelper.getElementRect(element);

        const left = selectionRect.left + (selectionRect.width - elementRect.width) / 2;
        const top = selectionRect.top - elementRect.height;

        const realLeft = Math.max(editorRect.left, Math.min(editorRect.right - elementRect.width, left));
        const realTop = top > editorRect.top ? top : selectionRect.bottom;

        element.style.left = `${realLeft}px`;
        element.style.top = `${realTop}px`;
    }

    private getInlineStyleHandler(inlineStyle: string, event: React.MouseEvent) {
        event.preventDefault();

        const { editorState, updateEditorState } = this.props;

        updateEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    }
}
