const express = require("express");
const cors = require("cors");
const db = require("./db.js");
const jwt = require("jsonwebtoken");
const secret = "0832c1202da8d382318e329a7c133ea0";
let app = express();
const { body, validationResult } = require('express-validator');
const { Query } = require("pg");

app.use(cors());
app.use(express.json());
/*app.post("/register", async(req, res) => {
    let body = req.body;
    console.log(body);
    await db.query(`Insert Into users(name, email, password_hash) Values ('${body.name}','${body.email}','${body.password}')`);
    res.send(body);
});*/


  app.post(
    '/register',  
    body('email').isEmail(),
    body('password').isLength({ min: 7 }),
    async(req, res) => {
       let body = req.body;
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      let query1 = await db.query(`Select name From users Where name = '${body.name}';`);
      let query2 = await db.query(`Select email From users Where name = '${body.email}';`);
    
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }else if(query1.rowCount > 0){
        return res.status(400).json({ errors: "name already in use" });
      }else if(query2.rowCount > 0){
        return res.status(400).json({ errors: "email already in use" });
      }
      else{
        await db.query(`Insert Into users(name, email, password_hash) Values ('${body.name}','${body.email}','${body.password}')`);
        res.status(200).send();
      }
    });


app.post("/login", async(req, res) => {
    let body = req.body;
    let query = await db.query(`Select * From users Where name = '${body.name}' AND password_hash = '${body.password}';`);
    if(query.rows.length !== 0){
        query = query.rows[0];
        let data = {
            user_id : query["user_id"],
            name : query["name"]
        }
        res.send({token: jwt.sign(data, secret)});
    }
    else{
        res.status(403).send();
    }
});

app.post("/sendanswer", async(req, res) => {
    let body = req.body;
    let token = req.header('Authorization').split(' ')[1];

    try{
        let user = jwt.verify(token, secret);
        console.log(user);
        let query = await db.query(`Update participant Set answer = '{${Object.values(body)}}' Where part_id = '${user.part_id}' Returning *`);
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
                part_id : query["part_id"],
                part_name : query["part_name"]
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

app.post("/creategroup", async(req, res) => {
    let body = req.body;
    let token = req.header('Authorization').split(' ')[1];
    console.log(token);
    try{
        let user = jwt.verify(token, secret);
        console.log(user);
        let query = await db.query(`Insert Into group_instance(group_name, user_id) Values ('${body.group_name}','${user.user_id}') Returning *`);
        if(query.rows.length !== 0){
            query = query.rows[0];
            res.status(200).send();
        }
    }catch(e){
        console.log(e);
        res.status(403).send();
    }
});

app.get("/listgroup", async(req, res) => {
    let token = req.header('Authorization').split(' ')[1];

    try{
        let user = jwt.verify(token, secret);
        let query = await db.query(`Select * From group_instance Where group_instance.user_id = '${user.user_id}'`);
        console.log(query);
        res.status(200).send(query.rows);
    }catch(e){
        console.log(e);
        res.status(403).send();
    }
});