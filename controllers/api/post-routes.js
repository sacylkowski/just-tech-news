const router = require("express").Router();
const sequelize = require("../../config/connection");

const { Post, User, Vote, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// get all posts

router.get("/", (req, res) => {
  console.log("================");
  Post.findAll({
    order: [["created_at", "DESC"]],
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    // query configuration

    include: [
      {
        // the comment model includes the user model itself so it can attach the username to the comment
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"]
        }
      },
      {
        // expressed as an array of objects
        model: User,
        attributes: ["username"]
      }
    ]
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get a single post
router.get('/:id', (req, res) => {
  Post.findOne({
    // used the where property to set the value of the id using req.params.id
    where: {
      id: req.params.id
    },
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
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"]
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create a post
router.post('/', withAuth, (req, res) => {
  // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
  // using req.body to populate the columns in the post table
  // we did not assign the created_at or updated_at fields in req.body.  this is because sequelize automatically assigned
  // with the CURRENT_TIMESTAMP values
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    // update to include the user_id.  Webpage will have error when their is no session
    user_id: req.session.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT / api/posts/upvote
router.put("/upvote", withAuth, (req, res) => {
  // make sure the session exists first
  if (req.session) {
    // custom static method created in models/Post.js
    // pass session id along with all destructured properties on req.body
    Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
      .then(updatedPostData => res.json(updatedPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});
// // create the vote
// Vote.create({
//   user_id: req.body.user_id,
//   post_id: req.body.post_id
// })
//   .then(() => {
//     // then find the post we just voted on
//     return Post.findOne({
//       where: {
//         id: req.body.post_id
//       },
//       attributes: [
//         "id",
//         "post_url",
//         "title",
//         "created_at",
//         // use raw MySql aggregate function query to get a count of how many votes the post has and return it under the name "vote_count"
//         [
//           sequelize.literal("(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"),
//           "vote_count"
//         ]
//       ]
//     })
//   })
//   .then(dbPostData => res.json(dbPostData))
//   .catch(err => {
//     console.log(err);
//     res.status(400).json(err);
// });

// // update a post's title
router.put('/:id', withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete a post
router.delete('/:id', withAuth, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
module.exports = router;