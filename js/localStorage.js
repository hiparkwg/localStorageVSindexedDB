( (frm)=>{
    let data=[] // 폼의 값이 실시간으로 저장될 변수
    let id="a1234"; // 저장할 때 사용되는 키값
    load();
    frm.addEventListener("input", (ev)=>{
        store(frm);
    })
    function store(frm){
        let formData = new FormData(frm);
        let props;
        data = [];
        for( let[tagName, value] of formData.entries()){
            let tagType = frm.querySelector(`[name="${tagName}"]`).type;
            props = {
                'tagName' : tagName,
                'tagType' : tagType,
                'value'   : value
            }
            data.push(props);
        }
        localStorage.setItem(id, JSON.stringify(data));
    }

    // 새로고침하거나 다시 브라우저를 실행했을 때
    function load(){
        let choiceType = ["radio", "checkbox", "select"];
        let data = localStorage.getItem(id);
        if(data){
            let json = JSON.parse(data);
            json.forEach(d=>{
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

    // 저장소 삭제
    let btnDelete = document.querySelector("#btnDelete");
    btnDelete.addEventListener("click", ()=>{
        let yn = confirm("정말 삭제하시겠습니까? ");
        if(yn){
            localStorage.removeItem(id);
        }
    })

})(document.frm)
