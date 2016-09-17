import * as i18next from "i18next";

import Culture from "./culture";
import enUSTranslation from "./dictionaries/en-us";

const dictionaries = i18next.init({
    lng: Culture.EnUs,
    resources: {
        [Culture.EnUs]: { translation: enUSTranslation },
    },
});

export default function translate(...paths: Array<string>): string {
    return dictionaries.t((paths || []).join("."));
}
