import * as _ from "lodash";

export default class ElementHelper {
    public static getElementRect(element: Element): ClientRect {
        if (!element) {
            throw new Error("'element' is not defined");
        }

        const documentElement: Element = document.documentElement;
        const boundingClientRect: ClientRect = element.getBoundingClientRect();

        const left = Math.round(boundingClientRect.left) - documentElement.clientLeft;
        const right = Math.round(boundingClientRect.right) - documentElement.clientLeft;
        const top = Math.round(boundingClientRect.top) - documentElement.clientTop;
        const bottom = Math.round(boundingClientRect.bottom) - documentElement.clientTop;

        return { bottom, height: bottom - top, left, right, top, width: right - left };
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
