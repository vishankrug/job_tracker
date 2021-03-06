// import * as fs from 'fs';
// import * as readline from 'readline';
// import * as googleapis from 'googleapis';

async function loadApplications(){
    let postsJson = await loadApplicationsApi();
    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class = "post" id='post-${postInfo.id}'>
                <div class="card column is-third mt-6 mb-6 mr-6 ml-6">
                    <p class="card-header-title is-centered">${postInfo.status === undefined ? "No status..." : postInfo.status}</p>
                    <header class="card-header mt-6">
                        <div class="navbar-start">
                            <p class="card-header-title level-item has-text-centered navbar-item">${postInfo.companyName}</p>
                        </div>
                        <div class="navbar-end">
                            <p class="card-header-title navbar-item">${postInfo.position}</p>
                        </div>
                    </header>
                    <div class="post-interactions card-content">
                        <div class="content">
                            <p> Type of Job: ${postInfo.typeOfJob} </p>
                            <p> Date Applied: ${postInfo.date} </p>
                            <p> Notes: ${postInfo.notes} </p>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <div class="card-footer-item">
                            <select class="select" onchange='changeStatus("${postInfo.id}")' id='select-${postInfo.id}'>
                                <option value="Select">Select</option>
                                <option value="Applied">Applied</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        <a onclick='editApplication("${postInfo.id}")' href="#" class="card-footer-item">Edit</a>
                        <a onclick='deleteApplication("${postInfo.id}")' href="#" class="card-footer-item">Delete</a>
                    </footer>
                </div>
            </div>
        </div>`

    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;

}

async function getApplicationEmails(){
    document.getElementById('emailSpace').innerHTML = `<p>Gmail functionality is disabled because it is too expensive and for security reasons. Refer to video in readme.</p>`
}


async function editApplication(postID) {
    let postsJson = await loadApplicationsApi();

    let post = postsJson.filter(info => {
        if(info.id == postID){
            return true
        }
    })

    post = post[0]
    document.getElementById("companyName-modal").value = post.companyName
    document.getElementById("position-modal").value = post.position
    document.getElementById("typeOfJob-modal").value = post.typeOfJob
    document.getElementById("date-modal").value = post.date
    document.getElementById("notes-modal").value = post.notes

    document.getElementById("save-changes").setAttribute("onclick", `update("${postID}")`);

    let elem = document.getElementById('modalID')
    elem.classList.add("is-active")

}

function removeModal(){
    let element = document.getElementById('modalID')
    element.classList.remove("is-active")
}

async function update(postID){
    let companyName = document.getElementById("companyName-modal").value
    let position = document.getElementById("position-modal").value
    let typeOfJob = document.getElementById("typeOfJob-modal").value
    let date = document.getElementById("date-modal").value
    let notes = document.getElementById("notes-modal").value
    
    await updateApplicationInfo(postID, companyName, position, typeOfJob, date, notes)
    removeModal()
    loadApplications()
}



async function deleteApplication(postId){
    let responesJSON = await deleteApplicationAPI(postId);
    if(responesJSON.status == "error"){
        console.log("error:" + responesJSON.error);
    }else{
        loadApplications()
    }
}

async function changeStatus(postID){
    const status = document.getElementById(`select-${postID}`).value
    await updateStatus(status, postID);
    loadApplications()
}

// async function addProgress(postId){
//     let addData = await postProgress(postId)

//     if(addData.status == "error"){
//         console.log("error:" + responesJSON.error);
//     }else{
//         loadPosts(); //check this later
//     }
// }

// async function toggleProgress(postID){
//     console.log(postID)
//     let element = document.getElementById(`post-${postID}`)


//     element.innerHTML += `<textarea id = 'posts_box'></textarea>`
// }

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
