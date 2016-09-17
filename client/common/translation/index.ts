import translate from "./../../translation";

export default function (...paths: Array<string>): string {
    return translate("common", ...paths);
}
