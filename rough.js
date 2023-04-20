const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const exp = require("constants");
const date = require("./date");
const mongoose = require("mongoose");

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/toDoListDB");

const itemLists = new mongoose.Schema({
    value: String
});

const workLists = new mongoose.Schema({
    value: String,
});

const itemList = mongoose.model("itemList",itemLists);
const workList = mongoose.model("workList",workLists);




