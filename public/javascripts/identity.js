let myIdentity = undefined;

const escapeHTML = str => str.replace(/[&<>'"]/g, 
  tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));


async function signoutButton(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    let logout_div = document.getElementById("logout");
    logout_div.innerHTML = `
    <nav class="navbar container mt-6" role="navigation" aria-label="main navigation">            
        <a href="signout" class="button is-danger">Log out</a>
        <div class="navbar-end">
            <p>${username}</p>
        </div>
    </nav>`;
        if(document.getElementById("make_post_div")){
            document.getElementById("make_post_div").classList.remove("d-none");
    }
}

async function loadIdentity(){
    let identityInfo = await loadIdentityApi();
    let identity_div = document.getElementById("identity_div");
    let logout_div = document.getElementById("logout");
    if(identityInfo.status == "error"){
        console.log("I am in error")
        myIdentity = undefined;
        identity_div.innerHTML = `<div>
        <button onclick="loadIdentity()">retry</button>
        Error loading identity: <span id="identity_error_span"></span>
        </div>`;
        document.getElementById("identity_error_span").innerText = identityInfo.error;
        if(document.getElementById("make_post_div")){
            document.getElementById("make_post_div").classList.add("d-none");
        }
        Array.from(document.getElementsByClassName("new-comment-box")).forEach(e => e.classList.add("d-none"));
        Array.from(document.getElementsByClassName("heart-button-span")).forEach(e => e.classList.add("d-none"));
    } else if(identityInfo.status == "loggedin"){
        console.log("I am in logged in")
        myIdentity = identityInfo.userInfo.username;
        console.log("Look here at the identity")
        console.log(myIdentity)
        location.href = `/index.html?user=${encodeURIComponent(identityInfo.userInfo.username)}`;
        logout_div.innerHTML = `
        <a href="/userInfo.html?user=${encodeURIComponent(identityInfo.userInfo.username)}">${identityInfo.userInfo.name} (${identityInfo.userInfo.username})</a>
        <a href="signout" class="btn btn-danger" role="button">Log out</a>`;
        if(document.getElementById("make_post_div")){
            document.getElementById("make_post_div").classList.remove("d-none");
        }
        
        Array.from(document.getElementsByClassName("new-comment-box")).forEach(e => e.classList.remove("d-none"))
        Array.from(document.getElementsByClassName("heart-button-span")).forEach(e => e.classList.remove("d-none"));
    } else { //loggedout
        myIdentity = undefined;
        identity_div.innerHTML = `
        <a href="signin" class="button is-light" role="button">Log in</a>`;
        if(document.getElementById("make_post_div")){
            document.getElementById("make_post_div").classList.add("d-none");
        }
        Array.from(document.getElementsByClassName("new-comment-box")).forEach(e => e.classList.add("d-none"))
        Array.from(document.getElementsByClassName("heart-button-span")).forEach(e => e.classList.add("d-none"));
    }
}
