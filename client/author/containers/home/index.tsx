import * as React from "react";

import { RichEditor } from "./../../../common/components/rich-editor";

export interface IAuthorHomeState {}

export interface IAuthorHomeProps {}

export class AuthorHome extends React.Component<IAuthorHomeState, IAuthorHomeProps> {
    public state: IAuthorHomeState;

    constructor(props: IAuthorHomeProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <div>
                <RichEditor />
            </div>
        );
    }
}
