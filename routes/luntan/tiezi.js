var express = require('express');
var db = require('../../database/db');
const multer = require("multer");
const fs = require("fs");
const mime = require("mime");
var Router = express.Router();

const uploadPhoto = (req, res, next) => {
    const dest_path = '../public/images/';
    let upload = multer({dest: dest_path}).single('photo');
    upload(req, res, (err) => {
        if(err) {
            console.log(err);
            return res.json({
                code: 500,
                msg: 'Image upload through https failed'
            })
        }else{
            next();
        }
    });
};

const add_post = Router.post('/post', uploadPhoto, (req, res) => {
    const params = req.body;
    const title = params.title;
    const content = params.content;
    const author = params.author;
    const time = params.time;
    const file = req.file;
    const sql = 'INSERT INTO tiezi (title, content, author, time, filepath) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [title, content, author, time, file.path], (err, result) => {
        if(err) {
            console.error(err);
            return;
        }
        res.json({
            code: 200,
            msg: 'Tiezi added successfully'
        })
    })
});

const delete_post = Router.post('/delete', (req, res) => {
    const params = req.body;
    const id = params.id;
    const sql = 'DELETE FROM tiezi WHERE post_id = ?';
    db.query(sql, [id], (err, result) => {
        if(err) {
            console.error(err);
            return;
        }
        res.json({
            code: 200,
            msg: 'Tiezi deleted successfully'
        })
    })
});

const get_all_tiezi = Router.get('/getall', (req, res) => {
    const sql = 'SELECT * FROM tiezi';
    db.query(sql, (err, result) => {
        if(err) {
            console.error(err);
            return;
        }
        res.json({
            code: 200,
            msg: 'Tiezi fetched successfully',
            data: result
        })
    });
});

//get all tiezi from users that the current user is following
const get_following_tiezi = Router.get('/getfollowing', (req, res) => {
    const {user_id} = req.body;
    const sql = 'select * from tiezi where author in (select username from user where user_id in (select following_id from user_following where id = ?))';
    db.query(sql, [user_id], (err, result) => {
        if(err) {
            console.log(err);
            return;
        }
        res.json({
            code: 200,
            msg: 'get following author\'s tiezi',
            data: result
        })
    });
});

const get_images_for_a_post = Router.post('/get_images', (req, res) => {
    const {post_id} = req.body;
    const sql = 'SELECT * FROM tiezi WHERE post_id = ?';
    db.query(sql, [post_id], async (err, result) => {
        if(err) {
            console.log(err)
            return res.status(500).json({
                code: 500,
                msg: 'get images error',
            });
        }
        console.log(result)
        const data = fs.readFileSync(result[0].filepath);
        const mimeType = mime.getType(data);
        res.set('Content-Type', mimeType);
        res.send(data);
    });
});

const search_tiezi = Router.get('/search', (req, res) => {
    let title = req.query.title;
    title = '%' + title + '%';
    const sql = 'SELECT * FROM tiezi WHERE title LIKE ?';
    db.query(sql, [title], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({
                code: 500,
                msg: 'search tiezi error',
            });
        }
        res.json({
            code: 200,
            msg: 'search tiezi',
            data: result
        })
    });
});

module.exports = {
    get_all_tiezi,
    get_following_tiezi,
    add_post,
    delete_post,
    get_images_for_a_post,
    search_tiezi
}
