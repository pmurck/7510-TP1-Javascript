var Method = require("../src/method");

function Evaluable(db, method) {
    this.method = method
    this.db = db;
}

Evaluable.prototype.transformArgs = function(args) {
    return args;
}

Evaluable.prototype.setArgsTransformer = function(fn) {
    this.transformArgs = fn;
}

Evaluable.prototype.evaluate = function() {
    let method_in_db = this.db.get(this.method.name, this.method.params.length);
    return method_in_db.callUsing(this.transformArgs(this.method.params));
}

// methods: {:method_name1 {:param_count1 Method :param_count2 Method} :method_name2 {..} ..}
function DB() {
    this.methods = new Map();
}

// get deberia ser de uso interno
DB.prototype.get = function(name, param_count) {
    
    let same_name_methods = this.methods.get(name);
    if (!same_name_methods) {
        same_name_methods = new Map();
        this.methods.set(name, same_name_methods);
    }

    let method = same_name_methods.get(param_count);
    if (!method) {
        method = new Method(name, param_count);
        same_name_methods.set(param_count, method);
    }
    
    return method;   
}

DB.prototype.add = function(method) {
    let previous_method = this.get(method.name, method.params.length);
    this.methods.get(method.name).set(method.params.length, previous_method.join(method));
}

DB.prototype.query = function(method) {
    return new Evaluable(this, method);
}

module.exports = {
    Evaluable: Evaluable,
    DB: DB
}