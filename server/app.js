const express = require("express");
const cors = require("cors");
const db = require("./db.js");
const jwt = require("jsonwebtoken");
const secret = "0832c1202da8d382318e329a7c133ea0";
let app = express();

app.use(cors());
app.use(express.json());
app.post("/register", async(req, res) => {
    let body = req.body;
    console.log(body);
    await db.query(`Insert Into users(name, email, password_hash) Values ('${body.name}','${body.email}','${body.password}')`);
    res.send(body);
});
app.post("/login", async(req, res) => {
    let body = req.body;
    let query = await db.query(`Select * From users Where name = '${body.name}' AND password_hash = '${body.password}';`);
    if(query.rows.length !== 0){
        query = query.rows[0];
        let data = {
            id : query["id"],
            name : query["name"]
        }
        res.send({token: jwt.sign(data, secret)});
    }
    else{
        res.status(403).send();
    }
});

app.post("/sendAnswer", async(req, res) => {
    let body = req.body;
    let token = req.header('Authorization').split(' ')[1];

    try{
        let user = jwt.verify(token, secret);
        console.log(user);
        let query = await db.query(`Update participant Set answer = '{${Object.values(body)}}' Where part_id = '${user.id}' Returning *`);
        if(query.rows.length !== 0){
            query = query.rows[0];
            res.status(200).send();
        }
    }catch(e){
        console.log(e);
        res.status(403).send();
    }
});

app.post("/enterquiz", async(req, res) => {
    let body = req.body;

        let query = await db.query(`Insert Into participant(part_name, part_email) Values ('${body.part_name}','${body.part_email}') Returning *`);
        console.log(query);
        if(query.rows.length !== 0){
        
            query = query.rows[0];
            console.log(query)
            let data = {
                id : query["part_id"],
                name : query["part_name"]
            }
            res.send({token: jwt.sign(data, secret)});
        }else{
            res.status(403).send();
        }
});

app.get("/authorize", async(req, res) => {
    let body = req.body;
    let token = req.header('Authorization').split(' ')[1];

    try{
        let user = jwt.verify(token, secret);      
            res.status(200).send();
    }catch(e){
        res.status(403).send();
    }
});

app.get("/", async(req, res) => {
    let data = await db.query("Select * From users;")["rows"];
    console.log(data);
    res.send({
        message: "Hello"
    })
});
app.listen(3000);