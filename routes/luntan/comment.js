var express = require('express');
var db = require('../../database/db');
var Router = express.Router();

const add_comment = Router.post('/post', (req, res) => {
    const params = req.body;
    const post_id = params.post_id;
    const author = params.author;
    const content = params.content;
    const time = params.time;

    sql = 'INSERT INTO comment (post_id, author, content, time) VALUES (?, ?, ?, ?)';
    db.query(sql, [post_id, author, content, time], (err) => {
        if(err) {
            console.log(err);
            return;
        }
        res.json({
            code: 200,
            msg: 'Comment added successfully'
        })
    });
});

const delete_comment = Router.post('/delete', (req, res) => {
    const params = req.body;
    const id = params.id;

    sql = 'DELETE FROM comment WHERE comment_id = ?';
    db.query(sql, [id], (err) => {
        if(err) {
            console.log(err);
            return;
        }
        res.json({
            code: 200,
            msg: 'Comment deleted successfully'
        })
    });
});

const get_comments_for_a_post = Router.get('/get', (req, res) => {
    // get post_id
    const id = req.query.id;
    sql = 'SELECT * FROM comment WHERE post_id = ?';
    db.query(sql, [id], (err, result) => {
        if(err) {
            console.log(err);
            return;
        }
        res.json({
            code: 200,
            msg: 'Comments fetched successfully',
            data: result
        })
    });

})

module.exports = {
    get_comments_for_a_post,
    add_comment,
    delete_comment
}