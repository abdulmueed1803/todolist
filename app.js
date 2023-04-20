const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const exp = require("constants");
const date = require("./date");
const mongoose = require("mongoose");
const _ = require('lodash');

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/toDoListDB");

const itemLists = new mongoose.Schema({
    value: String,
});

const itemList = mongoose.model("itemList",itemLists);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/",function(req,res){
    let listTitle = "Today";

    //querying and displaying results on the website
    itemList.find({})
    .then(function(itemLists){
        res.render('index',{
            listTitle: listTitle,
            items: itemLists
        });
    }) 
    .catch(function(err){
        console.log(err);
    });

});


const item1 = new itemList({
    value: "This is a custom list"
});

const item2 = new itemList({
    value: "This list uses express routing parameters"
});

let defaultItems = [item1,item2];

const ListSchema = new mongoose.Schema({
    name: String, 
    items: [itemLists]
});


const List = mongoose.model("List",ListSchema);

//express route parameter

app.get("/:parameter", (req,res)=>{
    const listTitle = _.capitalize(req.params.parameter);
    
    
    List.findOne({name: listTitle})
    .then(function(result){
        if(!result){
            const list = new List({
                name: listTitle,
                items: defaultItems
            });
            list.save();
            res.redirect("/"+listTitle);
        } 

        else{
            res.render("index",{
                listTitle: result.name,
                items: result.items,
            })
        }
    })
    .catch(function(err){
        console.log(err);
    })

    
    
});


app.post("/", function(req,res){
    let toDoListItem = req.body.item ;
    let documentName = req.body.title ;

    //creating a new item
    const newItem = new itemList({
        value: toDoListItem
    });

    if( documentName === "Today"){
        
        newItem.save();
        res.redirect("/"); 
    }
    else{
        List.findOne({name:documentName})
        .then(function(result){
            result.items.push(newItem);
            result.save();
            res.redirect("/"+documentName);
        });

    }
      
});

app.post("/delete",function(req,res){
    //getting the list name and id of the item to delete 
    const listName = req.body.listTitle;
    const toDeleteItemId = req.body.checkbox ;
    console.log("id: " + toDeleteItemId);
    if(listName === "Today"){
        itemList.findByIdAndDelete(toDeleteItemId)
        .then(function(rem_items){
            res.redirect("/");
        })
        .catch(function(err){
            console.log(err);
        });
    } else{
        // Find the document you want to update
        List.findOneAndUpdate(
        { name: listName}, // Filter to find the document
        { $pull: { items: { _id: toDeleteItemId  } } }, // Use $pull to delete the element
        { new: true } // Set the `new` option to true to return the updated document
        )
        .then(updatedList => {
            // Handle success
            res.redirect("/"+req.body.listTitle);
        })
        .catch(error => {
            // Handle error
            console.error('Error deleting element from items array:', error);
        });


    }
    
    
});


app.listen(3000,function(){
    console.log("server started on port 3000");
});



