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

app.get("/", async(req, res) => {
    let data = await db.query("Select * From users;")["rows"];
    console.log(data);
    res.send({
        message: "Hello"
    })
});
app.listen(3000);