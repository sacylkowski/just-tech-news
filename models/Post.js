const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// create our Post model
class Post extends Model {
    // using JS's static keyword to indicate that the upvote method is one that's base on the Post model
    // and not an instance method.  We can now execute Post.upvote() as if it were one of Sequelize's other
    // built-in methods.  We pass in the value of req.body, and an object of the models.
    static upvote(body, models) {
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    "id",
                    "post_url",
                    "title",
                    "created_at",
                    [
                        sequelize.literal("(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"),

                    ]
                ]
            });
        });
    }
}

// create fields/columns for Post model
Post.init(
    {
        // define the Post schema
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // sequelize has the ablitiy to offer validation in the schema definition
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        // this column determines who posted the news article
        // id column is defined by the key property which is the primary key
        // user_id is conversely defined as the foreign key
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "user",
                key: "id"
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: "post"
    }
);

module.exports = Post;