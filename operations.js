// $comment can not be used with findOneAndRemove, findOneAndUpdate and count
// insertMany pre hook does not have query as "this" and is a special case
module.exports = [
    "find",
    "findOne",
    "update",
];
