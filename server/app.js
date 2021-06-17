const express = require("express");
const cors = require("cors");
const db = require("./db.js");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
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


  app.post('/register',
    body('name').trim(),  
    body('email').isEmail().trim().normalizeEmail(),
    body('password').trim().isLength({ min: 7 }),
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
        await db.query(`Insert Into users(name, email, password_hash) Values ('${body.name}','${body.email}','${md5(body.password)}')`);
        res.status(200).send();
      }
    });


app.post("/login", async(req, res) => {
    let body = req.body;
    let query = await db.query(`Select * From users Where name = '${body.name}' AND password_hash = '${md5(body.password)}';`);
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
    console.log(body);
        let query = await db.query(`Insert Into participant(activity_id, part_name, part_email) Values ('${body.activity_id}', '${body.part_name}','${body.part_email}') Returning *`);
        
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
            res.status(200).send(query);
        }
    }catch(e){
        console.log(e);
        res.status(403).send();
    }
});

app.post("/createactivity", async(req, res) => {
    let body = req.body;
    let token = req.header('Authorization').split(' ')[1];
    console.log(token);
    try{
        let user = jwt.verify(token, secret);
        console.log(user);
        let query = await db.query(`Insert Into activity_instance(activity_name, group_id,  incognito, roomkey) Values ('${body.activity_name}', '${body.group_id}','${body.incognito}', '${body.roomkey}') Returning *`);
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
        let query = await db.query(`Select group_id, group_name From group_instance Where group_instance.user_id = '${user.user_id}'`);
        console.log(query);
        res.status(200).send(query.rows);
    }catch(e){
        console.log(e);
        res.status(403).send();
    }
});

app.post("/deleteroomkey", async(req, res) => {
    let body = req.body;
    let token = req.header('Authorization').split(' ')[1];
    console.log(token);
    try{
        let user = jwt.verify(token, secret);
        let query = await db.query(`Update activity_instance Set roomkey = '' Where roomkey = '${body.roomkey}' Returning *`);        
        res.status(200).send();
    }catch(e){
        console.log(e);
        res.status(403).send();
    }
});

app.post("/getroomkey", async(req, res) => {
    let body = req.body;   
    
    let query = await db.query(`Select activity_id From activity_instance Where activity_instance.roomkey = '${body.roomkey}'`);
    
    if(query.rows.length !== 0){
        query = query.rows[0];
        res.status(200).send(query);
    }else {
        res.status(404).send();
    }
    
});

app.post("/getactivities", async(req, res) => {
    let body = req.body;
   // let token = req.header('Authorization').split(' ')[1];
        let query = await db.query(`Select activity_instance.activity_name, activity_instance.activity_id, participant.answer From group_instance 
        Join activity_instance On group_instance.group_id=activity_instance.group_id 
        Join participant On activity_instance.activity_id=participant.activity_id Where group_instance.group_id = '${body.group_id}';`);      

        res.status(200).send(query);   
    
});

app.post("/getparticipants", async(req, res) => {
    let body = req.body;
   // let token = req.header('Authorization').split(' ')[1];
        let query = await db.query(`Select part_id, part_name, answer From participant Where activity_id = '${body.activity_id}';`);        
        res.status(200).send(query);   
    
});

app.post("/getparticipantactivities", async(req, res) => {
    let body = req.body;
   // let token = req.header('Authorization').split(' ')[1];
        let queryEmail = await db.query(`Select part_email From participant Where part_id = '${body.part_id}';`);
        console.log(queryEmail);
        let query = await db.query(`Select activity_instance.activity_id, activity_instance.activity_name, participant.answer From participant 
        Join activity_instance On participant.activity_id=activity_instance.activity_id Where participant.part_email = '${queryEmail.rows[0].part_email}';`);

        res.status(200).send(query);      
});

app.post("/listactivities", async(req, res) => { 
        
        let body = req.body;
        let query = await db.query(`Select activity_id, activity_name From activity_instance Where group_id = '${body.group_id}'`);
        console.log(query);
        res.status(200).send(query.rows);  
});

app.post("/listparticipants", async(req, res) => { 
        
    let body = req.body;
    let query = await db.query(`Select part_id, part_name From participant Where activity_id = '${body.activity_id}'`);
    console.log(query);
    res.status(200).send(query.rows);  
});

app.post("/getcomparisondata", async(req, res) => {
    const {body} = req;
    let query;
    switch(Object.keys(body).length) {
        case 0:
            res.status(404).send();
            break;

        case 1:
            console.log("TEST 1");
            query = await db.query(`Select group_instance.group_id, group_name, answer From participant 
            Join activity_instance On participant.activity_id = activity_instance.activity_id 
            Join group_instance On activity_instance.group_id=group_instance.group_id 
            Where group_instance.group_id = '${body.group_id}'`);
            break;
        case 2:
            console.log("TEST 2");
            query = await db.query(`Select activity_instance.group_id, activity_name, answer From participant 
            Join activity_instance On participant.activity_id = activity_instance.activity_id Where activity_instance.activity_id = '${body.activity_id}'`);
            break;
        case 3:
            console.log("TEST 3");
            query = await db.query(`Select part_id, part_name, answer From participant Where part_id = '${body.part_id}'`);
            break;
        }
        console.log(query.rows);
    res.status(200).send(query);   
    
});