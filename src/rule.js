var Method = require("../src/method");

Map.prototype.getOrElse = function(key, default_value){
    let value = this.get(key);
    if (!value) return default_value;
    return value
}

function zipmap(array_1, array_2) {
    let result = new Map();
    for (var i = 0; i < array_1.length; i++) {
        result.set(array_1[i], array_2[i]);
    }
    return result;
}

// evaluables: [Evaluable_1, Evaluable_2, ..]
function Rule(method, evaluables){
    Method.call(this, method.name, method.params);
    this.evaluables = evaluables;   
}

Rule.prototype = Object.create(Method.prototype);
Rule.prototype.constructor = Rule;

Rule.prototype.join = function(anotherMethod){
    throw new Error("Rule is not joinable");
}

Rule.prototype.callUsing = function(args){
    if (this.evaluables.some((e) => e.method.name == this.name && e.method.params.length == this.params.length)) {
        throw new Error("Rule: " + this.name + " cannot call itself");
    }
    let param_to_arg = zipmap(this.params, args);
    this.evaluables.forEach((e) => e.setArgsTransformer((params) => params.map((item) => param_to_arg.getOrElse(item, item))));
    return this.evaluables.every((e) => e.evaluate());
};

module.exports = Rule;