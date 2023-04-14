var express = require('express');
var db = require('../../database/db');
var Router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
const uploadPhoto = (req, res, next) => {
    const dest_path = '../public/images/';
    let upload = multer({dest: dest_path}).single('photo');
    upload(req, res, (err) => {
        if(err) {
            return res.json({
                code: 500,
                msg: 'Image upload through https failed',
                err: err
            })
        }else{
            next();
        }
    });
};

const upload_image = Router.post('/upload', uploadPhoto, (req, res) => {
    const file = req.file;
    const {tiezi_id} = req.body;
    //判断tiezi_id是否存在，如果不存在就insert，不然就update
    const tiezi_id_is_exist = 'SELECT * FROM tiezi_imgs WHERE tiezi_id = ?';
    db.query(tiezi_id_is_exist, [tiezi_id], (err, result) => {
        if(err) {
            return res.status(500).json({
                code: 500,
                msg: 'determine whether tiezi is exist error',
            })
        }
        if(result.length === 0) {
            const sql = 'INSERT INTO tiezi_imgs (tiezi_id, filename, filepath) VALUES (?, ?, ?)';
            db.query(sql, [tiezi_id, file.originalname, file.path], (err) => {
                if(err) {
                    console.log(err);
                    return;
                }
                res.json({
                    code: 200,
                    msg: 'Image uploaded successfully',
                })
            });
        }else{
            const sql = 'UPDATE tiezi_imgs SET filename = ?, filepath = ? WHERE tiezi_id = ?';
            db.query(sql, [file.originalname, file.path, tiezi_id], (err) => {
                if(err) {
                    return res.status(500).json({
                        code: 500,
                        msg: 'update image error',
                    });
                }
                res.json({
                    code: 200,
                    msg: 'Image updated successfully',
                })
            });
        }

    });
});

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

});
//
const get_images_for_a_post = Router.get('/get_images', (req, res) => {
    const {post_id} = req.body;
    const sql = 'SELECT * FROM tiezi_imgs WHERE tiezi_id = ?';
    db.query(sql, [post_id], async (err, result) => {
        if(err) {
            return res.status(500).json({
                code: 500,
                msg: 'get images error',
            });
        }
        const data = fs.readFileSync(result[0].filepath);
        const mimeType = mime.getType(result[0].filepath);
        res.set('Content-Type', mimeType);
        res.send(data);
    });
});

module.exports = {
    get_comments_for_a_post,
    add_comment,
    upload_image,
    get_images_for_a_post,
    delete_comment
}