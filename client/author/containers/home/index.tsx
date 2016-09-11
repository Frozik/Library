import * as React from "react";

import RichEditor from "./../../../common/components/rich-editor";

interface IAuthorHomeState {}

interface IAuthorHomeProps {}

export default class AuthorHome extends React.Component<IAuthorHomeProps, IAuthorHomeState> {
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
