var Method = require("../src/method");

function Fact(method) {
    Method.call(this, method.name, method.params);
}

Fact.prototype = Object.create(Method.prototype);
Fact.prototype.constructor = Fact;

module.exports = Fact;