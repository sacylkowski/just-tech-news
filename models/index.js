// this file is used for collecting and exporting the User model data

const User = require("./User");
const Post = require("./Post");
const Vote = require("./Vote");

// create one to many associations
User.hasMany(Post, {
    foreignKey: "user_id"
});

Post.belongsTo(User, {
    foreignKey: "user_id"
});

// create many to many associations
User.belongsToMany(Post, {
    through: Vote,
    as: "voted_posts",
    foreignKey: "user_id"
});

// with these methods, we allow User and Post models to query each other's information in the context of a vote
// there is no direct relationship between user and vote & post and vote through these
Post.belongsToMany(User, {
    through: Vote,
    as: "voted_posts",
    foreignKey: "post_id"
});

// adding a relationship to Vote
Vote.belongsTo(User, {
    foreignKey: "user_id"
});

Vote.belongsTo(Post, {
    foreignKey: "post_id"
});

User.hasMany(Vote, {
    foreignKey: "user_id"
});

Post.hasMany(Vote, {
    foreignKey: "post_id"
});


module.exports = { User, Post, Vote };