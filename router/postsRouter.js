const router = require("express").Router();
const PostsDb = require("../data/db");

// Get posts

router.get("/", (req, res) => {
  PostsDb.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});

// Get a post

router.get("/:id", (req, res) => {
  const id = req.params.id;
  PostsDb.findById(id)
    .then(post => {
      if (post.length !== 0) res.status(200).json(post);
      else
        res.status(404).json({
          message: "The post with the specified ID does not exist"
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "The post information could not be retrieved."
      });
    });
});

// Get a comment with post id

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  PostsDb.findPostComments(id)
    .then(comments => {
      if (comments.length !== 0) res.status(200).json(comments);
      else
        res.status(404).json({
          message: "The comments with the specified ID does not exist"
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "The comments information could not be retrieved."
      });
    });
});

// Create post
router.post("/", (req, res) => {
  console.log(req.body.title, req.body.contents);
  if (req.body.title && req.body.contents) {
    PostsDb.insert(req.body)
      .then(() => res.status(201).json(req.body))
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post"
    });
  }
});

// Create a comment with post id
router.post("/:id/comments", (req, res) => {
  if (req.body.text) {
    const id = req.params.id;

    PostsDb.findById(id)
      .then(post => {
        if (post.length !== 0) {
          PostsDb.insertComment(req.body)
            .then(() => {
              if (req.body.post_id === parseInt(id))
                res.status(201).json(req.body);
              else
                res.status(400).json({
                  errorMessage: "post_id entered does not match."
                });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                err:
                  "There was an error while saving the comment to the database"
              });
            });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist"
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: "There was an error with the server"
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide text for the comment"
    });
  }
});

// Update a post
router.put('/:id', (req, res) => {

    if (req.body.title && req.body.contents){
        const id = req.params.id;
        PostsDb.findById(id)
        .then( post => {
            if (post.length !== 0) {
                PostsDb.update(id, req.body)
                .then( count => {
                    if (count === 1) {
                        res.status(200).json(req.body)
                    } else
                    res.status(500).json({
                        error: 'The post information could not be modified.'
                    })
                })
                .catch( err => {
                    console.log(err);
                    
                    res.status(500).json({
                        error: 'The post information could not be modified.'
                })
            })
            } else {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.'
                })
            }
        })
        .catch( err => {
             console.log(err);
                    
            res.status(500).json({
                error: 'The post information could not be modified.'
            })
        })
    } else {
        res.status(400).json({
            errorMesswage: 'Please provide title and contents for the post'
        })
    }
    
})

//Delete a post

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    console.log('deleted id', id);
    PostsDb.findById(id)
    .then( post => {
        if (post.length !== 0) {
            PostsDb.remove(id)
            .then( count => {
                if (count === 1) 
                res.status(200).json({
                message: 'The post is successfully deleted.'})
                else 
                res.status(500).json({
                    error: 'The post could not be removed'
                })
            })
            .catch(err => {
                console.log(err);
                       
               res.status(500).json({
                   error: 'The post could not be removed'
               })
        
            })
           
        } else {
            res.status(404).json({
                message: 'The post with the specified ID does not exist.'
            })
        }

    })
    .catch(err => {
        console.log(err);
               
       res.status(500).json({
           error: 'The post could not be removed'
       })

    })
})

module.exports = router;
