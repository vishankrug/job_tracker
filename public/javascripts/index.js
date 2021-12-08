// function init(){
//     let urlInput = document.getElementById("urlInput");
//     urlInput.onkeyup = previewUrl;
//     urlInput.onchange = previewUrl;
//     urlInput.onclick = previewUrl;

//     loadIdentity();
//     loadPosts();
// }

async function loadApplications(){
    let postsJson = await loadApplicationsApi();
    console.log(postsJson)
    let postsHtml = postsJson.map(postInfo => {
        //console.log("please look here")
        //console.log(postInfo.id)
        return `
        <div class = "post" id="post-${postInfo.id}">
            ${postInfo.companyName}
            ${postInfo.position}
            <div class="post-interactions">
                <div> ${postInfo.typeOfJob} </div>
                <div> ${postInfo.date} </div>
                <div> ${postInfo.notes} </div>
            </div>
            <button onclick= "toggleProgress(${postInfo.id})">+</button>
        </div>`
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}

async function addProgress(postId){
    let addData = await postProgress(postId)

    if(addData.status == "error"){
        console.log("error:" + responesJSON.error);
    }else{
        loadPosts(); //check this later
    }
}

async function toggleProgress(postID){
    console.log(postID)
    let element = document.getElementById(`post-${postID}`)


    element.innerHTML += `<textarea id = 'posts_box'></textarea>`
}

async function postApplication(){
    document.getElementById("postStatus").innerHTML = "sending data..."
    let companyName = document.getElementById("companyName").value;
    let position = document.getElementById("position").value;
    let typeOfJob = document.getElementById("typeOfJob").value;
    let date = document.getElementById("date").value;
    let notes = document.getElementById("notes").value;
    // let status = await postUrlApi(url, description);
    let status = await postApplicationApi(companyName, position, typeOfJob, date, notes);

    if(status.status == "error"){
        document.getElementById("postStatus").innerText = "Error:" + status.error;
    } else {
        document.getElementById("companyName").value = "";
        document.getElementById("position").value = "";
        document.getElementById("typeOfJob").value = "";
        document.getElementById("date").value = "";
        document.getElementById("notes").value = "";
        document.getElementById("postStatus").innerHTML = "successfully uploaded"
        loadApplications();
    }
}


let lastURLPreviewed = "";
async function previewUrl(){
    document.getElementById("postStatus").innerHTML = "";
    let url = document.getElementById("urlInput").value;
    if(url != lastURLPreviewed){
        lastURLPreviewed = url;
        document.getElementById("url_previews").innerHTML = "Loading preview..."
        let previewHtml = await getURLPreview(url);
        if(url == lastURLPreviewed){
            document.getElementById("url_previews").innerHTML = previewHtml;
        }
    }
}

async function likePost(postId){
    let responesJSON = await likePostAPI(postId);
    if(responesJSON.status == "error"){
        console.log("error:" + responesJSON.error);
    }else{
        loadPosts();
    }
}

async function unlikePost(postId){
    let responesJSON = await unlikePostAPI(postId);
    if(responesJSON.status == "error"){
        console.log("error:" + responesJSON.error);
    }else{
        loadPosts();
    }
}


function getCommentHTML(commentsJSON){
    return commentsJSON.map(commentInfo => {
        return `
        <div class="individual-comment-box">
            <div>${escapeHTML(commentInfo.comment)}</div>
            <div> - <a href="/userInfo.html?user=${encodeURIComponent(commentInfo.username)}">${commentInfo.username}</a>, ${commentInfo.created_date}</div>
        </div>`
    }).join(" ");
}

async function toggleComments(postID){
    let element = document.getElementById(`comments-box-${postID}`);
    if(!element.classList.contains("d-none")){
        element.classList.add("d-none");
    }else{
        element.classList.remove("d-none");
        let commentsElement = document.getElementById(`comments-${postID}`);
        if(commentsElement.innerHTML == ""){ // load comments if not yet loaded
            commentsElement.innerHTML = "loading..."
            commentsJSON = await getCommentsAPI(postID);
            commentsElement.innerHTML = getCommentHTML(commentsJSON);
        }
    }
    
}

async function refreshComments(postID){
    let commentsElement = document.getElementById(`comments-${postID}`);
    commentsElement.innerHTML = "loading..."
    commentsJSON = await getCommentsAPI(postID);
    commentsElement.innerHTML = getCommentHTML(commentsJSON);
}

async function postComment(postID){
    let newComment = document.getElementById(`new-comment-${postID}`).value;
    let responesJSON = await postCommentAPI(postID, newComment);
    if(responesJSON.status == "error"){
        console.log("error:" + responesJSON.error);
    }else{
        refreshComments(postID);
    }
}