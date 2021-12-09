import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';
import MsIdExpress from 'microsoft-identity-express'
import axios from 'axios'
import qs from 'qs'

// const fs = require('fs');
// const readline = require('readline');
// const {google} = require('googleapis');

import fs from 'fs';
import readline from 'readline';
import {google} from 'googleapis';
//import oAuth2Client from 'google-auth-library'
//import OAuth2Client from google.auth.OAuth2;

//const {google} = require('googleapis');
//const { OAuth2Client } = require('google-auth-library');

//const oAuth2Client = google.auth.OAuth


let authUrl
let oAuth2Client


const SCOPES = ['https://mail.google.com/'];
const TOKEN_PATH = 'token.json';


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
//  function authorize(credentials, callback, res) {
//     const {client_secret, client_id, redirect_uris} = credentials.installed;
//     oAuth2Client = new google.auth.OAuth2(
//         client_id, client_secret, redirect_uris[0]);
  
//     // Check if we have previously stored a token.
//     fs.readFile(TOKEN_PATH, (err, token) => {
//       if (err) return getNewToken(oAuth2Client, callback, res);
//       oAuth2Client.setCredentials(JSON.parse(token));
//       callback(oAuth2Client);
//     });
//   }


//  function getNewToken(oAuth2Client, callback, res) {
//     authUrl = oAuth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: SCOPES,
//     });
//     // console.log('Authorize this app by visiting this url:', authUrl);
//     // const rl = readline.createInterface({
//     //   input: process.stdin,
//     //   output: process.stdout,
//     // });
//     // rl.question('Enter the code from that page here: ', (code) => {
//     //   rl.close();
//     //   oAuth2Client.getToken(code, (err, token) => {
//     //     if (err) return console.error('Error retrieving access token', err);
//     //     oAuth2Client.setCredentials(token);
//     //     // Store the token to disk for later program executions
//     //     fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//     //       if (err) return console.error(err);
//     //       console.log('Token stored to', TOKEN_PATH);
//     //     });
//     //     callback(oAuth2Client);
//     //   });
//     // });
//     res.redirect(authUrl);
//   }
  
  /**
   * Lists the labels in the user's account.
   *
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
//   function listLabels(auth) {
//     const gmail = google.gmail({version: 'v1', auth});
//     gmail.users.labels.list({
//       userId: 'me',
//     }, (err, res) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       const labels = res.data.labels;
//       if (labels.length) {
//         console.log('Labels:');
//         labels.forEach((label) => {
//           console.log(`- ${label.name}`);
//         });
//       } else {
//         console.log('No labels found.');
//       }
//     });
//   }

  
  

const appSettings = {
    appCredentials: {
        clientId: "0309f862-9db7-4f35-865f-67cb3363a897", // Application (client) ID on Azure AD
        tenantId: "f6b6dd5b-f02f-441a-99a0-162ac5060bd2", // alt. "common" "organizations" "consumers"
        clientSecret: "Hk_7Q~AG5.KwDWApPj8NYRx9LGi0_xQ6Mupkk" // alt. client certificate or key vault credential
    },
    authRoutes: {
        // redirect: "https://www.websitesharer-vishank.me/redirect",
        redirect: "http://localhost:3000/redirect",
        error: "/error", // the wrapper will redirect to this route in case of any error.
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
    }
};

import indexRouter from './routes/index.js';
import apiv1Router from './routes/api/v1/apiv1.js'; //edited

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecret",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}))
// instantiate the MS auth wrapper
const msid = new MsIdExpress.WebAppAuthClientBuilder(appSettings).build();
// initialize the MS auth wrapper
app.use(msid.initialize());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('./public/', {index: 'landing.html'}))


app.use('/', indexRouter);
app.use('/api/v1', apiv1Router) //edited

var authed = false;

// authentication routes
// app.get('/signin', (req, res) => {
//     fs.readFile('credentials.json', (err, content) => {
//         if (err) return console.log('Error loading client secret file:', err);
//         // Authorize a client with credentials, then call the Gmail API.
//         authorize(JSON.parse(content), listLabels, res);
//     });
// });

// app.get('/auth/google/callback', (req, res) => {
//     const code = req.query.code
//     if (code) {
//         // Get an access token based on our OAuth code
//         oAuth2Client.getToken(code, function (err, tokens) {
//             if (err) {
//                 console.log('Error authenticating')
//                 console.log(err);
//             } else {
//                 oAuth2Client.setCredentials(tokens);
//                 authed = true;
//                 console.log("Here!!!")
//                 res.redirect("/");
//             }
//         });
//     }
// })

app.get('/signin', 
    msid.signIn({
        postLoginRedirect: '/'
    }
));

app.get('/signout', 
    msid.signOut({
        postLogoutRedirect: '/'
    }
));

// app.get()
// // unauthorized
app.get('/error', (req, res) => res.status(500).send('server error'));

// // error
app.get('/unauthorized', (req, res) => res.status(401).send('Permission denied'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Example app listening at http://localhost:PORT')
})

//import gmail from "GmailApi"
//var gmail = require("./GmailApi");

class GmailAPI {
    accessToken = "";
    constructor() {
      this.accessToken = this.getAcceToken();
    }
  
    getAcceToken = async () => {
      var data = qs.stringify({
        client_id:
          "300842056421-k9ubs6oga5vah733gc8hnoorbr7hs25v.apps.googleusercontent.com",
        client_secret: "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",
        refresh_token:
          "1//06aR24AU0NdXSCgYIARAAGAYSNgF-L9Ir444-IyD5n8q4AlfqdS5NwqVgu8AJ3_iUxwJPkUI4Mi1CldK4MUVvfK2QCjr-_Hzwdg",
        grant_type: "refresh_token",
      });
      var config = {
        method: "post",
        url: "https://accounts.google.com/o/oauth2/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };
  
      let accessToken = "";
  
      await axios(config)
        .then(async function (response) {
          accessToken = await response.data.access_token;
  
          console.log("Access Token " + accessToken);
        })
        .catch(function (error) {
          console.log(error);
        });
  
      return accessToken;
    };
  
    searchGmail = async (searchItem) => {
      var config1 = {
        method: "get",
        url:
          "https://www.googleapis.com/gmail/v1/users/me/messages?q=" + searchItem,
        headers: {
          Authorization: `Bearer ${await this.accessToken} `,
        },
      };
      var threadId = "";
  
      await axios(config1)
        .then(async function (response) {
          threadId = await response.data["messages"][0].id;
  
          console.log("ThreadId = " + threadId);
        })
        .catch(function (error) {
          console.log(error);
        });
  
      return threadId;
    };
  
    readGmailContent = async (messageId) => {
      var config = {
        method: "get",
        url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
        headers: {
          Authorization: `Bearer ${await this.accessToken}`,
        },
      };
  
      var data = {};
  
      await axios(config)
        .then(async function (response) {
          data = await response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
  
      return data;
    };
  
    readInboxContent = async (searchText) => {
      const threadId = await this.searchGmail(searchText);
      const message = await this.readGmailContent(threadId);
  
      const encodedMessage = await message.payload["parts"][0].body.data;
  
      const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");
  
      console.log(decodedStr);
  
      return decodedStr;
    };
}

const gmail = new GmailAPI();
const emails = gmail.readInboxContent("subject:Application");
console.log(emails);


export default app;
