import { Editor, EditorState, getVisibleSelectionRect } from "draft-js";
import * as React from "react";
import { findDOMNode } from "react-dom";

import ElementHelper from "./../../helpers/element-helper";

import { editor } from "./index.css";

interface IRichEditorState {
    editorState?: EditorState;
    blockRect?: ClientRect;
    selectionRect?: ClientRect;
}

export interface IRichEditorProps {}

export class RichEditor extends React.Component<IRichEditorProps, IRichEditorState> {
    public constructor(props: IRichEditorProps) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
        };
    }

    public render() {
        const { editorState } = this.state;

        return (
            <div className={editor}>
                <Editor
                    editorState={editorState}
                    onChange={this.editorStateChanged.bind(this)}
                    spellCheck
                />
            </div>
        );
    }

    protected editorStateChanged(editorState: EditorState) {
        this.setState({
            editorState,
            blockRect: this.getEditBlockNodeRect(editorState),
            selectionRect: this.getSelectionRect(editorState),
        });
    }

    protected getEditBlockNodeRect(editorState: EditorState): ClientRect {
        const componentRootNode =  findDOMNode(this);

        if (!componentRootNode) {
            return null;
        }

        const { anchorNode, focusNode } = window.getSelection();

        if (!anchorNode || !focusNode) {
            return null;
        }

        if (!ElementHelper.isWithinContainer(componentRootNode, anchorNode, focusNode)) {
            return null;
        }

        const selectionElement = editorState.getSelection().getIsBackward() ? focusNode : anchorNode;

        let iterator: Node | Element = selectionElement;

        while (iterator && (!(iterator instanceof Element) || !iterator.getAttribute("data-block"))) {
            iterator = iterator.parentNode;
        }

        const blockElement = iterator instanceof Element ? iterator : null;

        if (!blockElement) {
            return null;
        }

        return ElementHelper.getElementRect(blockElement);
    }

    protected getSelectionRect(editorState: EditorState): ClientRect {
        return !editorState.getSelection().isCollapsed() ? getVisibleSelectionRect(window) : null;
    }
}
