var stackTrace = require('stack-trace');

function profilingPreHandler(next) {
    var st = stackTrace.get();
    var firstSte = st.find(function(ste) {
        if (!ste) return false;
        var filename = ste.getFileName();
        if (/\/node_modules\//.test(filename)) return false;
        if (/^internal\//.test(filename)) return false;
        return true;
    });
    if (firstSte) {
        this.options.comment = firstSte.getFileName() + ":" + firstSte.getLineNumber();
    }
    next();
}

// $comment can not be used with findOneAndRemove
var operations = [
    "count",
    "find",
    "findOne",
    "findOneAndUpdate",
    "insertMany",
    "update"
];

module.exports = function(schema) {
    operations.forEach(function(m) {
        schema.pre(m, profilingPreHandler);
    })
};

module.exports.profilingPreHandler = profilingPreHandler;
