// IIFE is created so that in multiple files there is no namespace pollution 

(function(){
    let btnAddFolder = document.querySelector("#btnAddFolder");
    let divContainer = document.querySelector("#divContainer");
    let pageTemplates = document.querySelector("#pageTemplates");
    let divBreadCrumb = document.querySelector("#divBreadCrumb");
    let aRootPath = document.querySelector(".path");
    let newFolder = document.querySelector(".addFolder");
    let body = document.querySelector(".main");
    let cancel = document.querySelector(".cancel");
    let create = document.querySelector(".create");
    let name = document.querySelector("#name");
    let star = document.querySelector(".star");
    let trash = document.querySelector(".trash");
    let myDrive = document.querySelector(".myDrive");
    let fid = -1;
    let cfid = -1;      // ID of the folder in which we are
    let untitledFolder = 1;
    let folders = [];

    btnAddFolder.addEventListener("click", addFolder);
    aRootPath.addEventListener("click", navigateBreadcrumb);

    cancel.addEventListener("click",()=>{
        body.style.opacity = 1;
        newFolder.style.display = "none";
    })

    create.addEventListener("click", ()=>{
        
        let fname = name.value;

        let UntitledName = fname.slice(0, fname.length - 1);
    
        if(UntitledName == "Untitled Folder"){
            untitledFolder++;
        }
        let exists = folders.some(f => f.name == fname);
            if (exists == false) {
                fid++;
                folders.push({
                    id: fid,
                    name: fname,
                    pid: cfid
                });
                addFolderInPage(fname, fid, cfid);
                persistFoldersToStorage();
            
            } else {
                alert(fname + " already exists");
                
            } 
            
        name.value = "Untitled Folder" + untitledFolder;
        body.style.opacity = 1;
        newFolder.style.display = "none";
    })

    star.addEventListener("click", () =>{
        let selected = document.querySelector(".selected");
        selected.classList.remove("selected");
        star.classList.add("selected");
    })

    trash.addEventListener("click", () =>{
        let selected = document.querySelector(".selected");
        selected.classList.remove("selected");
        trash.classList.add("selected");
    })

    myDrive.addEventListener("click", () =>{
        let selected = document.querySelector(".selected");
        selected.classList.remove("selected");
        myDrive.classList.add("selected");
    })

    function addFolder(){
        // let fname = prompt("Enter folder's name");
        body.style.opacity = 0.5;
        newFolder.style.display = "block";

    }

    function deleteFolder(){
        let divFolder = this.parentNode.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let fidtbd = divFolder.getAttribute("fid");

        let flag = confirm("Do you want to delete the folder "+ divName.innerHTML);
        if(flag ==true){
            let exists = folders.some(f => f.pid == fidtbd);
            if(exists == false){
                // ram
                let fidx = folders.findIndex(f => f.id == fidtbd);
                folders.splice(fidx, 1);

                // html
                divContainer.removeChild(divFolder);

                // storage
                persistFoldersToStorage();
            } else {
                alert("Can't delete. Has children.");
            }
        }    
        this.parentNode.style.display = "none";
    }

    function editFolder(){
        let divFolder = this.parentNode.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let ofname = divName.innerHTML;

        let nfname = prompt("Enter new name for " + ofname);
        if (!!nfname) {
            if (nfname != ofname) {
                let exists = folders.filter(f => f.pid == cfid).some(f => f.name == nfname);
                if (exists == false) {
                   // ram
                   let folder = folders.filter(f => f.pid == cfid).find(f => f.name == ofname);
                   folder.name = nfname;

                   // html
                   divName.innerHTML = nfname;

                   // storage
                   persistFoldersToStorage();
                } else {
                    alert(nfname + " already exists");
                }
            } else {
                alert("This is the old name only. Please enter something new.");
            }
        } else {
            alert("Please enter a name");
        }
        this.parentNode.style.display = "none";
    }

    function navigateBreadcrumb(){
        
        cfid = parseInt(this.getAttribute("fid"));

        divContainer.innerHTML = "";

        folders.filter(f => f.pid == cfid).forEach(f =>{
            addFolderInPage(f.name, f.id, f.pid);
        })

        while(this.nextSibling){
            this.parentNode.removeChild(this.nextSibling);
        }
    }

    function viewFolder(){
        let divFolder = this;
        let divName = divFolder.querySelector("[purpose='name']");
        cfid = parseInt(divFolder.getAttribute("fid"));

        let aPathTemplate = pageTemplates.content.querySelector(".path");
        let aPath = document.importNode(aPathTemplate, true);

        aPath.innerHTML = " > " + divName.innerHTML;
        aPath.setAttribute("fid", cfid);
        aPath.addEventListener("click", navigateBreadcrumb);
        divBreadCrumb.appendChild(aPath);

        divContainer.innerHTML = "";

        folders.filter(f => f.pid == cfid).forEach(f =>{
            addFolderInPage(f.name, f.id, f.pid);
        })
    }

    function addFolderInPage(fname, fid, pid){
        let divFolderTemplate = pageTemplates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);
        let options = divFolder.querySelector(".options");
        let more = divFolder.querySelector(".more");

        let divName = divFolder.querySelector("[purpose='name']");
        
        divName.innerHTML = fname;
        divFolder.setAttribute("fid", fid);
        divFolder.setAttribute("pid", pid);
        
        options.addEventListener("click", ()=>{

            more.style.display = "block";
        })
        let Divdelete = divFolder.querySelector("div[action='delete']");
        Divdelete.addEventListener("click", deleteFolder);

        let Divedit = divFolder.querySelector("div[action='edit']");
        Divedit.addEventListener("click", editFolder);

        // let spanView = divFolder.querySelector("span[action='view']");
        // spanView.addEventListener("click", viewFolder);

        divFolder.addEventListener("dblclick", viewFolder)

        divContainer.appendChild(divFolder);
    }

    function persistFoldersToStorage(){
        let fjson = JSON.stringify(folders);
        localStorage.setItem("data", fjson);
    }

    function loadFoldersFromStorage(){
        let fjson = localStorage.getItem("data");
        if(!!fjson){
            folders = JSON.parse(fjson);
            folders.forEach(function(f){
                if(f.id > fid){
                    fid = f.id;
                }

                if(f.pid == cfid){
                    addFolderInPage(f.name, f.id);
                }
            })
        }
    }

    loadFoldersFromStorage();
})();