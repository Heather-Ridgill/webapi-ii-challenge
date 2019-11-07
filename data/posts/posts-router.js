const express = require(`express`);

const router = express.Router();

const db = require(`../db`);


router.post(`/:owner/:repo/git/refs`, (req,res) => {
res.status(200).send('You did it!')
});

router.get(`/`, (req,res) => {
    console.log(req.query);
    db.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: `Error retrieving the post`});
        });
});

router.get(`/:id`, (req,res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post.length > 0) {
                res.status(200).json(post);
            } else{
                res.status(404).json({ message: `Whoops! This post with the specified ID does not exist`});
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: `The post info could not be retrieved`});
        });
});



router.get("/:id/comments", (req, res) => {
    db.findById(req.params.id)
      .then(post => {
        if (post.length > 0) {
          db.findPostComments(req.params.id).then(comments => {
            console.log(req.body);
            res.status(200).json(comments);
          });
        } else {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
        }
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          error: "The comments information could not be retrieved."
        });
      });
  });



router.post("/", (req, res)=> {
    const postData = req.body;

    if("tite" in postData && "contents" in postData) {
        db.insert(postData)
        .then(post => {
            res.status(201).json(postData);
        })
        .catch (error => {
            console.log(error);
            res.status(500).json({
                error: "There was an error while saving the post to the database"
            });
        });
    }else {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        });
    }
});


router.post ("/:id/comments", (req,res) => {
    db.findById(req.params.id)
    .then(post => {
        if(post.length > 0) {
            console.log (req.body);
            if("text" in req.body) {
                req.body.post_id = req.params.id;
                db.insertComment(req.body).then(comment => {
                    res.status(201).json(req.body);
                });
            } else {
                res.status(400).json({ errorMessage: "Please provide text for the comment"});
            }
        } else {
            res.status(404).json({ errorMessage: "The post with the specified ID does not exist"});
        }
    })
    .catch(error => {
        console.log(error);
        res.setMaxListeners(500).json({
            error: "There was an error while saving the comment to the database"
        });
    });
});




router.delete(`/:id`, (req,res) => {
    db.findById(req.params.id)
        .then(post => {
            if(post.length > 0) {
                console.log(req.body);
                db.remove(req.params.id).then(post => {
                    if(post) {
                        res.status(200).json({ message: "The post has been deleted!"});
                    }
                });
            } else {
                res.status(404).json({message: `The post with the specified ID does not exist`});
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({message: `This post could not be removed`});
        });
});

router.put(`/:id`, (req, res)=> {
    const changes = req.body;
    db.findById(req.params.id)
    .then(post => {
        if(post.length > 0) {
            if("title" in changes && "contents" in changes) {
                db.update(req.params.id, changes).then(post => {
                    res.status(200).json(changes);
                });
            } else {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post"});
            }
        } else {
            res.status (404)/json({ message: "The post with the specified ID does not exist"});
        }
    })

     .catch(error => {
         console.log(error);
         res.status(500).json ({
             message: `The post information could not be modified`
         });
     });
});

// router.get('/:id/comments', (req, res) => {
// try {
//     const messages = await Hubs.findPostMessages(req.param.id);
//     if (messages.length > 0) {
//         res.status(200).json (messages);
//     } else {
//         res.status (404).json({ message: `No comments for this post`});

//     }
// } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: ` Error retrieving the comments for this post`});

// }
// });


// router.post (`/:id/messages`, async (req,res) => {
//     const messageInfo = { ...req.body, posts_id: req.params.id};
    
//     try {
//         const message = await Hubs.addMessage(messageInfo);
//         res.status(201).json(message);
//     } catch(err) {
//         console.log(err);
//         res.status(500).json({err});
//     }
// })

module.exports = router;
