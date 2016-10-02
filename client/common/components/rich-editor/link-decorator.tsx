import { ContentBlock, Entity } from "draft-js";
import * as React from "react";

import IActionLinkData from "./model/action-link-data";
import IDecoratorProps from "./model/decorator-props";
import IDraftDecorator from "./model/draft-decorator";
import EntityType from "./model/entity-type";

const Link = ({ children, entityKey }: IDecoratorProps): JSX.Element => {
    const { url }: IActionLinkData = Entity.get(entityKey).getData();

    return (
        <a href={url}>
            {children}
        </a>
    );
};

function findLinkEntities(contentBlock: ContentBlock, callback: (start: number, end: number) => void) {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();

        return (
            entityKey != null &&
            Entity.get(entityKey).getType() === EntityType.link
        );
    }, callback);
}

const decorator: IDraftDecorator = {
    component: Link,
    strategy: findLinkEntities,
};

export default decorator;
