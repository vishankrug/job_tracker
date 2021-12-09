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

async function deleteApplicationAPI(postID){
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