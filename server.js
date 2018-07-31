var express = require("express");
var cors = require('cors'); // cors requried for cross origin support
var app = express();

// configure app to handle cross origin

// get body parser middleware for post request
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// connection for database

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://root:superuser123@ds247101.mlab.com:47101/loginsafeguard", { useNewUrlParser: true }, err => {
    if (err) {
        console.log('Error connecting to mongodb server caused by' + err);
    }
    console.log('database connected successfully.')
});

// User Schema

var UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, index: true },
    password: String,
    registerDate: Date,
    isLocked: { type: Boolean, default: false },
    loginAttempted: { type: Number, default: 0 }
});

// UserModel

var UserModel = mongoose.model("UserModel", UserSchema);

// REST Call to create new user if does not exist in database. If exist it returns object with status false.
app.post("/register", function (req, res) {
    var data = req.body;
    var userObject = new UserModel({
        email: data.email,
        username: data.username,
        password: data.password,
        registerDate: Date.now()
    });
    console.log(userObject.email + data.email);
    UserModel.findOne({ email: data.email })
        .then(item => {
            if (item && item.email == data.email) {
                res.status(208).send({ msg: 'Already exists', success: false })
            } else {
                userObject.save(userObject)
                    .then(item => {
                        res.status(201).send({ msg: 'User created', success: true, data: userObject });
                    })
                    .catch(err => {
                        res.status(400).send("unable to save to database");
                    });
            }
        })
});


// REST call to perform login using the credentials provided. It will find user using email id, 
// if user exist, it will check the password and try to match it with the password in the requet
// and if password matches, send success status else increment the loginattemnt by 1.
// also conditionally if login attemnt is >=2, set user lock status true and return user object.
app.post('/login', function (req, res) {
    var data = req.body;
    var newUser = {};

    UserModel.find({ email: data.username })
        .then(item => {
            var foundItem = item[0];
            if (foundItem == undefined || foundItem.email == undefined) {
                res.status(401).send({ msg: 'Invalid credentials, user does not exist.', success: false });
                return;
            }
            if (foundItem.isLocked == true) {
                res.status(403).send({ msg: 'Your account is blocked due to 3 failed login attempts.', success: false, data: foundItem });
                 return;
            }
            if (foundItem.password != data.password) {
                newUser.loginAttempted = foundItem.loginAttempted + 1
                if (foundItem.loginAttempted >= 2) {
                    newUser.isLocked = true
                }
            } else {
                res.status(200).send({ msg: 'Login success', success: true, data: foundItem });
                 return;
            }
            UserModel.findOneAndUpdate({ email: data.username }, { $set: newUser }, { new: true })
                .then(updateItem => {
                    res.status(401).send({ msg: 'Incorrect password', success: false, data: updateItem });
                     return;
                })
                .catch(err => {
                    if(err)
                    res.status(500).send('Error occureed during login' + err);
                    return;
                })
        })
        .catch(err => {
            console.log("Mongo error" + err);
            if(err){
                res.status(500).send({ msg: 'Internal Server Error', success: false, data: err });
            }
             return;
        })
});


// List down all the users exist in system
app.get("/users", (req, res) => {
    UserModel.find({})
        .then(user => {
            res.status(200).send(user)
        })
        .catch(err => {
            res.status(302).send(err);
        })
});

// List down all the users exist in system
app.get("/users/:email", (req, res) => {
    UserModel.find({email: email})
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.send(err);
        })
});

// node sever code begins
var port = 3000;
var server = app.listen(port, () => {
    console.log("Server listensing at port 3000, open http://localhost:3000");
});


module.exports = server;