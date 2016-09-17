import translate from "./../../translation";

export default function (...paths: Array<string>): string {
    return translate("author", ...paths);
}
