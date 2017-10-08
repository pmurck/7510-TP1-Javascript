var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var Method = require('../src/method');
var database = require('../src/database');
var Fact = require('../src/fact');
var Rule = require('../src/rule');


describe("Rule", function () {

    var name = "hijos";
    var params = ["X", "Y", "Z"];
    var eval_params_1 = ["X", "Y"];
    var eval_params_2 = ["X", "Z"];
    var f_name = "hijo";
    var f_params = ["pepe", "juan"];
    var f_another_params =  ["pepe", "marcelo"];
    var fact_1 = null;
    var fact_2 = null;
    var rule = null;
    var DB = null;
    var ok_args = ["pepe", "juan", "marcelo"];

    beforeEach(function () {
        // runs before each test in this block
        DB = new database.DB();
        let method_1 = new Method(f_name, f_params);
        let method_2 = new Method(f_name, f_another_params);
        fact_1 = new Fact(method_1);
        fact_2 = new Fact(method_2);
        DB.add(fact_1);
        DB.add(fact_2);
        let rule_method = new Method(name, params);
        let e_method_1 = new Method(f_name, eval_params_1);
        let e_method_2 = new Method(f_name, eval_params_2);
        rule = new Rule(rule_method, [DB.query(e_method_1), DB.query(e_method_2)]);
    });

    describe('Rule Unit Tests', function () {

        it('Rule name is correctly set', function () {
            assert(rule.name == name);
        });

        it('Rule parameters are correctly set', function () {
            assert(rule.params.join(",") == params.join(","));
        });

        it('Rule join with another method should throw', function () {
            assert.throws(() => rule.join(fact_1));
        });

        it('Call Rule using correct args return true', function () {
            assert(rule.callUsing(ok_args));
        });

        it('Call Rule using wrong args return false', function () {
            assert(!rule.callUsing(["za","ra","za"]));
        });
    });
});