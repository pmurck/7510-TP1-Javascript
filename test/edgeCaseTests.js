var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var Interpreter = require('../src/interpreter');


describe("Edge Case Tests", function () {

    var db = [
        "varon(juan).",
        "varon(pepe).",
        "varon(hector).",
        "varon(roberto).",
        "varon(alejandro).",
        "mujer(maria).",
        "mujer(cecilia).",
        "padre(juan, pepe).",
        "padre(juan, pepa).",
        "padre(hector, maria).",
        "padre(roberto, alejandro).",
        "padre(roberto, cecilia).",
        "hijo(X, Y) :- varon(X), padre(Y, X).",
        "hija(X, Y) :- mujer(X), padre(Y, X).",
        "hijo_de_juan(x) :- varon(x), padre(juan, x).",
        "hija_de_hector(alguien) :- hija(alguien, hector).",
        "error(A, B, C) :- error(C, B, A).",
        "wrapper(X, x) :- hijo(X, x).",
        "varon(juan, pepe).",
        "varon(X, Y, Z) :- varon(X, Y), varon(Z).",
        "unused(X, UnUsed) :- varon(X).",
        "empty_rule() :- varon(juan)."
    ];

    var interpreter = null;

    beforeEach(function () {
        // runs before each test in this block
        interpreter = new Interpreter();
        interpreter.parseDB(db);
    });

    describe('Rule with fixed Arg set', function () {

        it('hijo_de_juan(pepe) should be true', function () {
            assert(interpreter.checkQuery('hijo_de_juan(pepe)'));
        });
        
    });
    describe('Rule can call another Rule', function () {

        it('hijo_de_hector(maria) should be true', function () {
            assert(interpreter.checkQuery('hija_de_hector(maria)'));
        });
        
    });
    describe('Rule params are case sensitive', function () {

        it('Rules are case sensitive', function () {
            assert(interpreter.checkQuery('wrapper(pepe, juan)'));
        });
        
    }); 
    describe('Same name Rule and Fact accepted if they difer in param length', function () {

        it('Rules and facts with same name are OK if they have a different parameter count', function () {
            assert(interpreter.checkQuery('varon(juan, pepe, juan)'));
        });
        
    }); 
    describe('Unused parameters in Rule are accepted', function () {

        it('Rules can have unused parameters', function () {
            assert(interpreter.checkQuery('unused(juan, zaraza)'));
        });
        
    });     
    describe('Rules can have no parameters', function () {

        it('Rules with zero parameters are accpeted', function () {
            assert(interpreter.checkQuery('empty_rule()'));
        });
        
    });   
    describe('Fact can have no arguments', function () {

        it('Facts with zero arguments are accepted', function () {
            assert(interpreter.checkQuery('empty_rule()'));
        });
        
    });
    describe('Rule and Fact with same name and param count are forbidden', function () {

        it('DB add Rule and Fact with same name and parameter count should throw', function () {
            interpreter = new Interpreter();
            assert.throws(() => interpreter.parseDB(["mujer(x) :- pepa(x).", "mujer(maria)."]));
        });
        
    });
    describe('Rule cannot evaluate a non existent method in its body', function () {

        it('Rule with non-existent body-methods should throw when evaluated', function () {
            interpreter = new Interpreter();
            interpreter.parseDB(['bad_rule(x) :- no_fact(x).']);
            assert.throws(() => interpreter.checkQuery('bad_rule(zaraza)'));
        });
        
    });
    describe('Rule cannot evaluate itself', function () {

        it('Rule with with self as body-method should throw', function () {
            assert.throws(() => interpreter.checkQuery('error(test,this,error)'));
        });
        
    });

});


