const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const path = require("path");

// static serve
app.use(express.static(path.resolve(__dirname, "../Frontend")));

// 🔹 MongoDB connect
mongoose.connect(process.env.MONGO_URI);

// 🔹 PC Schema
const pcSchema = new mongoose.Schema({
  pcCode: String,
  accountId: String
});
const PC = mongoose.model("PC", pcSchema);

// 🔹 ENTRY Schema
const entrySchema = new mongoose.Schema({
  name: String,
  enroll: String,
  branch: String,
  course: String,
  pc: String,
  pcCode: String,
  entryTime: Date,
  exitTime: Date
});

const Entry = mongoose.model("Entry", entrySchema);

app.get("/delete/:id", async (req, res) => {

  const time = req.params.time;

  await Entry.deleteOne({ time: time });

  res.json({ success: true });

});


// ✅ ADD PC API (admin panel)
app.post("/api/add-pc", async (req, res) => {
  const { pcCode, accountId } = req.body;

  if (!pcCode) return res.json({ success: false });

  await PC.create({ pcCode, accountId });
  res.json({ success: true });
});


// ✅ ENTRY API (PC se data)
app.post("/api/entry", async (req, res) => {

  const data = req.body;

  const pc = await PC.findOne({ pcCode: data.pcCode });
  if (!pc) return res.json({ success: false, msg: "PC not registered" });

  // check student already inside
  const activeStudent = await Entry.findOne({
    enroll: data.enrollment,
    exitTime: null
  });

  if (activeStudent) {
    return res.json({
      success: false,
      msg: "Student already inside lab"
    });
  }

  // check pc busy
  const pcBusy = await Entry.findOne({
    pcCode: data.pcCode,
    exitTime: null
  });

  if (pcBusy) {
    return res.json({
      success: false,
      msg: "This PC already in use"
    });
  }

  await Entry.create({
    name: data.name,
    enroll: data.enrollment,
    branch: data.branch,
    course: data.course,
    pc: data.pc,
    pcCode: data.pcCode,
    entryTime: new Date(),
    exitTime: null
  });

  res.json({ success: true });

});

app.post("/api/exit", async (req, res) => {

  const { pcCode } = req.body;

  const active = await Entry.findOne({
    pcCode: pcCode,
    exitTime: null
  });

  if (!active) {
    return res.json({ success: false });
  }

  active.exitTime = new Date();
  await active.save();

  res.json({ success: true });

});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));

// ✅ SIGNUP
app.post("/signup", async (req, res) => {
  const { user, pass, name } = req.body;

  if (!user || !pass) return res.json({ status: "fail" });

  res.json({ status: "ok" }); // abhi simple rakha
});

// ✅ LOGIN
app.post("/login", async (req, res) => {
  const { user, pass } = req.body;

  if (!user || !pass) return res.json({ status: "fail" });

  res.json({ status: "ok", name: user });
});

// ✅ GET PCs
app.get("/api/pcs", async (req, res) => {
  const pcs = await PC.find();
  res.json(pcs);
});

// ✅ GET Entries
app.get("/api/entries", async (req, res) => {
  const entries = await Entry.find().sort({ entryTime: -1 })
  res.json(entries);
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../Frontend/login.html"));
});

app.post("/api/delete-pc", async (req,res)=>{
  const { codes } = req.body;

  await PC.deleteMany({ pcCode: { $in: codes } });

  res.json({ success:true });
});