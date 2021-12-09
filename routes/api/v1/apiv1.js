import fetch from 'node-fetch';
import express from 'express';
import { promises as fs } from "fs";
import mongoose from "mongoose";
import { parse } from 'node-html-parser';
import session from 'express-session';
var router = express.Router();

main().catch(err => console.log(err));

let Application;
let AddProgress;

async function main() {
  await mongoose.connect(`mongodb+srv://vishankr:Vishank6676@info441.fh0cv.mongodb.net/job-tracker?retryWrites=true&w=majority`);
    //req.session.account.username

  const applicationSchema = new mongoose.Schema({
    username: String,
    companyName: String,
    position: String,
    typeOfJob: String,
    date: String, //need to change this to date
    notes: String,
    status: String
  });

  Application = mongoose.model('Application', applicationSchema);

  const progress = new mongoose.Schema({
    username: String,
    post: {type: mongoose.Schema.Types.ObjectId, ref: "Application"},
    Stage: String,
    InterviewType: String,
    date: String, //need to change this to date
    notes: String
  });

  AddProgress = mongoose.model('AddProgress', progress);

}

router.post('/posts', async function(req, res, next){
    // console.log(req.body)
    let session = req.session
    if(session.isAuthenticated){
        try{
            const newApplication = new Application({
                username: session.account.username,
                companyName: req.body.companyName,
                position: req.body.position,
                typeOfJob: req.body.typeOfJob,
                date: req.body.date,
                notes: req.body.notes,
                status: "Applied"
            });
    
            await newApplication.save()
            res.send("status: 'success'")
        }catch(error){
            res.send("error: " + error)
        }
    }else{
        res.type('json')
        res.send({"status": "error", "error": "not logged in"})
    }

});

router.get("/posts", async function(req, res, next){
    let session = req.session;
    if(session.isAuthenticated){
        try{
            let allPosts = await Application.find()
            let filteredPosts = allPosts.filter(user => {
                if(user.username == session.account.username){
                    return true
                }
            })
            let html = await Promise.all(filteredPosts.map(async postInfo => {
                return {'username': session.account.username,
                        'companyName': postInfo.companyName, //check
                        'position' : postInfo.position,
                        'typeOfJob' : postInfo.typeOfJob, 
                        'date': postInfo.date,
                        'notes': postInfo.notes,
                        'id': postInfo.id,
                        'status': postInfo.status
                    } 
            }))
            res.type('json')
            res.send(html)
        }catch(error){
            res.type('json')
            res.send("error: " + error)
        }
    }else{
        res.type('json')
        res.send({"status": "error", "error": "not logged in"})
    }
    
})

router.post("/updatePosts", async function (req, res, next) {
    let session = req.session;

    if (session.isAuthenticated) {
        try {
            const postId = req.query.postId;
            const companyName = req.body.companyName;
            const position = req.body.position;
            const typeOfJob = req.body.typeOfJob;
            const date = req.body.date;
            const notes = req.body.notes;
            
            let card = await Application.findById(postId);
            card.companyName = companyName;
            card.position = position;
            card.typeOfJob = typeOfJob;
            card.date = date;
            card.notes = notes;

            await card.save();
            res.type("json")
            res.send("status: 'success'")
        } catch(error){
            res.type('json')
            res.send("error: " + error)
        }
    } else {
        res.type('json')
        res.send({"status": "error", "error": "not logged in"}) 
    }
})

router.post("/updateStatus", async function (req, res, next) {
    let session = req.session;

    if (session.isAuthenticated) {
        try {
            const postId = req.query.postId;
            const status = req.body.status;
            
            let card = await Application.findById(postId);
            card.status = status;

            await card.save();
            res.type("json")
            res.send("status: 'success'")
        } catch(error){
            res.type('json')
            res.send("error: " + error)
        }
    } else {
        res.type('json')
        res.send({"status": "error", "error": "not logged in"}) 
    }
})

router.post("/addProgress", async function(req, res, next){
    let session = req.session

    if(session.isAuthenticated) {
        try{
            
            const jsonFormat = new AddProgress ({
                username: session.connect.username,
                post: req.body.postID,
                Stage: req.body.Stage,
                InterviewType: req.body.InterviewType,
                date: req.body.date, //need to change this to date
                notes: req.body.notes
            })

            let saveresponse = await jsonFormat.save();
            res.type("json")
            res.send("{status: 'success'}")  
                
        }catch(error){
            res.type('json')
            res.send("error: " + error)
        }
    } else {
        res.type('json')
        res.send({"status": "error", "error": "not logged in"}) 
    }
})

router.get('/addProgress', async function(req, res, next) {
    try{
        let getProgress = await Comment.find();

        getProgress = getProgress.filter(progress => {
            if(progress.post == req.query.postID){
                return true
            }
        })
    
        res.type("json")
        res.send(getProgress);

    }catch(error){
        res.send("The error is: " + error);
    }
  
  })

router.get("/getIdentity", async function(req, res, next){
    let session = req.session
    console.log("In get identity")
    console.log(session.isAuthenticated);
    if (session.isAuthenticated) {
        res.type("json")
        res.send(
            {"status": "loggedin", 
            "userInfo": {
                "name": session.account.name, 
                "username": session.account.username
            }
        })
    } else {
        res.type("json")
        res.send({"staus": "logged out"})
    }
})

router.delete('/posts', async function(req, res, next) {
    let session = req.session
    if(session.isAuthenticated){
        try{
            let post = await Application.findById(req.body.postID)
            if(post.username != session.account.username){
                res.type("json")
                res.send({"status": "error", "error": "Cannot delete"})
            }else{
                //let deletedComments = await Comment.deleteMany({post: req.body.postID});
                let deletedPost = await Application.deleteOne({_id: req.body.postID});
                res.type("json")
                res.send("status: 'success'")
            }
        }catch(error){
            res.send("error: " + error)
        }
    }else{
        res.type("json")
        res.send({"status": "error", "error": "not logged in"})
    }
});

export default router;


  