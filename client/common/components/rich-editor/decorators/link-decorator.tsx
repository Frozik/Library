import { ContentBlock, Entity } from "draft-js";
import { isNull } from "lodash";
import * as React from "react";

import IActionLinkData from "./../model/action-link-data";
import IDecoratorProps from "./../model/decorator-props";
import EntityType from "./../model/entity-type";

export const linkComponent = ({ children, entityKey }: IDecoratorProps): JSX.Element => {
    const { url }: IActionLinkData = Entity.get(entityKey).getData();

    return (
        <a href={url}>
            {children}
        </a>
    );
};

export const linkStrategy = (contentBlock: ContentBlock, callback: (start: number, end: number) => void) => {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();

        return !isNull(entityKey) && Entity.get(entityKey).getType() === EntityType.link;
    }, callback);
};
