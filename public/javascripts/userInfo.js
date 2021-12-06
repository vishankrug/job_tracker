async function init(){
    await loadIdentity();
    loadUserInfo();
}

async function saveUserInfo(){
    //TODO: do an ajax call to save whatever info you want about the user from the user table
    //see postComment() in the index.js file as an example of how to do this
    console.log("hello");
    let favorite_ice_cream = document.getElementById('favorite_ice_cream_input').value;
    let responseJSON = await loadUser(favorite_ice_cream);
    if(responseJSON.status == "error"){
        console.log("error:" + responseJSON.error)
    }else{
        loadUserInfo();
    }
    let x = document.getElementById('favorite_ice_cream_input')
    x.value = "";
}

async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');

    let response = await fetch(`api/${apiVersion}/user?favorite_ice_cream=${encodeURIComponent(username)}`);
    let userJSON
    try{
        userJSON = await response.json();
    }catch{
        console.log("no")
    }

    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");
        if(!userJSON){
            document.getElementById("favorite").innerText = "Enter data!";
        }else{
            document.getElementById("favorite").innerText = userJSON.favorite_ice_cream;
        }
    }else{
        document.getElementById("username-span").innerText=username;
        document.getElementById("user_info_new_div").classList.add("d-none");
    }
    
    //TODO: do an ajax call to load whatever info you want about the user from the user table
    loadUserInfoPosts(username)
}

async function loadUserInfoPosts(username){
    console.log("Username: " +  username);
    let postsJson = await loadUserPostsApi(username);
    let postsHtml = postsJson.map(postInfo => {
        console.log(postInfo)
        return `
        <div class="post">
            ${postInfo.description}
            ${postInfo.htmlPreview}
            <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${postInfo.username}</a>, ${postInfo.created_date}</div>
            <div class="post-interactions">
                <div>
                    <span title="${postInfo.likes}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deletePost("${postInfo.id}")' class="${username==myIdentity ? "": "d-none"}">Delete</button></div>
            </div>
        </div>`
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}


async function deletePost(postId){
    let responesJSON = await deletePostAPI(postId);
    if(responesJSON.status == "error"){
        console.log("error:" + responesJSON.error);
    }else{
        loadUserInfo();
    }
}