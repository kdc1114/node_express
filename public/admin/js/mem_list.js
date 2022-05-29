//MEMBER_LIST db에서 받아온 내역

console.log("/public/admin/js/mem_list.js 파일 추가됨(defer 로 지정되어 화면이 다 로드되고 시작됨)");
const memList = document.getElementById("memList");
const memList_ex = document.querySelector(".ex");

MEMBER_LIST.forEach((item)=>{
    const ex = memList_ex.cloneNode(true);
    ex.className="";
    for(let key in item){
        const tr = ex.querySelector("."+key);
        tr.innerText = item[key];
        let value = item[key];
        if(key === "ID"){
            ex.querySelector(".delete").addEventListener("click",()=>{
                memDelete(value);
            });
        }
    };
    memList.append(ex);
});