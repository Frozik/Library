import * as React from "react";

import { editor } from "./index.css";

export interface IRichEditorState {}

export interface IRichEditorProps {}

export class RichEditor extends React.Component<IRichEditorState, IRichEditorProps> {
    public state: IRichEditorState;

    constructor(props: IRichEditorProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <div className={editor}>
                Hi, there
            </div>
        );
    }
}
