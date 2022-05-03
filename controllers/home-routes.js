// will contain all of the user-facing routes

const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");

// router.get("/", (req, res) => {
//     // can accept an object as a second arguement
//     // this object mimics what we will ultimately get from Sequelize
//     res.render("homepage", {
//         // every property of the object becomes available in the template using Handlebars.
//         id: 1,
//         post_url: "https://handlebarsjs.com/guide/",
//         title: 'Handlebars Docs',
//         created_at: new Date(),
//         vote_count: 10,
//         comments: [{}, {}],
//         user: {
//             username: 'test_user'
//         }
//     });
// });

router.get('/', (req, res) => {
    Post.findAll({
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // pass a single post object into the homepage template
        // this will loop over and map each Sequelize object into a serialized version of itself
        // saving the results in a new posts array instead of an object
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', { posts });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  // the login page doesn't need any variables, so we don't need to pass a second argument to the render() method
  router.get("/login", (req, res) => {
      res.render("login");
  });

module.exports = router;