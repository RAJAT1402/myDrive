// IIFE is created so that in multiple files there is no namespace pollution 
// Eg if we declare i in two script files then they both will collide but not if IIFE is created due to function scope
(function(){
    let pageTemplates = document.querySelector("#pageTemplates");
    let star = document.querySelector(".star");
    let trash = document.querySelector(".trash");
    let myDrive = document.querySelector(".myDrive");
    let divContainer = document.querySelector("#divContainer");
    let divBreadCrumb = document.querySelector("#divBreadCrumb");
    let aRootPath = document.querySelector(".path");
    let body = document.querySelector(".main");
    let newFolder = document.querySelector(".addFolder");
    let newFile = document.querySelector(".addFile");
    let btnAddFolder = document.querySelector("#btnAddFolder");
    let createFolder = document.querySelector(".createFolder");
    let cancelFolder = document.querySelector(".cancelFolder");
    let btnAddFile = document.querySelector("#btnAddFile");
    let cancelFile = document.querySelector(".cancelFile");
    let createFile = document.querySelector(".createFile");
    let name = document.querySelector("#name");
    let name1 = document.querySelector("#name1");
    let newBtn = document.querySelector("#New");
    let newMenu = document.querySelector("#newMenu")
    
    let divAppTitle = document.querySelector("#app-title");
    let divAppMenuBar = document.querySelector("#app-menu-bar");
    let divAppBody = document.querySelector("#app-body");

    let rid = -1;
    let crid = -1;      // ID of the folder in which we are
    let untitledFolder = 1;
    let untitledFile = 1;
    let resources = [];
    
    star.addEventListener("click", () =>{
        let selected = document.querySelector(".selected");
        selected.classList.remove("selected");
        star.classList.add("selected");
        
        divContainer.innerHTML = "";

        divBreadCrumb.innerHTML = "<div class='path'>Starred</div>";

        for(let i = 0; i < resources.length; i++){
            if(resources[i].isStar == true){
                if(resources[i].rtype == "folder"){
                    addFolderInPage(resources[i].name, resources[i].id, resources[i].pid);
                } else if(resources[i].rtype == "file"){
                    addFileInPage(resources[i].name, resources[i].id, resources[i].pid);
                }
            }
        }
    })

    trash.addEventListener("click", () =>{
        let selected = document.querySelector(".selected");
        selected.classList.remove("selected");
        trash.classList.add("selected");

        divContainer.innerHTML = "";

        divBreadCrumb.innerHTML = "<div class='path'>Trash</div>";

        for(let i = 0; i < resources.length; i++){
            if(resources[i].istrash == true){
                if(resources[i].rtype == "folder"){
                    addFolderInPage(resources[i].name, resources[i].id, resources[i].pid);
                } else if(resources[i].rtype == "file"){
                    addFileInPage(resources[i].name, resources[i].id, resources[i].pid);
                }
            }
        }
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

    function navigateBreadcrumb(){
        
        crid = parseInt(this.getAttribute("rid"));

        divContainer.innerHTML = "";
        
        for(let i = 0; i < resources.length; i++){
            if(resources[i].pid == crid){
                if(resources[i].rtype == "folder"){
                    addFolderInPage(resources[i].name, resources[i].id, resources[i].pid);
                } else if(resources[i].rtype == "file"){
                    addFileInPage(resources[i].name, resources[i].id, resources[i].pid);
                }
            }
        }

        while(this.nextSibling){
            this.parentNode.removeChild(this.nextSibling);
        }
    }

    newBtn.addEventListener("click", ()=>{
        newMenu.style.display = "flex";
        // window.addEventListener("click", (e)=>{
            //     console.log("hello")
            //     newMenu.style.display = "none";
            // })
    })
        
    btnAddFolder.addEventListener("click", addFolder);
    btnAddFile.addEventListener("click",addFile);
    aRootPath.addEventListener("click", navigateBreadcrumb);
    
    // ********************************************** Folder *****************************************************************
    function addFolder(){
        body.style.opacity = 0.5;
        newFolder.style.display = "block";
        let input = newFolder.querySelector("input");
        input.click();
        newMenu.style.display = "none";
    }

    cancelFolder.addEventListener("click",()=>{
        body.style.opacity = 1;
        newFolder.style.display = "none";
    })
    
    createFolder.addEventListener("click", ()=>{
        
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
    
    function renameFolder(){
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

    function deleteFolder(){
        let divFolder = this.parentNode.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let ridtbd = divFolder.getAttribute("rid");
        
        let flag = confirm("Do you want to delete the folder "+ divName.innerHTML);
        if(flag ==true){
            // ram
            let ridx = resources.findIndex(f => f.id == ridtbd);
            // resources.splice(ridx, 1);
            resources[ridx].istrash = true;
            
            // html
            divContainer.removeChild(divFolder);
            
            // storage
            persistresourcesToStorage();
        }    
        this.parentNode.style.display = "none";
    }
    
    function restoreFolder(){
        let divFolder = this.parentNode.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let ridtbd = divFolder.getAttribute("rid");

                // ram
                let ridx = resources.findIndex(f => f.id == ridtbd);
                // resources.splice(ridx, 1);
                resources[ridx].istrash = false;

                // html
                divContainer.removeChild(divFolder);

                // storage
                persistresourcesToStorage();
        
        this.parentNode.style.display = "none";
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

    function removeFolder(){
        let divFolder = this.parentNode.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let ridtbd = divFolder.getAttribute("rid");
        deleteHelper(ridtbd);
        let flag = confirm("Do you want to delete the folder "+ divName.innerHTML);
        if(flag ==true){
                // ram
                let ridx = resources.findIndex(f => f.id == ridtbd);
                resources.splice(ridx, 1);

                // html
                divContainer.removeChild(divFolder);

                // storage
                persistresourcesToStorage();
        }    
        this.parentNode.style.display = "none";
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

        for(let i = 0; i < resources.length; i++){
            if(resources[i].pid == crid){
                if(resources[i].rtype == "folder"){
                    addFolderInPage(resources[i].name, resources[i].id, resources[i].pid);
                } else if(resources[i].rtype == "file"){
                    addFileInPage(resources[i].name, resources[i].id, resources[i].pid);
                }
            }
        }
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
        Divedit.addEventListener("click", renameFolder);

        let Divstar = divFolder.querySelector("div[action='star']");
        Divstar.addEventListener("click", starFolder);

        let DivRestore = divFolder.querySelector("div[action='restore']");
        DivRestore.addEventListener("click", restoreFolder);

        let DivRemove = divFolder.querySelector("div[action='remove']");
        DivRemove.addEventListener("click", removeFolder);

        img.addEventListener("dblclick", viewFolder)

        divContainer.appendChild(divFolder);
    }

    // ************************************************ File ***********************************************
    function addFile(){
        body.style.opacity = 0.5;
        newFile.style.display = "block";
        newMenu.style.display = "none";
    }

    cancelFile.addEventListener("click",()=>{
        body.style.opacity = 1;
        newFile.style.display = "none";
    })

    createFile.addEventListener("click", ()=>{
        let rname = name1.value;

        let UntitledName = rname.slice(0, rname.length - 1);
        
        if(UntitledName == "Untitled File"){
            untitledFile++;
        }
        let exists = resources.some(f => f.name == rname);
            if (exists == false) {
                rid++;
                resources.push({
                    id: rid,
                    name: rname,
                    pid: crid,
                    rtype: "file",
                    isStar: false,
                    istrash: false,
                    isBold: true,
                    isItalic: false,
                    isUnderline: false,
                    bgColor: "#000000",
                    textColor: "#FFFFFF",
                    fontFamily: "cursive",
                    fontSize: 22,
                    content: "I am a new file."
                });
                // console.log(crid);
                addFileInPage(rname, rid, crid);
                persistresourcesToStorage();
            
            } else {
                alert(rname + " already exists");
            } 
            
        name1.value = "Untitled File" + untitledFile;
        body.style.opacity = 1;
        newFile.style.display = "none";
    })

    function deleteFile(){
        let divFile = this.parentNode.parentNode;
        let divName = divFile.querySelector("[purpose='name']");
        let ridtbd = divFile.getAttribute("rid");

        let flag = confirm("Do you want to delete the file "+ divName.innerHTML);
        if(flag ==true){
           
                // ram
                let ridx = resources.findIndex(f => f.id == ridtbd);
                resources[ridx].istrash = true;
                // resources.splice(ridx, 1);

                // html
                divContainer.removeChild(divFile);

                // storage
                persistresourcesToStorage();
        }    
        this.parentNode.style.display = "none";
    }

    function removeFile(){
        let divFile = this.parentNode.parentNode;
        let divName = divFile.querySelector("[purpose='name']");
        let ridtbd = divFile.getAttribute("rid");
    
        let flag = confirm("Do you want to delete the file "+ divName.innerHTML);
        if(flag ==true){
                // ram
                let ridx = resources.findIndex(f => f.id == ridtbd);
                resources.splice(ridx, 1);

                // html
                divContainer.removeChild(divFile);

                // storage
                persistresourcesToStorage();
        }    
        this.parentNode.style.display = "none";
    }

    function restoreFile(){
        let divFile = this.parentNode.parentNode;
        let divName = divFile.querySelector("[purpose='name']");
        let ridtbd = divFile.getAttribute("rid");

                // ram
                let ridx = resources.findIndex(f => f.id == ridtbd);
                // resources.splice(ridx, 1);
                resources[ridx].istrash = false;

                // html
                divContainer.removeChild(divFile);

                // storage
                persistresourcesToStorage();
    
        this.parentNode.style.display = "none";
    }

    function renameFile(){
        let divFile = this.parentNode.parentNode;
        let divName = divFile.querySelector("[purpose='name']");
        let orname = divName.innerHTML;

        let nrname = prompt("Enter new name for " + orname);
        if (!!nrname) {
            if (nrname != orname) {
                let exists = resources.filter(f => f.pid == crid).some(f => f.name == nrname);
                if (exists == false) {
                   // ram
                   let file = resources.filter(f => f.pid == crid).find(f => f.name == orname);
                   file.name = nrname;

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

    function starFile(){
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

    function viewFile(){
        let spanView = this;
        let divTextFile = spanView.parentNode;
        let divName = divTextFile.querySelector("[purpose=name]");
        let fname = divName.innerHTML;
        let fid = parseInt(divTextFile.getAttribute("rid"));

        let divNotepadMenuTemplate = pageTemplates.content.querySelector("[purpose=notepad-menu]");
        let divNotepadMenu = document.importNode(divNotepadMenuTemplate, true);
        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divNotepadMenu);

        let divNotepadBodyTemplate = pageTemplates.content.querySelector("[purpose=notepad-body]");
        let divNotepadBody = document.importNode(divNotepadBodyTemplate, true);
        divAppBody.innerHTML = "";
        divAppBody.appendChild(divNotepadBody);

        divAppTitle.innerHTML = fname;
        divAppTitle.setAttribute("rid", fid);

        let spanSave = divAppMenuBar.querySelector("[action=save]");
        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let spanDownload = divAppMenuBar.querySelector("[action=download]");
        let inputUpload = divAppMenuBar.querySelector("[action=upload]");
        let spanForUpload = divAppMenuBar.querySelector("[action=forupload]");
        let textArea = divAppBody.querySelector("textArea");

        spanSave.addEventListener("click", saveNotepad);
        spanBold.addEventListener("click", makeNotepadBold);
        spanItalic.addEventListener("click", makeNotepadItalic);
        spanUnderline.addEventListener("click", makeNotepadUnderline);
        inputBGColor.addEventListener("change", changeNotepadBGColor);
        inputTextColor.addEventListener("change", changeNotepadTextColor);
        selectFontFamily.addEventListener("change", changeNotepadFontFamily);
        selectFontSize.addEventListener("change", changeNotepadFontSize);
        spanDownload.addEventListener("click", downloadNotepad);
        inputUpload.addEventListener("change", uploadNotepad);
        spanForUpload.addEventListener("click", ()=>{
            inputUpload.click();
        })

        let resource = resources.find(r => r.id == fid);
        spanBold.setAttribute("pressed", !resource.isBold);
        spanItalic.setAttribute("pressed", !resource.isItalic);
        spanUnderline.setAttribute("pressed", !resource.isUnderline);
        inputBGColor.value = resource.bgColor;
        inputTextColor.value = resource.textColor;
        selectFontFamily.value = resource.fontFamily;
        selectFontSize.value = resource.fontSize;
        textArea.value = resource.content;

        spanBold.dispatchEvent(new Event("click"));
        spanItalic.dispatchEvent(new Event("click"));
        spanUnderline.dispatchEvent(new Event("click"));
        inputBGColor.dispatchEvent(new Event("change"));
        inputTextColor.dispatchEvent(new Event("change"));
        selectFontFamily.dispatchEvent(new Event("change"));
        selectFontSize.dispatchEvent(new Event("change"));
    }

    function downloadNotepad(){
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.id == fid);
        let divNotepadMenu = this.parentNode;
        
        let strForDownload = JSON.stringify(resource);
        let encodedData = encodeURIComponent(strForDownload);
        
        let aDownload = divNotepadMenu.querySelector("a[purpose=download]");
        aDownload.setAttribute("href", "data:text/json; charset=utf-8, " + encodedData);
        aDownload.setAttribute("download", resource.name + ".json");

        aDownload.click();
    }

    function uploadNotepad(){
        let file = window.event.target.files[0]; 
        let reader = new FileReader();
        reader.addEventListener("load", function(){
            let data = window.event.target.result;
            let resource = JSON.parse(data);

            let spanBold = divAppMenuBar.querySelector("[action=bold]");
            let spanItalic = divAppMenuBar.querySelector("[action=italic]");
            let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
            let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
            let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
            let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
            let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
            let textArea = divAppBody.querySelector("textArea");

            spanBold.setAttribute("pressed", !resource.isBold);
            spanItalic.setAttribute("pressed", !resource.isItalic);
            spanUnderline.setAttribute("pressed", !resource.isUnderline);
            inputBGColor.value = resource.bgColor;
            inputTextColor.value = resource.textColor;
            selectFontFamily.value = resource.fontFamily;
            selectFontSize.value = resource.fontSize;
            textArea.value = resource.content;

            spanBold.dispatchEvent(new Event("click"));
            spanItalic.dispatchEvent(new Event("click"));
            spanUnderline.dispatchEvent(new Event("click"));
            inputBGColor.dispatchEvent(new Event("change"));
            inputTextColor.dispatchEvent(new Event("change"));
            selectFontFamily.dispatchEvent(new Event("change"));
            selectFontSize.dispatchEvent(new Event("change"));
        })

        reader.readAsText(file);
        
    }

    function addFileInPage(rname, rid, pid){
        let ridx = resources.findIndex(f => f.id == rid);
        if(divBreadCrumb.innerText != "Trash"){     
            if(resources[ridx].istrash == true){
                return;
            }
        }

        let divFileTemplate = pageTemplates.content.querySelector(".file");
        let divFile = document.importNode(divFileTemplate, true);
        let divName = divFile.querySelector("[purpose='name']");
        
        let more = divFile.querySelector(".more");
        let more1 = divFile.querySelector(".more1");
        let img = divFile.querySelector("img");
        let star = more.querySelector("[action='star']");
        
        let isStar = resources[ridx].isStar;
        
        if(isStar == true){
            star.innerText = "Unstar";
        }

        divName.innerHTML = rname;
        divFile.setAttribute("rid", rid);
        divFile.setAttribute("pid", pid);
        divFile.setAttribute("title",rname);

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

        let Divdelete = divFile.querySelector("div[action='delete']");
        Divdelete.addEventListener("click", deleteFile);

        let Divedit = divFile.querySelector("div[action='edit']");
        Divedit.addEventListener("click", renameFile);

        let Divstar = divFile.querySelector("div[action='star']");
        Divstar.addEventListener("click", starFile);

        let DivRestore = divFile.querySelector("div[action='restore']");
        DivRestore.addEventListener("click", restoreFile);

        let DivRemove = divFile.querySelector("div[action='remove']");
        DivRemove.addEventListener("click", removeFile);

        img.addEventListener("dblclick", viewFile);

        divContainer.appendChild(divFile);
    }

    function makeNotepadBold(){ 
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.fontWeight = "bold";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.fontWeight = "normal";
        }
    }

    function makeNotepadItalic(){ 
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.fontStyle = "italic";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.fontStyle = "normal";
        }
    }

    function makeNotepadUnderline(){ 
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.textDecoration = "underline";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.textDecoration = "none";
        }
    }

    function changeNotepadBGColor(){ 
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.backgroundColor = color;
    }

    function changeNotepadTextColor(){ 
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.color = color;
    }

    function changeNotepadFontFamily(){ 
        let fontFamily = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontFamily = fontFamily;
    }

    function changeNotepadFontSize(){ 
        let fontSize = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontSize = fontSize + "px";
    }

    function saveNotepad(){ 
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.id == fid);

        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let textArea = divAppBody.querySelector("textArea");

        resource.isBold = spanBold.getAttribute("pressed") == "true";
        resource.isItalic = spanItalic.getAttribute("pressed") == "true";
        resource.isUnderline = spanUnderline.getAttribute("pressed") == "true";
        resource.bgColor = inputBGColor.value;
        resource.textColor = inputTextColor.value;
        resource.fontFamily = selectFontFamily.value;
        resource.fontSize = selectFontSize.value;
        resource.content = textArea.value;

        persistresourcesToStorage();
    }

    // ********************************** Storage **********************************************************
    function persistresourcesToStorage(){
        let fjson = JSON.stringify(resources);
        localStorage.setItem("data", fjson);
    }

    function loadresourcesFromStorage(){
        let rjson = localStorage.getItem("data");
        if(!rjson){
            return;
        }
       
        resources = JSON.parse(rjson);
        for(let i = 0; i < resources.length; i++){
            if(resources[i].pid == crid){
                if(resources[i].rtype == "folder"){
                    addFolderInPage(resources[i].name, resources[i].id, resources[i].pid);
                } else if(resources[i].rtype == "file"){
                    addFileInPage(resources[i].name, resources[i].id, resources[i].pid);
                }
            }

            if(resources[i].id > rid){
                rid = resources[i].id;
            }
        }
    }

    loadresourcesFromStorage();
})();