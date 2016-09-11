import { expect } from "chai";

import * as React from "react";
import * as TestUtils from "react-addons-test-utils";

import RichEditor from "./../index.tsx";

describe("RichEditor", () => {
    it("renders without problems", () => {
        const root = TestUtils.renderIntoDocument(<RichEditor />);

        expect(root).to.be.ok;
    });
});
