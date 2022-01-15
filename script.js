// IIFE is created so that in multiple files there is no namespace pollution 
// Eg if we declare i in two script files then they both will collide but not if IIFE is created due to function scope
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
    let rid = -1;
    let crid = -1;      // ID of the folder in which we are
    let untitledFolder = 1;
    let resources = [];

    btnAddFolder.addEventListener("click", addFolder);
    aRootPath.addEventListener("click", navigateBreadcrumb);

    cancel.addEventListener("click",()=>{
        body.style.opacity = 1;
        newFolder.style.display = "none";
    })

    create.addEventListener("click", ()=>{
        
        let rname = name.value;

        let UntitledName = rname.slice(0, rname.length - 1);
    
        if(UntitledName == "Untitled Folder"){
            untitledFolder++;
        }
        let exists = resources.some(f => f.name == rname);
            if (exists == false) {
                rid++;
                resources.push({
                    id: rid,
                    name: rname,
                    pid: crid,
                    rtype: "folder",
                    isStar: false,
                    istrash: false
                });
                // console.log(resources[rid]);
                addFolderInPage(rname, rid, crid);
                persistresourcesToStorage();
            
            } else {
                alert(rname + " already exists");
            } 
            
        name.value = "Untitled Folder" + untitledFolder;
        body.style.opacity = 1;
        newFolder.style.display = "none";
    })

    star.addEventListener("click", () =>{
        let selected = document.querySelector(".selected");
        selected.classList.remove("selected");
        star.classList.add("selected");
        
        divContainer.innerHTML = "";

        divBreadCrumb.innerHTML = "<div class='path'>Starred</div>";

        resources.filter(f => f.isStar == true).forEach(f =>{
            addFolderInPage(f.name, f.id, f.pid);
        })
    })

    trash.addEventListener("click", () =>{
        let selected = document.querySelector(".selected");
        selected.classList.remove("selected");
        trash.classList.add("selected");

        divContainer.innerHTML = "";

        divBreadCrumb.innerHTML = "<div class='path'>Trash</div>";

        resources.filter(f => f.istrash == true).forEach(f =>{
            addFolderInPage(f.name, f.id, f.pid);
        })
    })

    myDrive.addEventListener("click", () =>{
        let selected = document.querySelector(".selected");
        selected.classList.remove("selected");
        myDrive.classList.add("selected");

        divBreadCrumb.innerHTML = `<a class="path" rid="-1">Root</a>`;
        let root = divBreadCrumb.querySelector("a");
        root.addEventListener("click", navigateBreadcrumb);
        root.click();
    })

    function addFolder(){
        // let rname = prompt("Enter folder's name");
        body.style.opacity = 0.5;
        newFolder.style.display = "block";
        let input = newFolder.querySelector("input");
        input.click();
    }

    function deleteHelper(fidtbd){

        let children = resources.filter(f => f.pid == fidtbd)
        for(let i = 0 ; i < children.length ; i++){
            deleteHelper(children[i].rid);
        }

        let ridx = resources.findIndex(r => r.id == fidtbd);
        resources.splice(ridx, 1);
        persistresourcesToStorage();
    }

    function deleteFolder(){
        let divFolder = this.parentNode.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let ridtbd = divFolder.getAttribute("rid");

        let flag = confirm("Do you want to delete the folder "+ divName.innerHTML);
        if(flag ==true){
            let exists = resources.some(f => f.pid == ridtbd);
            // if(exists == false){
                // ram
                let ridx = resources.findIndex(f => f.id == ridtbd);
                // resources.splice(ridx, 1);
                resources[ridx].istrash = true;

                // html
                divContainer.removeChild(divFolder);

                // storage
                persistresourcesToStorage();
            // } else {
                // alert("Can't delete. Has children.");
            // }
        }    
        this.parentNode.style.display = "none";
    }

    function removeFolder(){
        let divFolder = this.parentNode.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let ridtbd = divFolder.getAttribute("rid");
        deleteHelper(ridtbd);
        let flag = confirm("Do you want to delete the folder "+ divName.innerHTML);
        if(flag ==true){
            let exists = resources.some(f => f.pid == ridtbd);
            // if(exists == false){
                // ram
                let ridx = resources.findIndex(f => f.id == ridtbd);
                resources.splice(ridx, 1);

                // html
                divContainer.removeChild(divFolder);

                // storage
                persistresourcesToStorage();
            // } else {
                // alert("Can't delete. Has children.");
            // }
        }    
        this.parentNode.style.display = "none";
    }

    function restoreFolder(){
        let divFolder = this.parentNode.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let ridtbd = divFolder.getAttribute("rid");

        // let flag = confirm("Do you want to delete the folder "+ divName.innerHTML);
        // if(flag ==true){
            // let exists = resources.some(f => f.pid == ridtbd);
            // if(exists == false){
                // ram
                let ridx = resources.findIndex(f => f.id == ridtbd);
                // resources.splice(ridx, 1);
                resources[ridx].istrash = false;

                // html
                divContainer.removeChild(divFolder);

                // storage
                persistresourcesToStorage();
            // } else {
                // alert("Can't delete. Has children.");
            // }
        // }    
        this.parentNode.style.display = "none";
    }

    function editFolder(){
        let divFolder = this.parentNode.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let orname = divName.innerHTML;

        let nrname = prompt("Enter new name for " + orname);
        if (!!nrname) {
            if (nrname != orname) {
                let exists = resources.filter(f => f.pid == crid).some(f => f.name == nrname);
                if (exists == false) {
                   // ram
                   let folder = resources.filter(f => f.pid == crid).find(f => f.name == orname);
                   folder.name = nrname;

                   // html
                   divName.innerHTML = nrname;

                   // storage
                   persistresourcesToStorage();
                } else {
                    alert(nrname + " already exists");
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
        
        crid = parseInt(this.getAttribute("rid"));

        divContainer.innerHTML = "";
        
        resources.filter(f => f.pid == crid).forEach(f =>{
            addFolderInPage(f.name, f.id, f.pid);
        })

        while(this.nextSibling){
            this.parentNode.removeChild(this.nextSibling);
        }
    }

    function viewFolder(){
        if(divBreadCrumb.innerText == "Trash"){     
            return;
        }
        let selected = document.querySelector(".selected");
        selected.classList.remove("selected");
        myDrive.classList.add("selected"); 
        
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        crid = parseInt(divFolder.getAttribute("rid"));
        
       
        if(divBreadCrumb.innerText == "Starred"){
            divBreadCrumb.innerHTML = `<a class="path" rid="-1">Root</a>`;
            let root = divBreadCrumb.querySelector("a");
            root.addEventListener("click", navigateBreadcrumb);
        }

        let arrowTemplate = pageTemplates.content.querySelector(".arrow");
        let arrow = document.importNode(arrowTemplate, true);
        divBreadCrumb.appendChild(arrow);

        let aPathTemplate = pageTemplates.content.querySelector(".path");
        let aPath = document.importNode(aPathTemplate, true);

        aPath.innerHTML = divName.innerHTML;
        aPath.setAttribute("rid", crid);
        aPath.addEventListener("click", navigateBreadcrumb);
        divBreadCrumb.appendChild(aPath);

        divContainer.innerHTML = "";

        resources.filter(f => f.pid == crid).forEach(f =>{
            addFolderInPage(f.name, f.id, f.pid);
        })
    }

    function starFolder(){
        this.parentNode.style.display = "none";
        let rid = this.parentNode.parentNode.getAttribute("rid")
        let pid = this.parentNode.parentNode.getAttribute("pid")
        let name = this.parentNode.parentNode.querySelector("[purpose='name']").innerHTML;
        // console.log(name + " " + rid + " " + pid)

        let ridx = resources.findIndex(f => f.id == rid);
        let isStar = resources[ridx].isStar;
        if(isStar == true){
            this.innerText = "Star";
            resources[ridx].isStar = false;
        }else{
            resources[ridx].isStar = true;
            this.innerText = "Unstar";
            
        }

        let breadCrumb = divBreadCrumb.querySelector(".path").innerText;
        if(breadCrumb == "Starred"){
            star.click();
        }

        persistresourcesToStorage();
       
    }

    function addFolderInPage(rname, rid, pid){

        let ridx = resources.findIndex(f => f.id == rid);
        if(divBreadCrumb.innerText != "Trash"){     
            if(resources[ridx].istrash == true){
                return;
            }
        }

        let divFolderTemplate = pageTemplates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);
        // let options = divFolder.querySelector(".options");
        let more = divFolder.querySelector(".more");
        let more1 = divFolder.querySelector(".more1");
        let img = divFolder.querySelector("img");
        let divName = divFolder.querySelector("[purpose='name']");
        let star = more.querySelector("[action='star']");
        // let ridx = resources.findIndex(f => f.id == rid);
        let isStar = resources[ridx].isStar;
        
        if(isStar == true){
            star.innerText = "Unstar";
        }

        divName.innerHTML = rname;
        divFolder.setAttribute("rid", rid);
        divFolder.setAttribute("pid", pid);
        divFolder.setAttribute("title",rname);
        img.addEventListener("contextmenu", (e)=>{
            e.preventDefault();
            if(resources[ridx].istrash == true){
                more1.style.display = "block";
            }else{
                more.style.display = "block";
            }

            window.addEventListener("click", (e)=>{
                more.style.display = "none";
                more1.style.display = "none";
            })
        })

        let Divdelete = divFolder.querySelector("div[action='delete']");
        Divdelete.addEventListener("click", deleteFolder);

        let Divedit = divFolder.querySelector("div[action='edit']");
        Divedit.addEventListener("click", editFolder);

        let Divstar = divFolder.querySelector("div[action='star']");
        Divstar.addEventListener("click", starFolder);

        let DivRestore = divFolder.querySelector("div[action='restore']");
        DivRestore.addEventListener("click", restoreFolder);

        let DivRemove = divFolder.querySelector("div[action='remove']");
        DivRemove.addEventListener("click", removeFolder);

        // let spanView = divFolder.querySelector("span[action='view']");
        // spanView.addEventListener("click", viewFolder);

        img.addEventListener("dblclick", viewFolder)

        divContainer.appendChild(divFolder);
    }

    function persistresourcesToStorage(){
        let fjson = JSON.stringify(resources);
        localStorage.setItem("data", fjson);
    }

    function loadresourcesFromStorage(){
        let fjson = localStorage.getItem("data");
        if(!!fjson){
            resources = JSON.parse(fjson);
            resources.forEach(function(f){
                if(f.id > rid){
                    rid = f.id;
                }

                if(f.pid == crid){
                    addFolderInPage(f.name, f.id);
                }
            })
        }
    }

    loadresourcesFromStorage();
})();