type ComposedEntityType = "LINK" | "TOKEN" | "PHOTO";
type DraftEntityType = string | ComposedEntityType;

export default {
    image: "IMAGE" as DraftEntityType,
    link: "LINK" as DraftEntityType,
    photo: "PHOTO" as DraftEntityType,
    token: "TOKEN" as DraftEntityType,
};
