const express = require (`express`);

const Comments = require(`../comments/comments-router`);

const router = express.Router();

router.get(`/:id`, async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        const comments = await Comments.findMessageById(id);
        console.log(comments);
        if (comments) {
            res.status(200).json(comments);
        } else {
            res.status(404).json({sucess: false, message: 'invalid message id'});
        }
    } catch (err) {
    res.status(500).json({ success: false, message: err});
    }
});

module.exports = router;