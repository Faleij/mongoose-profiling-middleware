var stackTrace = require('stack-trace');

module.exports = function(schema) {
    ["count", "find", "findOne", "findOneAndRemove", "findOneAndUpdate", "insertMany", "update"].forEach(function(m) {
        schema.pre(m, function(next) {
            var st = stackTrace.get();
            var firstSte = null;
            st.forEach(function(ste) {
                if (firstSte) return;
                if (!ste) return;
                var filename = ste.getFileName();
                if (/\/node_modules\//.test(filename)) return;
                if (/^internal\//.test(filename)) return;
                firstSte = ste;
            });
            if (firstSte) {
                this.options.comment = firstSte.getFileName() + ":" + firstSte.getLineNumber();
            }
            next();
        });
    })
}