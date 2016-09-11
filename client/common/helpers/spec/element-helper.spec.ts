import { expect } from "chai";

import ElementHelper from "./../element-helper";

describe("ElementHelper", () => {
    describe("getElementRect", () => {
        it("Checks element rect", () => {
            const testElement = document.createElement("div");
            testElement.style.position = "absolute";
            testElement.style.left = "100px";
            testElement.style.top = "150px";
            testElement.style.width = "70px";
            testElement.style.height = "90px";

            testElement.appendChild(document.createTextNode("XXX"));

            document.body.appendChild(testElement);

            const boundingBox = ElementHelper.getElementRect(testElement);
            const expectedBoundingBox: ClientRect = {
                bottom: 240,
                height: 90,
                left: 100,
                right: 170,
                top: 150,
                width: 70,
            };

            document.body.removeChild(testElement);

            expect(boundingBox).to.eql(expectedBoundingBox);
        });

        it("Checks nested element rect", () => {
            const containerElement = document.createElement("div");
            containerElement.style.position = "absolute";
            containerElement.style.left = "3px";
            containerElement.style.top = "3px";
            containerElement.style.width = "700px";
            containerElement.style.height = "900px";

            const testElement = document.createElement("div");
            testElement.style.position = "absolute";
            testElement.style.left = "100px";
            testElement.style.top = "150px";
            testElement.style.width = "70px";
            testElement.style.height = "90px";

            testElement.appendChild(document.createTextNode("XXX"));

            containerElement.appendChild(testElement);

            document.body.appendChild(containerElement);

            const boundingBox = ElementHelper.getElementRect(testElement);
            const expectedBoundingBox: ClientRect = {
                bottom: 243,
                height: 90,
                left: 103,
                right: 173,
                top: 153,
                width: 70,
            };

            document.body.removeChild(containerElement);

            expect(boundingBox).to.eql(expectedBoundingBox);
        });

        it("Fail in case of null parameter", () => {
            expect(ElementHelper.getElementRect).to.throw(Error);
        });
    });

    describe("isWithinContainer", () => {
        it("Checks elements inside container", () => {
            const containerElement = document.createElement("div");
            const testElement1 = document.createElement("div");
            const testElement2 = document.createElement("div");


            containerElement.appendChild(testElement1);
            containerElement.appendChild(testElement2);

            document.body.appendChild(containerElement);

            const isWithinContainer = ElementHelper.isWithinContainer(containerElement, testElement1, testElement2);

            document.body.removeChild(containerElement);

            expect(isWithinContainer).to.be.true;
        });

        it("Checks one outside container", () => {
            const containerElement = document.createElement("div");
            const testElement1 = document.createElement("div");
            const testElement2 = document.createElement("div");


            containerElement.appendChild(testElement1);

            document.body.appendChild(containerElement);
            document.body.appendChild(testElement2);

            const isWithinContainer = ElementHelper.isWithinContainer(containerElement, testElement1, testElement2);

            document.body.removeChild(containerElement);
            document.body.removeChild(testElement2);

            expect(isWithinContainer).to.be.false;
        });

        it("Fail in case of null parameter", () => {
            expect(ElementHelper.isWithinContainer).to.throw(Error);
        });
    });

});
