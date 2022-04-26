const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

// create our User model
class User extends Model { 
    // set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        // the .compareSync method can confirm or deny that the supplised password matches the hashed password stored on the object
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// define table columns and configuration
User.init(
    // passing in two objects as arguments.  First object will define the columns and data types for those columns.
    {
        // TABLE COLUMN DEFINITIONS HERE
        id: {
            // use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's "NOT NULL" option
            allowNull: false,
            // intruct that this is the Primary Key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        // hooks gets added inside the second object
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                // newUserData is then returned to the application
                return newUserData;
                // in the hash function, we pass in the userData object that has the password property, also the saltRound value of 10
                // the resulting hashed password if then passed to the Promise object as newUserData object
                // return bcrypt.hash(userData.password, 10).then(newUserData => {
                //     return newUserData
                // });
            },
            // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updateUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updateUserData;
            }
        },

        // the second object accepts configures certain options for the table

        // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: "user"
    }
);

module.exports = User;