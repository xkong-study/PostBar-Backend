var express = require('express');
var db = require('../../database/db');
var Router = express.Router();
var multer = require('multer');
var fs = require('fs');
var mime = require('mime');


const add_comment = Router.get('/post', (req, res) => {
    console.log(req.query)
    const post_id = req.query.post_id;
    const author = req.query.author;
    const content = req.query.content;
    const time = req.query.time;

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
    const id = req.query.post_id;
    console.log(req.query.post_id)
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

});


module.exports = {
    get_comments_for_a_post,
    add_comment,
    delete_comment
}
