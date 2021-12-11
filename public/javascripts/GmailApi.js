// import axios from 'axios'
// import qs from 'qs'
// // import fs from 'fs';
// // import readline from 'readline';
// // import {google} from 'googleapis';

//All code for Gmail API


// class GmailAPI {
//     accessToken = "";
//     constructor() {
//       this.accessToken = this.getAcceToken();
//     }
  
//     getAcceToken = async () => {
//       var data = qs.stringify({
//         client_id:
//           "300842056421-k9ubs6oga5vah733gc8hnoorbr7hs25v.apps.googleusercontent.com",
//         client_secret: "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",
//         refresh_token:
//           "",
//         grant_type: "refresh_token",
//       });
//       var config = {
//         method: "post",
//         url: "https://accounts.google.com/o/oauth2/token",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         data: data,
//       };
  
//       let accessToken = "";
  
//       await axios(config)
//         .then(async function (response) {
//           accessToken = await response.data.access_token;
  
//         })
//         .catch(function (error) {
//           console.log(error);
//         });
  
//       return accessToken;
//     };
  
//     searchGmail = async (searchItem) => {
//       var config1 = {
//         method: "get",
//         url:
//           "https://www.googleapis.com/gmail/v1/users/me/messages?q=" + searchItem,
//         headers: {
//           Authorization: `Bearer ${await this.accessToken} `,
//         },
//       };
//       var threadId = "";
  
//       await axios(config1)
//         .then(async function (response) {
//           threadId = await response.data["messages"][0].id;
  
//         })
//         .catch(function (error) {
//           console.log(error);
//         });
  
//       return threadId;
//     };
  
//     readGmailContent = async (messageId) => {
//       var config = {
//         method: "get",
//         url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
//         headers: {
//           Authorization: `Bearer ${await this.accessToken}`,
//         },
//       };
  
//       var data = {};
  
//       await axios(config)
//         .then(async function (response) {
//           data = await response.data;
//         })
//         .catch(function (error) {
//           console.log(error);
//         });
  
//       return data;
//     };
  
//     readInboxContent = async (searchText) => {
//       const threadId = await this.searchGmail(searchText);
//       const message = await this.readGmailContent(threadId);
  
//       const encodedMessage = await message.payload["parts"][0].body.data;

      
  
//       const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");
    
//       return decodedStr;
//     };
// }

// const gmail = new GmailAPI();
// const emails = gmail.readInboxContent("subject:Application");

// //document.getElementById("showThing").innerHTML = `<p>${emails}</p>`
// fs.writeFile('emails.txt', await emails+"", (err) => {
      
//     // In case of a error throw err.
//     if (err) throw err;
// })