const ADMIN_FILE = "admins.json";

if(!fs.existsSync(ADMIN_FILE)){
fs.writeFileSync(ADMIN_FILE,"[]");
}
const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const FILE="data.json";

app.get("/entries",(req,res)=>{
let data=JSON.parse(fs.readFileSync(FILE));
res.json(data);
});

app.post("/add",(req,res)=>{
let data=JSON.parse(fs.readFileSync(FILE));
data.push(req.body);
fs.writeFileSync(FILE,JSON.stringify(data));
res.send("ok");
});

app.get("/delete/:id",(req,res)=>{
let data=JSON.parse(fs.readFileSync(FILE));
data=data.filter(e=>e.time!=req.params.id);
fs.writeFileSync(FILE,JSON.stringify(data));
res.send("deleted");
});

app.listen(process.env.PORT || 10000, () => {
  console.log("Server running");
});

// signup
app.post("/signup",(req,res)=>{
let admins=JSON.parse(fs.readFileSync(ADMIN_FILE));

if(admins.find(a=>a.user===req.body.user)){
return res.json({status:"exists"});
}

admins.push(req.body);
fs.writeFileSync(ADMIN_FILE,JSON.stringify(admins));

res.json({status:"ok"});
});

// login
app.post("/login",(req,res)=>{
let admins=JSON.parse(fs.readFileSync(ADMIN_FILE));

let found=admins.find(a=>
a.user===req.body.user &&
a.pass===req.body.pass
);

if(found) res.json({status:"ok",name:found.name});
else res.json({status:"fail"});
});
