import * as _ from "lodash";

export default class ElementHelper {
    public static fromWindowToDocument(clientRect: ClientRect): ClientRect {
        if (!clientRect) {
            return clientRect;
        }

        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        return {
            bottom: clientRect.bottom + scrollY,
            height: clientRect.height,
            left: clientRect.left + scrollX,
            right: clientRect.right + scrollX,
            top: clientRect.top + scrollY,
            width: clientRect.width
         };
    }

    public static getElementRect(element: Element): ClientRect {
        if (!element) {
            throw new Error("'element' is not defined");
        }

        const documentElement: Element = document.documentElement;
        const boundingClientRect: ClientRect = element.getBoundingClientRect();

        const left = boundingClientRect.left - documentElement.clientLeft;
        const right = boundingClientRect.right - documentElement.clientLeft;
        const top = boundingClientRect.top - documentElement.clientTop;
        const bottom = boundingClientRect.bottom - documentElement.clientTop;

        return ElementHelper.fromWindowToDocument(
            { bottom, height: bottom - top, left, right, top, width: right - left }
        );
    }

    public static isWithinContainer(container: Node, ...checkNodes: Array<Node>): boolean {
        if (!container || checkNodes.length <= 0) {
            throw new Error("'container' or 'checkNodes' are not set");
        }

        let cachedParentNode: Node = null;

        return _.every(checkNodes, node => {
            const parentNode = node.parentNode;

            if (cachedParentNode === parentNode) {
                return true;
            }

            for (let iteratorNode = parentNode; !_.isNil(iteratorNode); iteratorNode = iteratorNode.parentNode) {
                if (iteratorNode === container) {
                    cachedParentNode = parentNode;

                    return true;
                }
            }

            return false;
        });
    }
}
