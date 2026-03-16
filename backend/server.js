const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/campuslog");

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
  time: String
});
const Entry = mongoose.model("Entry", entrySchema);


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

  await Entry.create(data);
  res.json({ success: true });
});


app.listen(5000, () => console.log("Server running on 5000"));

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