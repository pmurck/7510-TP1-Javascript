var database = require("../src/database");
var parse_line = require("../src/parser").parse_line;
var parse_method = require("../src/parser").parse_method;

var Interpreter = function () {
    var DB = new database.DB();

    this.parseDB = function (raw_lines) {
        raw_lines.map((s) => s.replace(".", "")).forEach((line) => DB.add(parse_line(DB, line)));
    }

    this.checkQuery = function (raw_method) {
        return DB.query(parse_method(raw_method)).evaluate();
    }
}

module.exports = Interpreter;
