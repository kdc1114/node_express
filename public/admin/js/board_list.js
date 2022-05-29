// BOARD_LIST = db 에서 받아온 내역
const boardList = document.getElementById("boardList");
const boardList_ex = document.querySelector(".ex");

BOARD_LIST.forEach((item)=>{
    const ex = boardList_ex.cloneNode(true);
    ex.className="";
    for(let key in item){
        const tr = ex.querySelector("."+key);
        tr.innerText = item[key];
    };
    boardList.append(ex);
});