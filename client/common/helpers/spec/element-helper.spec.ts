import { expect } from "chai";
import { random } from "lodash";

import ElementHelper from "./../element-helper";

describe("ElementHelper", () => {
    describe("fromWindowToDocument", () => {
        it("Checks client element size", () => {
            const testElement = document.createElement("div");
            testElement.style.position = "absolute";
            testElement.style.left = `${random(0, window.innerWidth - 2)}px`;
            testElement.style.top = `${random(0, window.innerHeight - 2)}px`;
            testElement.style.width = "1px";
            testElement.style.height = "1px";

            testElement.appendChild(document.createTextNode("XXX"));

            document.body.appendChild(testElement);

            const bodyElement = <HTMLBodyElement> document.querySelector("body");
            bodyElement.style.height = `${window.innerHeight + 500}px`;
            bodyElement.style.width = `${window.innerWidth + 500}px`;

            const initialMeasure = testElement.getBoundingClientRect();
            const initialMeasureDocument = ElementHelper.fromWindowToDocument(initialMeasure);

            window.scrollTo(random(1, window.innerWidth), random(1, window.innerHeight));

            const scrollMeasure = testElement.getBoundingClientRect();
            const scrollMeasureDocument = ElementHelper.fromWindowToDocument(scrollMeasure);

            expect(initialMeasure).to.not.eql(scrollMeasure);
            expect(initialMeasureDocument).to.eql(scrollMeasureDocument);
        });

        it("Fail in case of null parameter", () => {
            expect(ElementHelper.fromWindowToDocument).to.throw(Error);
        });
    });

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

    describe("focusElement", () => {
        it("Check input is focused", () => {
            const inputElement = document.createElement("input");
            inputElement.setAttribute("type", "text");

            document.body.appendChild(inputElement);

            ElementHelper.focusElement(inputElement);

            expect(inputElement).to.be.eql(document.activeElement);

            document.body.removeChild(inputElement);
        });

        it("Don't fail in case of null parameter", () => {
            expect(ElementHelper.focusElement).not.to.throw(Error);
        });
    });
});
