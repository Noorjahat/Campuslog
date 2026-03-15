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
