import {
    CompositeDecorator,
    ContentBlock,
    Editor,
    EditorState,
    Entity,
    RichUtils,
    getVisibleSelectionRect,
} from "draft-js";
import { concat, defer, includes, isEmpty, isEqual, without } from "lodash";
import * as React from "react";
import { findDOMNode } from "react-dom";

import ElementHelper from "./../../helpers/element-helper";
import KeyCodes from "./../../helpers/key-codes";
import FormulaEditorBlock from "./blocks/formula-editor-block";
import { linkComponent, linkStrategy } from "./decorators/link-decorator";
import BlockType from "./model/block-type";
import EntityType from "./model/entity-type";
import BlockToolbar from "./toolbars/block-toolbar";
import SelectionToolbar  from "./toolbars/selection-toolbar";

import { editor } from "./styles/index.scss";

interface IRichEditorState {
    blockRect?: ClientRect;
    editedEntities?: Array<string>;
    editorRect?: ClientRect;
    editorState?: EditorState;
    selectionRect?: ClientRect;
}

interface IRichEditorProps {}

export default class RichEditor extends React.Component<IRichEditorProps, IRichEditorState> {
    public constructor(props: IRichEditorProps) {
        super(props);

        const compositeDecorator = new CompositeDecorator([
            {
                component: linkComponent,
                props: {
                    lockEditor: this.lockEditor.bind(this),
                    unlockEditor: this.unlockEditor.bind(this),
                },
                strategy: linkStrategy,
            },
        ]);

        const editorState = EditorState.createEmpty(compositeDecorator);

        this.state = {
            editedEntities: [],
            editorState,
        };
    }

    public render(): JSX.Element {
        const { blockRect, editedEntities, editorRect, editorState, selectionRect } = this.state;

        return (
            <div className={editor}>
                <SelectionToolbar
                    editorRect={editorRect}
                    editorState={editorState}
                    selectionRect={selectionRect}
                    updateEditorState={this.editorStateChanged.bind(this)}
                />

                <BlockToolbar
                    blockRect={blockRect}
                    editorRect={editorRect}
                    editorState={editorState}
                    updateEditorState={this.editorStateChanged.bind(this)}
                />

                <Editor
                    blockRendererFn={this.blockRenderer.bind(this)}
                    editorState={editorState}
                    handleKeyCommand={this.handleKeyCommand.bind(this)}
                    handleReturn={this.handleReturn.bind(this)}
                    onTab={this.handleTab.bind(this)}
                    onChange={this.editorStateChanged.bind(this)}
                    onFocus={this.deferUpdateToolbars.bind(this, editorState)}
                    onBlur={this.deferResetToolbars.bind(this)}
                    readOnly={!isEmpty(editedEntities)}
                    spellCheck
                />
            </div>
        );
    }

    private lockEditor(entityKey: string) {
        const { editedEntities } = this.state;

        if (includes(editedEntities, entityKey)) {
            return;
        }

        this.setState({ editedEntities: concat(editedEntities, entityKey) });
    }

    private unlockEditor(entityKey: string) {
        const { editedEntities } = this.state;

        if (!includes(editedEntities, entityKey)) {
            return;
        }

        this.setState({ editedEntities: without(editedEntities, entityKey) });
    }

    private editorStateChanged(editorState: EditorState) {
        this.setState({ editorState });

        this.deferUpdateToolbars(editorState);
    }

    private updateToolbars(editorState: EditorState) {
        const {
            blockRect: originalBlockRect,
            editorRect: originalEditorRect,
            selectionRect: originalSelectionRect,
        } = this.state;
        const selectionState = editorState.getSelection();

        const editorNode = findDOMNode(this);

        if (!editorNode) {
            return;
        }

        const editorRect: ClientRect = ElementHelper.getElementRect(editorNode);
        let blockRect: ClientRect = null;
        let selectionRect: ClientRect = null;

        if (selectionState.getHasFocus()) {
            blockRect = this.getEditBlockNodeRect(editorState, editorNode);
            selectionRect = this.getSelectionRect(editorState);
        }

        if (!isEqual(editorRect, originalEditorRect)) {
            this.setState({ editorRect });
        }

        if (!isEqual(blockRect, originalBlockRect)) {
            this.setState({ blockRect });
        }

        if (!isEqual(selectionRect, originalSelectionRect)) {
            this.setState({ selectionRect });
        }
    }

    private deferUpdateToolbars(editorState: EditorState) {
        defer(this.updateToolbars.bind(this, editorState));
    }

    private resetToolbars() {
        this.setState({
            blockRect: null,
            selectionRect: null,
        });
    }

    private deferResetToolbars() {
        defer(this.resetToolbars.bind(this));
    }

    private getEditBlockNodeRect(editorState: EditorState, editorNode: Element): ClientRect {
        const { anchorNode, focusNode } = window.getSelection();

        if (!anchorNode || !focusNode) {
            return null;
        }

        if (!ElementHelper.isWithinContainer(editorNode, anchorNode, focusNode)) {
            return null;
        }

        const selectionElement = editorState.getSelection().getIsBackward() ? focusNode : anchorNode;

        let iterator: Node | Element = selectionElement;

        while (iterator && (!(iterator instanceof Element) || !iterator.getAttribute("data-block"))) {
            iterator = iterator.parentNode;
        }

        const blockElement = iterator instanceof Element ? iterator : null;

        if (!blockElement) {
            return null;
        }

        return ElementHelper.getElementRect(blockElement);
    }

    private getSelectionRect(editorState: EditorState): ClientRect {
        const selectionState = editorState.getSelection();

        if (selectionState.isCollapsed() || selectionState.getStartKey() !== selectionState.getEndKey()) {
            return null;
        }

        const visibleSelectionRect = getVisibleSelectionRect(window);

        return visibleSelectionRect ? ElementHelper.fromWindowToDocument(visibleSelectionRect) : null;
    }

    private handleKeyCommand(command: any): boolean {
        const { editorState } = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            this.editorStateChanged(newState);

            return true;
        }

        return false;
    }

    private handleReturn(event: React.KeyboardEvent): boolean {
        const { editorState } = this.state;

        switch (event.keyCode) {
            case KeyCodes.enter:
                if (event.shiftKey) {
                    this.editorStateChanged(RichUtils.insertSoftNewline(editorState));

                    return true;
                }

                return false;

            default:
                return false;
        }
    }

    private handleTab(event: SyntheticKeyboardEvent) {
        const { editorState } = this.state;

        const newState = RichUtils.onTab(event, editorState, 4);

        this.editorStateChanged(newState);
    }

    private blockRenderer(block: ContentBlock) {
        if (block.getType() === BlockType.atomic) {
            const firstBlockEntityKey = block.getEntityAt(0);
            const entity = firstBlockEntityKey ? Entity.get(firstBlockEntityKey) : null;
            const entityData = entity ? entity.getData() : null;
            const entityType = entity ? entity.getType() : null;

            switch (entityType) {
                case EntityType.formula:
                    return {
                        component: FormulaEditorBlock,
                        editable: false,
                        props: {
                            entityKey: firstBlockEntityKey,
                            entityData,
                            lockEditor: this.lockEditor.bind(this),
                            unlockEditor: this.unlockEditor.bind(this),
                        },
                    };

                default:
                    return null;
            }

        }

        return null;
    }
}
