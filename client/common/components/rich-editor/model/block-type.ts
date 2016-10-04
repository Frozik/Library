type DraftBlockType = (
    "unstyled" |
    "paragraph" |
    "header-one" |
    "header-two" |
    "header-three" |
    "header-four" |
    "header-five" |
    "header-six" |
    "unordered-list-item" |
    "ordered-list-item" |
    "blockquote" |
    "code-block" |
    "atomic"
);

export default {
    atomic: "atomic" as DraftBlockType,
    blockquote: "blockquote" as DraftBlockType,
    codeBlock: "code-block" as DraftBlockType,
    headerFive: "header-five" as DraftBlockType,
    headerFour: "header-four" as DraftBlockType,
    headerOne: "header-one" as DraftBlockType,
    headerSix: "header-six" as DraftBlockType,
    headerThree: "header-three" as DraftBlockType,
    headerTwo: "header-two" as DraftBlockType,
    orderedListItem: "ordered-list-item" as DraftBlockType,
    paragraph: "paragraph" as DraftBlockType,
    unorderedListItem: "unordered-list-item" as DraftBlockType,
    unstyled: "unstyled" as DraftBlockType,
};
