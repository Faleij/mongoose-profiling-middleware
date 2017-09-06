var stackTrace = require('stack-trace');
var operations = require('./operations');

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
        this.comment(firstSte.getFileName() + ":" + firstSte.getLineNumber());
    }
    next();
}

module.exports = function(schema) {
    operations.forEach(function(m) {
        schema.pre(m, profilingPreHandler);
    });
};

module.exports.profilingPreHandler = profilingPreHandler;
