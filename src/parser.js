var Method = require("../src/method");
var Fact = require("../src/fact");
var Rule = require("../src/rule");

const rule_regex = /(.*):-(.*)/;
const method_regex = /(\s*\w+\s*)\((\s*[^,\s()]*\s*(?:,\s*[^,\s()]+\s*)*)\)\s*/;
const arg_delimiter = ",";
const call_delim_regex = /\)\s*,/;
const call_delim_replacement = ");";
const call_delimiter = ";";

String.prototype.splitTrimAndFilterBlank = function(splitRegExpOrString){
    return this.split(splitRegExpOrString).map((s) => s.trim()).filter((s) => s.length != 0);
}

String.prototype.applyRegExpOrThrow = function(regExp){
    let result = regExp.exec(this);
    if (!result) throw new Error("Line: " + this + " does not match Regular Expression: " + regExp);
    result.shift();
    return result;
}

function parse_method(str){
    let [name, params] = str.applyRegExpOrThrow(method_regex);
    return new Method(name.trim(), params.splitTrimAndFilterBlank(arg_delimiter));
}

function parse_fact(line){
    let method = parse_method(line);
    return new Fact(method);
}

function parse_rule(db, line){
    let [method_str, body_str] = line.applyRegExpOrThrow(rule_regex);
    let method = parse_method(method_str);
    let body_methods = body_str.replace(call_delim_regex, call_delim_replacement).splitTrimAndFilterBlank(call_delimiter).map(parse_method);
    let evaluables = body_methods.map(db.query, db);
    return new Rule(method, evaluables);
}

function parse_line(db, line){
    if (rule_regex.test(line))
        return parse_rule(db, line);
    return parse_fact(line);
}

module.exports = {
    parse_line: parse_line,
    parse_method: parse_method
}