// name: "method_name";  params: ["a","b", ..]
function Method(name, params) {
    this.name = name;
    this.params = params;
}

Method.prototype.join = function(anotherMethod) {
    return anotherMethod;
}

Method.prototype.callUsing = function(args) {
    throw new Error("Abstract or non-existent Method");
}

module.exports = Method;