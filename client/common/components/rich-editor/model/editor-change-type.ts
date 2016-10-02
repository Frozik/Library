type EditorChangeType = (
    "adjust-depth" |
    "apply-entity" |
    "backspace-character" |
    "change-block-data" |
    "change-block-type" |
    "change-inline-style" |
    "delete-character" |
    "insert-characters" |
    "insert-fragment" |
    "redo" |
    "remove-range" |
    "spellcheck-change" |
    "split-block" |
    "undo"
);



export default {
    adjustDepth: "adjust-depth" as EditorChangeType,
    applyEntity: "apply-entity" as EditorChangeType,
    backspaceCharacter: "backspace-character" as EditorChangeType,
    changeBlockData: "change-block-data" as EditorChangeType,
    changeBlockType: "change-block-type" as EditorChangeType,
    changeInlineStyle: "change-inline-style" as EditorChangeType,
    deleteCharacter: "delete-character" as EditorChangeType,
    insertCharacters: "insert-characters" as EditorChangeType,
    insertFragment: "insert-fragment" as EditorChangeType,
    redo: "redo" as EditorChangeType,
    removeRange: "remove-range" as EditorChangeType,
    spellcheckChange: "spellcheck-change" as EditorChangeType,
    splitBlock: "split-block" as EditorChangeType,
    undo: "undo" as EditorChangeType,
};

