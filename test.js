'use strict';

const  { profilingPreHandler } = require('./index');
const assert = require('assert');

describe('Profiling Pre Handler', function() {
    const scope = { options: {} };
    it('should set options.comment', function(done) {
        profilingPreHandler.call(scope, () => {
            assert.ok(scope.options.comment.endsWith('index.js:4'), 'unexpected comment value');
            done();
        });
    });
});
