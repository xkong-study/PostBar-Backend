var express = require('express');
var Router = express.Router();
var db = require('../../database/db');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;

const register = Router.get('/register', async (req, res) => {
    console.log(req.query)
    const username = req.query.username;
    const password = req.query.password;
    const avatar = req.query.avatar;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sql = 'INSERT INTO user (username, password, avatar) VALUES (?, ?, ?)';
    db.query(sql, [username, hashedPassword, avatar], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({ msg: `${err}` });
        }
        res.status(200).json({
            msg: 'User registered successfully'
        });
    });
});

const authenticateToken = Router.post('/checkToken', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // if authHeader == null it wiill be null
    if(token == null) {
        return res.status(401).json({ msg: 'Token is empty' });
    }
    jwt.verify(token, 'xiaokongwuwuwuQAQ', (err) => {
        if(err) {
            return res.status(403).json({ msg: 'Invalid token' });
        }
        const decodedToken = jwt.verify(token, 'xiaokongwuwuwuQAQ');
        const id = decodedToken.user_id;
        sql = 'SELECT * FROM user WHERE user_id = ?';
        db.query(sql, [id], (err, result) => {
            if(err) {
                console.log(err);
                return res.status(500).json({ msg: 'Database error' });
            }
            if(result.length === 0) {
                return res.status(400).json({ msg: 'User does not exist' });
            }
            req.user = result[0].username;
        });
        return res.status(200).json({
            msg: 'token login successfully'
        })
    });
});

const login = Router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    sql = 'SELECT * FROM user WHERE username = ?';
    db.query(sql, [username], async (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({ msg: 'Database error' });
        }
        if(result.length === 0) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        const match = await bcrypt.compare(password, result[0].password);
        if(!match) {
            return res.status(400).json({ msg: 'Password is incorrect' });
        }
        const token = jwt.sign({ id: result[0].user_id }, 'xiaokongwuwuwuQAQ', {
            expiresIn: '1d',
        });
        res.status(200).json({
            code: 200,
            msg: 'User logged in successfully',
            avatar: result[0].avatar.substring(32),
            token,
        });
    });
});



const add_following = Router.post('/follow', (req, res) => {
    const {user_id, following_id} = req.body;
    const sql = 'insert into user_following (id, following_id) values (?, ?)';
    db.query(sql, [user_id, following_id], (err, result) => {
        if(err) {
            console.log(err);
        }
    });
    const sql1 = 'insert into user_follower (id, follower_id) values (?, ?)';
    db.query(sql1, [following_id, user_id], (err, result) => {
        if(err) {
            console.log(err);
            return;
        }
        res.json({
            code: 200,
            msg: 'add following and follower successfully'
        })
    });
});


const change_userinfo = Router.get('/change', async (req, res) => {
    const username = req.query.username;
    const new_username = req.query.new_username;
    const new_password = await bcrypt.hash(req.query.password, saltRounds);
    const avatar = 'http://localhost:63342/midAutumn/'+req.query.avatar;
    const sql = 'update user set username = ?, password = ?, avatar = ? where username = ?';
    db.query(sql, [new_username, new_password, avatar, username], (err, result) => {
        if(err) {
            console.log(err);
            return res.json({
                code: 500,
                msg: 'change user info failed'
            })
        }
        res.json({
            code: 200,
            msg: 'change user info successfully',
            avatar: avatar.substring(32),
        })
    });
});

module.exports = {
    register,
    login,
    authenticateToken,
    add_following,
    change_userinfo
}

