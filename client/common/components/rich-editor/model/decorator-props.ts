interface IDecoratorProps {
    children: Array<JSX.Element> | JSX.Element | null;
    entityKey: string;
    lockEditor: Function;
    unlockEditor: Function;
}

export default IDecoratorProps;
