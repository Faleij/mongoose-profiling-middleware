# mongoose-profiling-middleware
Middleware to mark code position on every mongoose call.

## Usage
Simply put the following line in your code, after initializing the mongoose schema.
~~~~
require('mongoose-profiling-middleware');
~~~~

## What it does
The middleware will register a "pre" hook on every mongoose call, which sets the call's `$comment` to the current source file and line.
When profiling, this allows seeing which calls took the most time to complete.

## How to profile
1. Require *mongoose-profiling-middleware* in your code (`require('mongoose-profiling-middleware');`).
1. Enable profiling on mongodb, by executing `db.setProfilingLevel(1)` or `db.setProfilingLevel(2)` in mongo shell ([documentation](https://docs.mongodb.com/manual/reference/method/db.setProfilingLevel/)).
1. Run your application for some time. Make sure the usage pattern when profiling resembles real-life scenarios. (You can profile on your production system, but note that it may marginally slow it down).
1. A collection named `System/system.profile` is created. Example query to list the most time-hogging calls:
~~~~
db.getCollection('system.profile').aggregate([{$group: {_id: "$query.comment", calls: {$sum: 1}, millis: {$sum: "$millis"}}},{$sort: {millis: -1, calls: -1}}])
~~~~
