const apiVersion = "v1"

async function loadIdentityApi(){
    try{
        let response = await fetch(`api/${apiVersion}/getIdentity`);
        let responseJson = await response.json();
        return responseJson;
    }catch(error){
        return {
            status: "error",
            error: "There was an error: " + error
        };
    }
}

async function updateApplicationInfo(postId, companyName, position, typeOfJob, date, notes) {
    try {
        let response = await fetch(`api/${apiVersion}/updatePosts?postId=${postId}`, {
            method: "POST",
            body: JSON.stringify({companyName: companyName, 
                                position: position,
                                typeOfJob: typeOfJob,
                                date: date,
                                notes: notes}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return {
            status: "error",
            error: "There was an error: " + error
        }
    }
}


async function updateStatus(status, postId) {
    try {
        let response = await fetch(`api/${apiVersion}/updateStatus?postId=${postId}`, {
            method: "POST",
            body: JSON.stringify({status: status}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return {
            status: "error",
            error: "There was an error: " + error
        }
    }
}

// this function should call your URL preview api endpoint 
// and return an html string with the preview
async function getURLPreview(url){
    try{
        let response = await fetch(`api/${apiVersion}/previewurl?url=${url}`);
        let responseText = await response.text();
        return responseText;
    }catch(error){
        return "There was an error: " + error;
    }
}

async function loadApplicationsApi(){
    let response = await fetch(`api/${apiVersion}/posts`);
    let postsJson = await response.json();
    return postsJson;
}

async function postProgress(postID){ //this was the one I was working on
    let response = await fetch(`api/${apiVersion}/addProgress?postID=${postID}`);
    let postsJson = await response.json();
    return postsJson;
}

async function loadUserPostsApi(username){
    let response = await fetch(`api/${apiVersion}/userPosts?username=${encodeURIComponent(username)}`);
    let postsJson = await response.json();
    return postsJson;
}

async function loadUser(username){
    let response = await fetch(`api/${apiVersion}/user?favorite_ice_cream=${encodeURIComponent(username)}`, 
    {
        method: "POST",
        body: JSON.stringify({username: username}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let userJSON = await response.json();
    return userJSON;

}

async function postApplicationApi(companyName, position, typeOfJob, date, notes){
    try{
    const myData = {companyName: companyName, position: position, typeOfJob: typeOfJob, date: date, notes: notes};
    let response = await fetch(`api/${apiVersion}/posts`,
        {
            method: "POST",
            body: JSON.stringify(myData),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
    let responseJson = await response.json();
    return responseJson;
    }catch(error){
        return {status: error, error: error}
    }
}

async function deletePostAPI(postID){
    try{
        let response = await fetch(`api/${apiVersion}/posts`, {
            method: "DELETE",
            body: JSON.stringify({postID: postID}),
            headers: {'Content-Type': 'application/json'}
        })
        let responseJson = await response.json();
        return responseJson;
    }catch(error){
        return {status: error, error: error}
    }
}

async function likePostAPI(postID){
    try{
        let response = await fetch(`api/${apiVersion}/likePost`, {
            method: "POST",
            body: JSON.stringify({postID: postID}),
            headers: {'Content-Type': 'application/json'}
        })
        let responseJson = await response.json();
        return responseJson;
    }catch(error){
        return {status: error, error: error}
    }
}

async function unlikePostAPI(postID){
    try{
        let response = await fetch(`api/${apiVersion}/unlikePost`, {
            method: "POST",
            body: JSON.stringify({postID: postID}),
            headers: {'Content-Type': 'application/json'}
        })
        let responseJson = await response.json();
        return responseJson;
    }catch(error){
        return {status: error, error: error}
    }
}


async function getCommentsAPI(postID){
    try{
        let response = await fetch(`api/${apiVersion}/comments?postID=${postID}`)
        let responseJson = await response.json();
        return responseJson;
    }catch(error){
        return {status: error, error: error}
    }
}

async function postCommentAPI(postID, newComment){
    try{
        let response = await fetch(`api/${apiVersion}/comments`, {
            method: "POST",
            body: JSON.stringify({postID: postID, newComment: newComment}),
            headers: {'Content-Type': 'application/json'}
        })
        let responseJson = await response.json();
        return responseJson;
    }catch(error){
        return {status: error, error: error}
    }
}