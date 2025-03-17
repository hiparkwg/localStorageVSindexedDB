// db open
( (frm)=>{
    console.log("ready...")
    let id="a1234";
    let dbName="myDB";
    let table = "exam";
    let db;//database object
    let req = indexedDB.open(dbName,1);
    req.onsuccess = (event)=>{
        db = event.target.result;
        console.log("db open")
        load();
    }
    req.onerror = (event)=>{
        console.log("db open error!!!")
        //indexedDB.deleteDatabase("myDB");
    }
    req.onupgradeneeded=(event)=>{
        db = event.target.result;
        if( !db.objectStoreNames.contains(table)){
            db.createObjectStore(table , {keyPath : "id"}); 
        }
    }

    //window.onbeforeunload = store(document.frm)

    // indexDB -> form, 각종 이벤트 처리
    function load(){
        let choiceType = ['radio','checkbox','select']
        let trans = db.transaction(table, "readonly");
        let store = trans.objectStore(table);
        let req = store.get(id);
        let data={};
        req.onsuccess=(event)=>{
            data = event.target.result;
            console.table("load ", data)
            if(data){
                data.data.forEach(d =>{
                    if(choiceType.includes(d.tagType)){
                        let list = document.querySelectorAll(`[name="${d.tagName}"]`);
                        list.forEach(target=>{
                            if(target.value == d.value) target.checked=true;
                        })
                    }else{
                        let tag = document.querySelector(`[name="${d.tagName}"]`);
                        tag.value = d.value;
                    }
                })
            }else{
                console.log("not found data.")
                createData();
            }
        }
        frm.addEventListener("input", update)
        

    }
    function createData(){
        let trans = db.transaction(table, "readwrite");
        let store = trans.objectStore(table);
        console.log('createData id ', id)
        let data = {
            'id' : id,
            'data' :[]
        }
        let req = store.add(data);
        req.onsuccess=()=>{
            console.log("create new data.")
        }
    }

    function update(){
        let formData = new FormData(frm);
        let data = [];
        let storeData = {};
        for( let[key, value] of formData.entries()){
            let tagType = frm.querySelector(`[name="${key}"]`).type;
            props = {
                'tagName' : key,
                'tagType' : tagType,
                'value'   : value
            }
            data.push(props)
        }
        
        let trans = db.transaction(table, "readwrite");
        let store = trans.objectStore(table);
        storeData = {
            'id' : id,
           'data': data
        }
        let req = store.put(storeData);
        req.onsuccess=(event)=>{
            console.table(storeData);

        }
    }


    let btnDelete = document.querySelector("#btnDelete");
    btnDelete.addEventListener("click", ()=>{
        db.close();
        let req = indexedDB.deleteDatabase(dbName);
        req.onsuccess=()=>{
            frm.removeEventListener("input", update);
            console.log("database delete.")
        }
        req.onblocked=()=>{
            console.log("db close()")
            db.close();
        }
    })
        
})(document.frm)