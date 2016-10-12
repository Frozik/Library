import * as classnames from "classnames";
import { ContentBlock, Entity } from "draft-js";
import * as katex from "katex";
import { isNull } from "lodash";
import * as React from "react";

import ElementHelper from "./../../../helpers/element-helper";
import translate from "./../../../translation";
import IDecoratorFormulaData from "./../model/decorator-formula-data";
import IDecoratorProps from "./../model/decorator-props";
import StrategyCallBackType from "./../model/decorator-strategy-callback";
import EntityType from "./../model/entity-type";

import {
    buttonAction,
    buttonsContainer,
    container,
    editMode,
    editorContainer,
    formula,
    inactive,
    input,
    invalid,
} from "./../styles/formula-decorator.scss";

interface ILinkState {
    text?: string;
    html?: string;
    isValid?: boolean;
    isInEditState?: boolean;
}

class Formula extends React.Component<IDecoratorProps, ILinkState> {
    public constructor(props: IDecoratorProps) {
        super(props);

        this.state = this.buildInitialState(props);
    }

    public componentWillReceiveProps(nextProps: IDecoratorProps) {
        this.setState(this.buildInitialState(nextProps));
    }

    public render(): JSX.Element {
        const { isInEditState, isValid, text } = this.state;

        return (
            <div
                contentEditable={false}
                className={classnames(container, { [editMode]: isInEditState })}
                onClick={!isInEditState && this.toggleEditState.bind(this)}
            >
                {((!!text && !isInEditState) || (isValid && isInEditState)) && (
                    <div
                        className={classnames(formula, { [editMode]: isInEditState })}
                        onClick={this.toggleEditState.bind(this)}
                        ref={this.renderFormula.bind(this)}
                    />
                )}

                {(!text && !isInEditState) && (
                    <span>{translate("FormulaDecorator", "empty")}</span>
                )}

                {(!isValid && isInEditState) && (
                    <span className={invalid}>
                        {translate("FormulaDecorator", "invalid")}
                    </span>
                )}

                {isInEditState && (
                    <div className={editorContainer}>
                        <textarea
                            ref={ElementHelper.focusElement}
                            className={input}
                            placeholder={translate("FormulaDecorator", "placeholder")}
                            onChange={this.formulaTextChanged.bind(this)}
                            value={text}
                        />
                        <div className={buttonsContainer}>
                            <button
                                className={classnames(buttonAction, { [inactive]: !isValid })}
                                disabled={!isValid}
                                onClick={this.saveFormula.bind(this)}
                            >
                                {translate("FormulaDecorator", "save")}
                            </button>

                            <button
                                className={buttonAction}
                                onClick={this.cancelFormula.bind(this)}
                            >
                                {translate("FormulaDecorator", "cancel")}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    private buildInitialState(props: IDecoratorProps): ILinkState {
        const { entityKey } = props;
        const { text }: IDecoratorFormulaData = Entity.get(entityKey).getData();

        return {
            html: katex.renderToString(text),
            isInEditState: false,
            isValid: true,
            text,
        };
    }

    private renderFormula(element: HTMLDivElement) {
        const { html } = this.state;

        if (!element) {
            return;
        }

        element.innerHTML = html || "";
    }

    private toggleEditState() {
        const { entityKey, lockEditor, unlockEditor } = this.props;
        const { text }: IDecoratorFormulaData = Entity.get(entityKey).getData();
        const { isInEditState } = this.state;

        if (isInEditState) {
            unlockEditor(entityKey);
        } else {
            lockEditor(entityKey);
        }

        this.setState({ html: katex.renderToString(text), isInEditState: !isInEditState, text });
    }

    private formulaTextChanged(event: React.FormEvent) {
        const { value } = event.target as HTMLTextAreaElement;

        let text = value || "";
        let html = "";
        let isValid = true;

        try {
            html = katex.renderToString(text);
        } catch (ParseError) {
            html = "";
            isValid = false;
        }

        this.setState({ text, html, isValid });
    }

    private saveFormula() {
        const { entityKey, unlockEditor } = this.props;
        const { text } = this.state;

        Entity.mergeData(entityKey, { text });

        unlockEditor(entityKey);

        this.setState({ isInEditState: false });
    }

    private cancelFormula() {
        const { entityKey, unlockEditor } = this.props;
        const { text }: IDecoratorFormulaData = Entity.get(entityKey).getData();

        unlockEditor(entityKey);

        this.setState({ text, isInEditState: false, isValid: true });
    }
}

function strategy(contentBlock: ContentBlock, callback: StrategyCallBackType) {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();

        return !isNull(entityKey) && Entity.get(entityKey).getType() === EntityType.formula;
    }, callback);
}

export const formulaComponent = Formula;
export const formulaStrategy = strategy;
