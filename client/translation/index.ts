import * as i18next from "i18next";

import Culture from "./culture";
import enUSTranslation from "./dictionaries/en-Us";

const dictionaries = i18next.init({
    lng: Culture.EnUs,
    resources: {
        [Culture.EnUs]: { translation: enUSTranslation },
    },
});

export default class Translation {
    public static translate(...paths: Array<string>): string {
        return dictionaries.t((paths || []).join("."));
    }
}
