import { ContentBlock } from "draft-js";

interface IDraftDecorator {
    strategy: (block: ContentBlock, callback: (start: number, end: number) => void) => void;
    component: Function;
    props?: Object;
}

export default IDraftDecorator;
