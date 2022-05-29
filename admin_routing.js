const express=require("express");
const fs=require("fs");
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//app.use() = 미들웨어 : 요청이 먼저 검사를 실시하고 요청으로 보내는 것 [검문소]
app.use(express.static("public"))
//모든 정적리소스(css,img,js 등이 요청이 들어오면 public 폴더에서 찾아서 응답해준다/)

const mysql=require("mysql");
const con_info={
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mysql",
    database: "EXPRESS_SHOP"
}
app.get("/admin/",(req,res)=>{
    res.sendFile(__dirname+"/admin/index.html");
})
app.get("/admin/mem/list/:page",(req,res)=>{
    const conn=mysql.createConnection(con_info);
    conn.connect((e)=>{
        if(e)throw new Error(e.message);
        conn.query("SELECT * FROM MEMBER",(e,result)=>{
            fs.readFile("./public/admin/mem_list.html",(e,data)=>{
                if(e){console.log(e);};
                res.write(`
                        <script>
                            const MEMBER_LIST=${JSON.stringify(result)};
                            console.log(MEMBER_LIST)
                        </script>`);              
                res.write(data);
                conn.end((e)=>{});
                res.send();
            });
        });
    });
});

// /admin/product/list/:page 동적 리소스
// ./public/admin/product_list.html 정적 리소스
app.get("/admin/product/list/:page",async(req,res)=>{
    let sql = "SELECT * FROM PRODUCT";
    let conn = await mysqlConn();
    let result = queryResult(conn,sql);
    let data = fsData("./public/admin/product_list.html");
    result = await result;
    data = await data;
    res.write(`<script>
    const ITEM_LIST=${JSON.stringify(result)}; console.log(ITEM_LIST);
    </script>`);
    res.write(data);
    res.send();
    conn.end((e)=>{});
});
app.get("/admin/board/list/:page",async(req,res)=>{
    let sql = "SELECT * FROM BOARD";
    let conn = await mysqlConn();
    let result = queryResult(conn,sql);
    let data = fsData("./public/admin/board_list.html");
    result = await result;
    data = await data;
    res.write(data);
    res.write(`<script>
    const BOARD_LIST = ${JSON.stringify(result)}; console.log(BOARD_LIST);
    </script>`);
    console.log(result);
    res.send();
    conn.end((e)=>{});
});
app.get("/admin/mem/readid/:id",async(req,res)=>{
    let sql = "SELECT * FROM MEMBER WHERE ID=?";
    let conn = await mysqlConn();
    let result = queryResult(conn,sql,[req.params.id]);
    result = await result;
    res.send(result);
    conn.end((e)=>{console.log("ID읽기");});
});
app.get("/admin/mem/readphone/:phone",async(req,res)=>{
    let sql = "SELECT * FROM MEMBER WHERE PHONE=?";
    let conn = await mysqlConn();
    let result = queryResult(conn,sql,[req.params.phone]);
    result = await result;
    res.send(result);
    conn.end((e)=>{console.log("PHONE읽기");});
});
app.get("/admin/mem/reademail/:email",async(req,res)=>{
    let sql = "SELECT * FROM MEMBER WHERE EMAIL=?";
    let conn = await mysqlConn();
    let result = queryResult(conn,sql,[req.params.email]);
    result = await result;
    res.send(result);
    conn.end((e)=>{console.log("EAMIL읽기");});
});
app.post("/admin/mem/create/form",async(req,res)=>{
    let sql = "INSERT INTO MEMBER SET ?";
    let conn = await mysqlConn();
    let result = queryResult(conn,sql,[req.body]);
    result = await result;
    res.send(`<script>location.href = "/admin/mem/list/:page";</script>`);
    console.log(result);
    conn.end((e)=>{console.log("생성");});
});
app.delete("/admin/mem/delete/:id",async(req,res)=>{
    let sql = "DELETE FROM MEMBER WHERE ID=?";
    let conn = await mysqlConn();
    let result = queryResult(conn,sql,[req.params.id]);
    result = await result;
    res.send({msg:"삭제 성공 홈페이지 리셋"});
    conn.end((e)=>{console.log("삭제");});
});
// app.get("/admin/mem/readDetail/:id/form",async(req,res)=>{
//     let sql = "SELECT * FROM MEMBER";
//     let conn = await mysqlConn();
//     let result = await queryResult(conn,sql,[req.params.id]);
//     console.log(result);
//     res.send(result);
// })
app.listen(1234);
function fsData(path){
    return new Promise((resolve)=>{
        fs.readFile(path,(e,data)=>{
            if(e){console.log(e.message); data="<h1>404 파일없음</h1>"};
            resolve(data);
        });
    });
};
function mysqlConn(){
    return new Promise((resolve)=>{
        const conn = mysql.createConnection(con_info);
        conn.connect((e)=>{
            if(e){conn.end((e)=>{}); throw new Error("mysql 접속 에러 :"+e.message)};
            resolve(conn);
        });
    });
};
function queryResult(conn,sql,params=[]){
    return new Promise((resolve)=>{
        conn.query(sql,params,(e,result)=>{
            if(e){conn.end((e)=>{}); throw new Error("mysql 쿼리 에러 :"+e.message)};
            resolve(result);
        })
    })
}


