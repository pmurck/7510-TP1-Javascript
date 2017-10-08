var Method = require("../src/method");

function Evaluable(db, method) {
    this.method = method
    this.db = db;
}

// methods: {:method_name1 {:param_count1 Method :param_count2 Method} :method_name2 {..} ..}
function DB() {
    this.methods = new Map();
}

DB.prototype.query = function(method) {
    return new Evaluable(this, method);
}

module.exports = {
    Evaluable: Evaluable,
    DB: DB
}