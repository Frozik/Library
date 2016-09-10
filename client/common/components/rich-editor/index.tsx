import { Editor, EditorState } from "draft-js";
import * as React from "react";

import { editor } from "./index.css";

interface IToolbarState {
    show: boolean;
}

interface IRichEditorState {
    editorState?: EditorState;
    inlineToolbar?: IToolbarState;
}

export interface IRichEditorProps {}

export class RichEditor extends React.Component<IRichEditorProps, IRichEditorState> {
    public constructor(props: IRichEditorProps) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
            inlineToolbar: {
                show: false,
            }
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
        this.setState({ editorState });
    }
}
