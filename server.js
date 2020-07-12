'use strict';
require('dotenv').config();

const express = require('express');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT;

// to link the public folder 
app.use(express.static('./public')); 

// somehow to be able to use post
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//to make the server look for views folder
app.set('view engine','ejs');

//inside views look for file index ??
app.get('/',(req,res)=>{
    res.render('index');
})

// for testing
app.get('/hello',(req,res)=>{
    res.render('index');
})






























app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
})