import {  } from "draft-js";
import * as katex from "katex";
import {  } from "lodash";
import * as React from "react";

import translate from "./../../../translation";

interface IFormulaEditorBlockState {
    formula?: string;
    formulaHtml?: string;
    formulaOrigin?: string;
    isFormulaValid?: boolean;
    isInEditState?: boolean;
}

interface IFormulaEditorBlockProps {
    blockProps: {
        entityKey: string;
        entityData: Object;
        lockEditor: Function;
        unlockEditor: Function;
    };
}

export default class FormulaEditorBlock extends React.Component<IFormulaEditorBlockProps, IFormulaEditorBlockState> {
    public constructor(props: IFormulaEditorBlockProps) {
        super(props);

        this.state = {
            formula: "",
            formulaHtml: "",
            formulaOrigin: "",
            isFormulaValid: false,
            isInEditState: false,
        };
    }

    public render(): JSX.Element {
        const { isInEditState, isFormulaValid, formula } = this.state;

        return (
            <div className={"TODO"}>
                <div
                    className={"TODO"}
                    style={{ border: "1px solid red", minHeight: "100px" }}
                    onClick={this.toggleEditState.bind(this)}
                    ref={this.renderFormula.bind(this)}
                />

                {isInEditState && (
                    <div className={"TODO"}>
                        <textarea
                            className={"TODO"}
                            onChange={this.formulaTextChanged.bind(this)}
                            value={formula}
                        />

                        <div className="TeXEditor-buttons">
                            <button
                                className={"TODO"}
                                disabled={!isFormulaValid}
                                onClick={this.saveFormula.bind(this)}
                            >
                                {translate("FormulaEditorBlock", "save")}
                            </button>

                            <button
                                className={"TODO"}
                                onClick={this.removeFormula.bind(this)}
                            >
                                {translate("FormulaEditorBlock", "remove")}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    private renderFormula(element: HTMLDivElement) {
        const { formulaHtml } = this.state;

        if (!element || !formulaHtml) {
            return;
        }

        element.innerHTML = formulaHtml;
    }

    private toggleEditState() {
        const { isInEditState, formula, formulaOrigin } = this.state;
        const { blockProps: { entityKey, lockEditor, unlockEditor } } = this.props;

        if (isInEditState) {
            unlockEditor(entityKey);
        } else {
            lockEditor(entityKey);
        }

        this.setState({
            formula: isInEditState ? formulaOrigin : formula,
            formulaOrigin: formula,
            isInEditState: !isInEditState,
        });
    }

    private formulaTextChanged(event: React.FormEvent) {
        const { value } = event.target as HTMLTextAreaElement;

        let formula = value || "";
        let formulaHtml = "";
        let isFormulaValid = true;

        try {
            formulaHtml = katex.renderToString(formula);
        } catch (ParseError) {
            isFormulaValid = false;
        }

        this.setState({ formula, formulaHtml, isFormulaValid });
    }

    private saveFormula() {
        const { blockProps: { entityKey, unlockEditor } } = this.props;

        unlockEditor(entityKey);

        this.setState({ isInEditState: false });
    }

    private removeFormula() {
        const { blockProps: { entityKey, unlockEditor } } = this.props;

        unlockEditor(entityKey);

        this.setState({ isInEditState: false });
    }
}
