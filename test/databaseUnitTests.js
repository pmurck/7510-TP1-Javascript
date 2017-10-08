var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var Method = require('../src/method');
var database = require('../src/database');
var Fact = require('../src/fact');
var Rule = require('../src/rule');


describe("Database", function () {
    
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
        DB.add(rule);
    });

    describe('DB Unit Tests', function () {

        it('DB add and get existent fact returns the Fact', function () {
            assert(DB.get(f_name, f_params.length) === fact_1);
        });

        it('DB add and get existent joined fact returns the Fact', function () {
            assert(DB.get(f_name, f_another_params.length) === fact_1);
        });

        it('DB add and get existent rule returns the Rule', function () {
            assert(DB.get(name, params.length) === rule);
        });

        it('DB get non_existent_method gives a Null Method', function () {
            let m = DB.get(new Method("zaraza", ["za","ra","za"]));
            assert(m instanceof Method && !(m instanceof Rule) && !(m instanceof Fact));
        });

        it('DB query return Evaluable for method evaluation', function () {
            assert(DB.query(new Method(name, params)) instanceof database.Evaluable);
        });
    });

    describe('Evaluable Unit Tests', function () {
        
        it('Evaluable from DB has no argument transform', function () {
            assert(DB.query(new Method(name, params)).transformArgs(["hola"]).join(",") == ["hola"].join(","));
        });

        it('Set Evaluable argument transformer and check', function () {
            let e = DB.query(new Method(name, params));
            e.setArgsTransformer((args) => args.reverse());
            assert(e.transformArgs(["hola","chau"]).join(",") == ["chau", "hola"].join(","));
        });
        
        it('Evaluable from DB and existent Fact evaluates to true', function () {
            assert(DB.query(new Method(f_name, f_params)).evaluate());
        });

        it('Evaluable from DB and existent Rule evaluates to true', function () {
            assert(DB.query(new Method(name, ok_args)).evaluate());
        });

        it('Evaluable from DB and non_existent Method should throw', function () {
            assert.throws(() => DB.query(new Method("zaraza", ["za","ra","za"])).evaluate());
        });

        it('Evaluable from DB and later added Fact evaluates to true', function () {
            let n = "test";
            let p = ["hola"];
            let e = DB.query(new Method(n, p));
            DB.add(new Fact(new Method(n, p)));
            assert(e.evaluate());
        });            
    });
});