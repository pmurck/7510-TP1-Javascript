var Method = require("../src/method");

function Fact(method) {
    Method.call(this, method.name, method.params);
}

Fact.prototype = Object.create(Method.prototype);
Fact.prototype.constructor = Fact;
    
Fact.prototype.join = function(anotherMethod){
    this.param_set = new Map();
    
    // Set joined Fact new function behaviour
    this.join = function(otherMethod) {
        this.param_set.set(otherMethod.params.join(","), true);
        return this;
    };

    this.callUsing = function(args){
        return this.param_set.has(args.join(","));
    };

    this.join(this);
    return this.join(anotherMethod);
};

Fact.prototype.callUsing = function(args){
    return this.params.join(",") == args.join(",");
};

module.exports = Fact;