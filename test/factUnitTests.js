var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var Method = require('../src/method');
var Fact = require('../src/fact');


describe("Fact", function () {

    var name = "hijo";
    var params = ["pepe", "juan"];
    var another_params =  ["pepe", "marcelo"];
    var fact = null;
    var joined_fact = null;

    beforeEach(function () {
        // runs before each test in this block
        let method = new Method(name, params);
        fact = new Fact(method);
        joined_fact = fact.join(new Fact(new Method(name, another_params)));
    });

    describe('Fact Unit Tests', function () {

        it('Fact name is correctly set', function () {
            assert(fact.name == name);
        });

        it('Fact parameters are correctly set', function () {
            assert(fact.params.join(",") == params.join(","));
        });

        it('Fact join with another method returns the same fact transformed', function () {
            let anotherFact = new Fact(new Method(name, another_params));
            assert(fact.join(anotherFact) === fact);
        });

        it('Call Fact using correct args return true', function () {
            assert(fact.callUsing(params) );
        });

        it('Call Fact using wrong args return false', function () {
            assert(!fact.callUsing(["za","ra","za"]));
        });
    });

    describe('Joined Fact Unit Tests', function () {

        it('Joined Fact name is correctly set', function () {
            assert(joined_fact.name == name);
        });

        it('Joined Fact join with another method returns the same fact transformed', function () {
            let anotherFact = new Fact(new Method(name, ["pepe", "gonzalo"]));
            assert(joined_fact.join(anotherFact) === joined_fact);
        });

        it('Call Joined Fact using 1st correct args return true', function () {
            assert(joined_fact.callUsing(params) );
        });

        it('Call Joined Fact using 2nd correct args return true', function () {
            assert(joined_fact.callUsing(another_params) );
        });

        it('Call Joined Fact using wrong args return false', function () {
            assert(!joined_fact.callUsing(["za","ra","za"]));
        });
    });
});