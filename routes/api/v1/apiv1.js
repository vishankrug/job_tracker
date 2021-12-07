import fetch from 'node-fetch';
import express from 'express';
import { promises as fs } from "fs";
import mongoose from "mongoose";
import { parse } from 'node-html-parser';
import session from 'express-session';
var router = express.Router();

main().catch(err => console.log(err));

let Application;

async function main() {
  await mongoose.connect(`mongodb+srv://vishankr:Vishank6676@info441.fh0cv.mongodb.net/job-tracker?retryWrites=true&w=majority`);
    //req.session.account.username

  const applicationSchema = new mongoose.Schema({
    username: String,
    companyName: String,
    position: String,
    typeOfJob: String,
    date: String, //need to change this to date
    notes: String
  });

  Application = mongoose.model('Application', applicationSchema);

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
                notes: req.body.notes
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

// router.post('/user', async function(req, res, next){
//     // console.log(req.body)
//     let session = req.session
//     if(session.isAuthenticated){
//         let newUser = new User({
//             username: session.account.username, //check
//             favorite_ice_cream: req.query.favorite_ice_cream
//         });

//         await newUser.save()
//         res.type("json")
//         res.send({status: 'success'});
//     }else{
//         res.type("json")
//         res.send({"status": "error", "error": "not logged in"})
//     }
// });

// router.get('/user', async function(req, res, next) {
//     let allUsers = await User.find();
//     let session = req.session
//     try{
//         if(session.isAuthenticated){
//             let oneUser = allUsers.filter(user => {
//                 if(user.username == session.account.username){
//                     return true
//                 }
//             })
          
//             let json = oneUser.map(userInfo => {
//               return {"username": userInfo.username,
//                       "favorite_ice_cream": userInfo.favorite_ice_cream
//             }
//             })
//             res.type("json")
//             res.send(json[json.length-1]);
//         }
//     }catch(error){
//         res.type('json')
//         res.send("error: " + error)
//     }
    
//   })

// router.post('/posts', async function(req, res, next){
//     // console.log(req.body)
//     let session = req.session
//     if(session.isAuthenticated){
//         try{
//             const newPost = new Post({
//                 url: req.body.url,
//                 username: session.account.username, //check
//                 description: req.body.description,
//                 created_date: new Date()
//             });

//             await newPost.save()
//             res.send("status: 'success'")
//         }catch(error){
//             res.send("error: " + error)
//         }
//     }else{
//         res.type("json")
//         res.send({"status": "error", "error": "not logged in"})
//     }
// });

// router.post('/likePost', async function(req, res, next) {
//     let session = req.session
//     if(session.isAuthenticated){
//         try{
//             let post = await Post.findById(req.body.postID)
//             if(!(post.likes.includes(session.account.username))){
//                 post.likes.push(session.account.username);
//             }
//             await post.save()
//             // console.log(post)
//             res.type("json")
//             res.send("status: 'success'")
//         }catch(error){
//             res.send("error: " + error)
//         }
//     }else{
//         res.type("json")
//         res.send({"status": "error", "error": "not logged in"})
//     }
// })

// router.post('/unlikePost', async function(req, res, next) {
//     let session = req.session
//     if(session.isAuthenticated){
//         try{
//             let post = await Post.findById(req.body.postID)
//             if((post.likes.includes(session.account.username))){
//                 post.likes.remove(session.account.username);
//             }
//             await post.save()
//             // console.log(post)
//             res.type("json")
//             res.send("status: 'success'")
//         }catch(error){
//             res.send("error: " + error)
//         }
//     }else{
//         res.type("json")
//         res.send({"status": "error", "error": "not logged in"})
//     }
// })

// router.post('/comments', async function(req, res, next) {
//     let session = req.session
//     if(session.isAuthenticated){
//         try{
//             const newComment = new Comment({
//                 username: session.account.username, //check
//                 comment: req.body.newComment,
//                 post: req.body.postID,
//                 created_date: (new Date)
//             });
//             await newComment.save()
//             res.type("json")
//             res.send("status: 'success'")
//         }catch(error){
//             res.send("error: " + error)
//         }
//     }else{
//         res.type("json")
//         res.send({"status": "error", "error": "not logged in"})
//     }
// })

// router.get("/comments", async function(req, res, next){
//     try{
//         let comments = await Comment.find()
//         comments = comments.filter(comment => {
//             if(comment.post == req.query.postID){
//                 return true
//             }
//         })
//         res.type('json')
//         res.send(comments)
//     }catch(error){
//         res.type('json')
//         res.send("error: " + error)
//     }
// })

// router.get("/userPosts", async function(req, res, next){
//     try{
//         let posts = await Post.find()
//         posts = posts.filter(post => {
//             if(post.username == req.query.username){
//                 return true
//             }
//         })

//         let html = await Promise.all(posts.map(async postInfo => {
//             return {'id': postInfo.id, //check
//                     'username' : postInfo.username,
//                     'description' : postInfo.description, 
//                     'htmlPreview': await getHTML(postInfo.url),
//                     'created_date': postInfo.created_date,
//                     'likes': postInfo.likes
//                 } 
//         }))
//         res.type('json')
//         res.send(html)
//     }catch(error){
//         res.type('json')
//         res.send("error: " + error)
//     }
// })

router.get("/getIdentity", async function(req, res, next){
    let session = req.session
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

// router.get("/posts", async function(req, res, next){
//     try{
//         let allPosts = await Post.find()
//         let html = await Promise.all(allPosts.map(async postInfo => {
//             return {'id': postInfo.id, //check
//                     'username' : postInfo.username,
//                     'description' : postInfo.description, 
//                     'htmlPreview': await getHTML(postInfo.url),
//                     'created_date': postInfo.created_date,
//                     'likes': postInfo.likes
//                 } 
//         }))
//         res.type('json')
//         res.send(html)
//     }catch(error){
//         res.type('json')
//         res.send("error: " + error)
//     }
// })

// router.delete('/posts', async function(req, res, next) {
//     let session = req.session
//     if(session.isAuthenticated){
//         try{
//             let post = await Post.findById(req.body.postID)
//             if(post.username != session.account.username){
//                 res.type("json")
//                 res.send({"status": "error", "error": "you can only delete your own posts"})
//             }else{
//                 let deletedComments = await Comment.deleteMany({post: req.body.postID});
//                 let deletedPost = await Post.deleteOne({_id: req.body.postID});
//                 res.type("json")
//                 res.send("status: 'success'")
//             }
//         }catch(error){
//             res.send("error: " + error)
//         }
//     }else{
//         res.type("json")
//         res.send({"status": "error", "error": "not logged in"})
//     }
// });

// const escapeHTML = str => str.replace(/[&<>'"]/g, 
//   tag => ({
//       '&': '&amp;',
//       '<': '&lt;',
//       '>': '&gt;',
//       "'": '&#39;',
//       '"': '&quot;'
//     }[tag]));

// //look at lecture 5
// async function getHTML(url){
//     try{
//         //const data = await fs.
//         const data = await fetch(url);
//         const dataString = await data.text()
//         let htmlPage = parse(dataString)
//         let metaTags = htmlPage.querySelectorAll("meta")
//         let metaUrl = ""
//         let metaTitle = ""
//         let metaImg = ""
//         let metaDescription = ""
//         let metaType = ""    
    
//         for (let i = 0; i < metaTags.length; i++){
//             let metaTag = metaTags[i]
//             let attrs = metaTag.attributes
//             if ("property" in attrs) {
//                 if (attrs.property === "og:url") {
//                     metaUrl = escapeHTML(attrs.content)
//                 } 
//                 if (attrs.property === "og:title") {
//                     metaTitle = escapeHTML(attrs.content)
//                 } 
//                 if (attrs.property === "og:image") {
//                     metaImg = escapeHTML(attrs.content)
//                 }
//                 if (attrs.property === "og:description") {
//                     metaDescription = escapeHTML(attrs.content)
//                 }
//                 if (attrs.property === "og:type") {
//                     metaType = escapeHTML(attrs.content)
//                 }
//             }
//         }
//         if (metaUrl == ""){
//             metaUrl = url
//         }
//         if(metaTitle == ""){
//             metaTitle = htmlPage.querySelector("title").innerHTML
//         }
//         if(metaTitle == ""){
//             metaTitle = url
//         }
//         let html =
//             "<div style=\"max-width: 300px; border: solid 1px; padding: 3px; text-align: center;\">" + 
//                 "<a href=\"" + metaUrl + "\">" + 
//                     "<p><strong>" +
//                         metaTitle +
//                     "</strong></p>"
//         if(metaImg != ""){
//             html = html +  "<img src=\"" + metaImg + "\" style=\"max-height: 200px; max-width: 270px;\">"
//         }
//         html = html + "</a>"
//         if(metaDescription != ""){
//             html = html +  "<p>" + metaDescription + "</p>"
//         }
//         //Creative component
//         if(metaType != ""){
//             html = html +  "<p> Type: " + metaType + "</p>"
//         }
//         html = html + "</div>"
//         // console.log(html)
//         return(html)
//     }catch(error){
//         return("There was an error: " + error);
//     }
// }


// router.get("/previewurl", async function(req, res, next){
//     res.type('html')
//     res.send(await getHTML(req.query.url))
// })


export default router;


  