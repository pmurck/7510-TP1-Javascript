var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var Method = require('../src/method');


describe("Method", function () {

    var name = "hijo";
    var params = ["pepe", "juan"];
    var method = null;

    beforeEach(function () {
        // runs before each test in this block
        method = new Method(name, params);
    });

    describe('Method Unit Tests', function () {

        it('Method name is correctly set', function () {
            assert(method.name == name);
        });

        it('Method parameters are correctly set', function () {
            assert(method.params.join(",") == params.join(","));
        });

        it('Method join with another method returns the passed method', function () {
            let anotherMethod = new Method("varon", ["pepe"]);
            assert(method.join(anotherMethod) === anotherMethod);
        });

        it('Calling a method should throw', function () {
            assert(() => method.callUsing(["za","ra","za"]));
        });
    });
});


