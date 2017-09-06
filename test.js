'use strict';

const profiling = require('./index');
const assert = require('assert');
const mongoose = require('mongoose');
const operations = require('./operations');

const { profilingPreHandler } = profiling;
mongoose.Promise = Promise;

describe('Profiling Pre Handler', function() {
    const scope = {
        options: {},
        comment(comment) {
            this.options.comment = comment;
        },
    };

    it('should set options.comment', function(done) {
        profilingPreHandler.call(scope, () => {
            assert.ok(scope.options.comment.endsWith('index.js:5'), 'unexpected comment value');
            done();
        });
    });
});

describe('Mongoose Operations', () => {
    mongoose.plugin(profiling);

    const Cat = mongoose.model('Cat', { name: String });
    const kitty = new Cat({ name: 'Zildjian' });

    const opArgs = {
        find: [{}],
        findOne: [{}],
        update: [{ _id: kitty._id }, { name: 'Afonso' }],
    };

    before(() => mongoose.connect('mongodb://localhost/mongoose-profiling-middleware-test', { useMongoClient: true }));
    before(() => mongoose.connection.db.command({ profile: 2 }));
    after(() => mongoose.disconnect());

    before(() => kitty.save());

    Object.keys(opArgs).forEach(op => {
        it(op + ' should execute', () => {
            const query = Cat[op](...opArgs[op]);
            query.comment(query.options.comment + ' [' + op + ']');
            return query;
        });
    });
});
