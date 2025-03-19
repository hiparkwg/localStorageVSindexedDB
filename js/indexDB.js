( (frm)=>{
    let id="a1234";
    let dbName = "myDB";
    let table = "exam";
    let db; // database object

    // database open
    let req = indexedDB.open(dbName, 1);
    req.onsuccess=(event)=>{
        db = event.target.result;
        load();
    }
    req.onerror=(event)=>{
        console.log("db open error!!!")
    }
    // db의 구조가 변경되거나 버전이 바뀌었을 때 자동 호출
    req.onupgradeneeded=(event)=>{
        db = event.target.result;
        if( !db.objectStoreNames.contains(table)){
            db.createObjectStore(table, {keyPath : "id"});
        }
    }


    function load(){
        let choiceType = ["radio", "checkbox", "select"];

        // read data(transaction)
        let trans = db.transaction(table, "readonly");
        let store = trans.objectStore(table); // 데이터 read
        let req = store.get(id); // row
        let data = {};

        req.onsuccess= (event)=>{
            data = event.target.result;
            if(data){
                data.data.forEach(d=>{
                    if(choiceType.includes(d.tagType)){
                        let list = document.querySelectorAll(`[name="${d.tagName}"]`);
                        list.forEach(target=>{
                            if(target.value == d.value) target.checked = true;
                        })
                    }else{
                        let tag = document.querySelector(`[name="${d.tagName}"]`);
                        tag.value = d.value;
                    }
                })
            }
        }
    }

    frm.addEventListener("input", store);
    function store(){
        let formData = new FormData(frm);
        let data=[];
        for( let[tagName, value] of formData.entries()){
            let tagType = frm.querySelector(`[name="${tagName}"]`).type;
            props = {
                'tagName' : tagName,
                'tagType' : tagType,
                'value'   : value
            }
            data.push(props);
        }
        console.log(data);
        let trans = db.transaction(table, "readwrite");
        let store = trans.objectStore(table);
        let storeData = {
            "id" : id,
            "data" : data
        }
        let req = store.put(storeData); 
        req.onsuccess=(event)=>{
            console.log("데이터가 저장되었습니다.");
        }
    }

    let btnDelete = document.querySelector("#btnDelete");
    btnDelete.addEventListener("click" , ()=>{
        db.close(); // 연결정보를 모두 닫음.
        let req = indexedDB.deleteDatabase(dbName);
        req.onsuccess=()=>{
            console.log("데이터베이스가 삭제되었습니다.");
            frm.reset();
        }
    })

})(document.frm)
