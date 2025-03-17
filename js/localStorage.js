( (frm)=>{
    console.log("ready...")
    let data=[];
    let id="a1234";
    load();
    frm.addEventListener("input", (ev)=>{
        store(frm);
    })
  

    function store(frm){
        let formData = new FormData(frm);
        data = [];
        for( let[key, value] of formData.entries()){
            let tagType = frm.querySelector(`[name="${key}"]`).type;
            console.log(key, tagType, value)
            props = {
                'tagName' : key,
                'tagType' : tagType,
                'value'   : value
            }
            data.push(props)
            
        }
        console.table(data)
        localStorage.setItem(id, JSON.stringify(data))
    }

    //window.onbeforeunload = store(document.frm)
    function load(){
        let choiceType = ['radio','checkbox','select']
        let data = localStorage.getItem(id);
        console.log('onload', data);
        if(data){
            let json = JSON.parse(data);
            json.forEach(d =>{
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
        }
    }

    let btnDelete = document.querySelector("#btnDelete");
    btnDelete.addEventListener("click", ()=>{
        localStorage.removeItem(id)
    })    


})(document.frm)