import { ContentBlock, Entity } from "draft-js";
import { isNull } from "lodash";
import * as React from "react";

import IDecoratorLinkData from "./../model/decorator-link-data";
import IDecoratorProps from "./../model/decorator-props";
import StrategyCallBackType from "./../model/decorator-strategy-callback";
import EntityType from "./../model/entity-type";

interface ILinkState {}

class Link extends React.Component<IDecoratorProps, ILinkState> {
    public render(): JSX.Element {
        const { children, entityKey } = this.props;
        const { url }: IDecoratorLinkData = Entity.get(entityKey).getData();

        return (
             <a href={url}>
                {children}
            </a>
        );
    }
}

function strategy(contentBlock: ContentBlock, callback: StrategyCallBackType) {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();

        return !isNull(entityKey) && Entity.get(entityKey).getType() === EntityType.link;
    }, callback);
}

export const linkComponent = Link;
export const linkStrategy = strategy;
