// ITEM_LIST = db 에서 받아온 내역
const productList = document.getElementById("productList");
const productList_ex = document.querySelector(".ex");

ITEM_LIST.forEach((item)=>{
    const tr = productList_ex.cloneNode(true);
    tr.className="";
    for(let key in item){
        if(key === "DETAIL_IMG" || key === "MAIN_IMG"){
            const img = tr.querySelector("."+[key]);
            img.src = "/admin/img/"+item[key];
        }else{
            const td = tr.querySelector("."+[key]);
            td.innerText = item[key];
        };
    };
    productList.append(tr);
});