const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

//read the favs.json file then store the essential value in fileTweet array
const fileTweet = [];
fs.readFile('favs.json', (err, data) => {
    if (err) throw err;
    let json = JSON.parse(data);  
    for(eachItem of json){
        //get tweet, name, time created, screen name, and id from favs.json
        const data = {
            created_at: eachItem.created_at,
            text: eachItem.text,
            name: eachItem.user.name,
            screen_name: eachItem.user.screen_name,
            id: eachItem.user.id
        }
        fileTweet.push(data);
    }
});

const PORT = process.env.PORT || 3000;

//use body-parser and dirname
app.use(express.static(__dirname));
app.use(bodyParser.json());

//function to send respond to get function
app.get('/fileTweet', function(req, res){
    res.send({fileTweet: fileTweet});
});

//create temp array to store the tweet with given id
const temp = [];
app.get('/temp/:id', function(req, res){
    let id = req.params.id;
    let found = false;
    fileTweet.forEach(function(fileT, index){
        if(!found && fileT.id === Number(id)){
            temp.push(fileT);   //push tweet found with given id into temp array
        }
    });
    res.send({temp: temp});     //send the respond

});

//create new tweet function
app.post('/fileTweet', function(req, res){
    //retrive text and id from input from script.js
    let fileTweetText = req.body.textInput
    let fileTweetId = req.body.idInput;
    let today = new Date();
    //push new tweet into fileTweet array
    fileTweet.push({
        created_at: today,
        text: fileTweetText,
        id: fileTweetId
    });
    res.send('Succesfully create tweet with ' + fileTweetId);
});

//Update screen_name of user given user's name
app.put('/fileTweet/:name', function(req, res){
    //get the id to allocate where the new screen nam have entered
    let name = req.params.name;
    //get new name from script.js
    let newName = req.body.newName;
    let found = false;
    //when the id is found, update its screen name with the new one
    fileTweet.forEach(function(fileT, index){
        if(!found && fileT.name === name){
            fileT.screen_name = newName;
        }
    });
    res.send('succes put');
});

//Delete the tweet given id
app.delete('/fileTweet/:id', function(req, res){
    let id = req.params.id;
    let found = false;
    fileTweet.forEach(function(fileT, index){
        //if the position of tweet is found prefer to its id, delete that tweet
        if(!found && fileT.id === Number(id)){
            fileTweet.splice(index, 1);
        }
    });
    res.send('Succesfully delete tweet')
});

// listen on localhost 3000
app.listen(PORT, function(){
    console.log(`server listening on ${PORT}`);
});