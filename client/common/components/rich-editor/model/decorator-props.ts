interface IDecoratorProps {
    children?: Array<JSX.Element> | JSX.Element | null;
    entityKey?: string;
    lockEditor: (entityKey: string) => void;
    unlockEditor: (entityKey: string) => void;
}

export default IDecoratorProps;
