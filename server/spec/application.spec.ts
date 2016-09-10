import { expect } from "chai";

import application from "./../application";

describe("Server", () => {
    it("Runs application", () => {
        expect(application).to.be.ok;
    });
});
