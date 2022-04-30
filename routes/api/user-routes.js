// creating routes to perform CRUD operations

const router = require("express").Router();
const { User, Post, Vote } = require("../../models");

// GET /api/users
router.get("/", (req, res) => {
    // Access our User model and run .findAll()
    User.findAll({
        // passing an object into the method
        attributes: { exclude: ["password"] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
router.get("/:id", (req, res) => {
    User.findOne({
        attributes: { exclude: ["password"] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ["id", "title", "post_url", "created_at"]
            },
            {
                model: Comment,
                attributes: ["id", "comment_text", "created_at"],
                include: {
                    model: Post,
                    attributes: ["title"]
                }
            },
            {
                // when you query a single user, we receive the title info of every post they've ever voted on
                // had to include Post model, but you need to go through the Vote table
                model: Post,
                attributes: ["title"],
                through: Vote,
                as: "voted_posts"
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this id" });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users
router.post("/", (req, res) => {
    // expects {username: "Lernantino", email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post("/login", (req, res) => {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
        // result of the query is passed as dbUserData to the .then part of the findOne() method
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: "No user with that email address!" });
            return;
        }

        // if the query result is successful (not empty) we can call .checkPassword() which will be on the dbUserData object
        // passing the plaintext password (req.body.password) into .checkPassword() as the arguement
        const validPassword = dbUserData.checkPassword(req.body.password);

        // .checkPassword() will return true or false and that boolean value will be stored to the variable validPassword
        if (!validPassword) {
            res.status(400).json({ message: "Incorrect password!" });
            return;
        }

        res.json({ user: dbUserData, message: "you are now logged in!" });
        // verify user
    });
});

// PUT /api/users/1
router.put("/:id", (req, res) => {
    // if req.body has exact key/value pairs to match the model, you can just use "req.body" instead
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: "No user found with this id" });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
router.delete("/:id", (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this id" });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;