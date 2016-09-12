import { EditorState } from "draft-js";
import * as React from "react";

import ElementHelper from "./../../helpers/element-helper";

import { blockToolbar } from "./index.scss";

interface IBlockToolbarState {}

interface IBlockToolbarProps {
    blockRect: ClientRect;
    editorRect: ClientRect;
    editorState: EditorState;
    updateEditorState: (editorState: EditorState) => void;
}
/*
const blockStyles: Array<{ iconName?: string, style: string, text?: string, translationKey: string }> = [
    { style: "header-one", text: "H1", translationKey: "eaderOne" },
    { style: "header-two", text: "H2", translationKey: "headerTwo" },
    { iconName: "format_underline", style: "unordered-list-item", translationKey: "unorderedListItem" },
    { iconName: "format_underline", style: "ordered-list-item", translationKey: "orderedListItem" },
    { iconName: "format_underline", style: "blockquote", translationKey: "blockquote" },
];
*/
export default class BlockToolbar extends React.Component<IBlockToolbarProps, IBlockToolbarState> {
    public render() {
        return (
            <div ref={this.updatePopupPosition.bind(this)} className={blockToolbar}>
                Test
            </div>
        );
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
