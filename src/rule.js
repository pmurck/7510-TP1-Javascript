var Method = require("../src/method");

// evaluables: [Evaluable_1, Evaluable_2, ..]
function Rule(method, evaluables){
    Method.call(this, method.name, method.params);
    this.evaluables = evaluables;
}

Rule.prototype = Object.create(Method.prototype);
Rule.prototype.constructor = Rule;

module.exports = Rule;