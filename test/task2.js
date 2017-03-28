"use strict";
var assert = require('assert');
import Atomate from "../dev/task2/atomate.js";

function AtomateError(str){
    it(str, () => {
        assert.equal(null, (new Atomate(str).Do()).match(/(0|1)+/)); // если в выходной строке нет 0 и 1, то это - строка с ошибкой!
    });
}

function AtomateCorrect(sfrom, sto){
    it(sfrom, () => {
        assert.equal(sto, (new Atomate(sfrom).Do()));
    });
}

describe("Task 2", function(){

    describe("Correct", () => {

        AtomateCorrect('110000', '100100');
        AtomateCorrect('1100000000', '1000010000');
        AtomateCorrect('1111000000', '1100011000');

    });

    describe("Incorrect", () => {

        AtomateError("11000");
        AtomateError("1100");
        AtomateError("0");
        AtomateError("1");
        AtomateError("111100");
        AtomateError("0000");
        AtomateError("1111");
        AtomateError("111100");

    });

});