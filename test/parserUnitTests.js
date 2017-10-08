var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var Fact = require("../src/fact");
var Rule = require("../src/rule");
var DB = require("../src/database").DB;
var parse_method = require("../src/parser").parse_method;
var parse_line = require("../src/parser").parse_line;


describe("Parser", function () {

    function test_method_parse(method_str, expected) {
        it(method_str + " should give " + "[" + expected[0] + ", [" + expected[1].join(",") + "]]", function () {
            let method = parse_method(method_str);
            let [e_name, e_params] = expected;
            assert(method.name + method.params.join("") == e_name + e_params.join(""));
        });
    }

    function test_bad_parse(method_str, expected) {
        it(method_str + " should throw", function () {
            assert.throws(() => parse_method(method_str));
        });
    }


    describe("Syntactically correct method parse", function () {

        test_method_parse("temp(one, two)", ["temp", ["one", "two"]]);
        test_method_parse("t(o,t)", ["t", ["o", "t"]]);
        test_method_parse("   t    (      o   , t   )     ", ["t", ["o", "t"]]);
        test_method_parse("_hola_(x)", ["_hola_", ["x"]]);
        test_method_parse("empty_args()", ["empty_args", []]);

    });

    describe("Syntactically incorrect method parse", function () {

        test_bad_parse("(x,y)");
        test_bad_parse("(x,)");
        test_bad_parse("(,)");
        test_bad_parse("()");
        test_bad_parse("(x)");
        test_bad_parse("");
        test_bad_parse("hola");
        test_bad_parse("x(");
        test_bad_parse("y)");
        test_bad_parse("(x");
        test_bad_parse("hola(x,");

    });

    describe('Successful parse line to type', function () {
        var db = new DB();
        
        it('Get Fact from fact def: hola(pepe,juan)', function () {
            var item = parse_line(db, "hola(pepe,juan)");
            assert(item instanceof Fact);
        });
        it('Get Rule from rule def: self_saludo(x) :- hola(x,x)', function () {
            var item = parse_line(db, "self_saludo(x) :- hola(x,x)");
            assert(item instanceof Rule);
        });
    });

    describe('Unsuccessful parse line to type', function () {
        var db = new DB();

        it("Incorrect fact def: hola(pepe,) should throw", function () {
            assert.throws(() => parse_line("self:-()"));
        });
        it("Incorrect rule def: self:-() should throw", function () {
            assert.throws(() => parse_line("hola(pepe,)"));
        });

    });

});


