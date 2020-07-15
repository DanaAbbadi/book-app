'use strict';
require('dotenv').config();

const express = require('express');
const superagent = require('superagent');
const { request } = require('express');
const app = express();
const PORT = process.env.PORT;
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// to link the public folder 
app.use(express.static('./public')); 

// somehow to be able to use post
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//to make the server look for views folder
app.set('view engine','ejs');

//inside views look for file index ??
app.get('/', getfavBooks);
app.post('/books', addToFavBooks);
app.get('/books/:book_id', viewBookDetails);
app.put('/books/:book_ID', updateBook);
app.delete('/books/:book_delete_ID', deleteBook);



    


function getfavBooks(req,res){
    let SQL = 'SELECT * FROM books';
    client.query(SQL)
    .then(result =>{
        res.render('pages/index',{results:result.rows});

    })
}


app.get('/searches/new',(req,res)=>{
    res.render('pages/searches/new');
})

app.get('/searches/show',(req,res)=>{
    res.render('pages/searches/show');
    // let family =['Atallah','Ali','Zaid','Noor','Eman'];
    // res.render('pages/searches/show',{familyData: family});

})



app.post('/searches',(req,res)=>{
    console.log(req.body.search);
    let property='';

    let BOOK_API= process.env.BOOK_API;
    if(req.body.searchby==='title'){property=`intitle:${req.body.search}`;}
    if(req.body.searchby==='author'){property= `inauthor:${req.body.search}`;}
    // else property= req.body.search;
    // if(req.body.title && req.body.author){property=  `intitle : ${req.body.title}`}
    let url =`https://www.googleapis.com/books/v1/volumes?q=20%+${property}`;
    let allBooks;

    superagent.get(url)
    .then(bookData => {
        let arr = bookData.body.items;
        allBooks = arr.map(books => {
            let newBook = new Book(books);
            return newBook;
        })
        allBooks.splice(10);
        // res.send(allBooks);
        res.render('pages/searches/show',{booksData: allBooks});
        // res.redirect('/searches/show');
        return allBooks;

    })

})

function addToFavBooks(req,res){

    let SQL='INSERT INTO books (image, title, authors, description, bookshelf)VALUES ($1,$2,$3,$4,$5)';
    let value= [req.body.imageurl, req.body.title, req.body.author , req.body.desc , req.body.shelf];
    client.query(SQL,value)
    .then(results => {
        res.redirect('/');
    })

}

function viewBookDetails(req,res){
    let bookID = req.params.book_id;
    let SQL = 'SELECT * FROM books WHERE id = $1';
    let value = [bookID];
    client.query(SQL,value)
    .then(results =>{
        res.render('pages/books/details',{results:results.rows[0]});
    })

}

function updateBook(req,res){
    let {image,title,author,description,bookshelf} = req.body;
    console.log(bookshelf);
    let id = req.params.book_ID;
    let SQL = 'UPDATE books SET image=$1, title=$2, authors=$3, description=$4, bookshelf=$5 WHERE id=$6;';
    let value = [image,title,author,description,bookshelf,id];
    client.query(SQL,value)
    .then(()=>{
        let SQL2 = 'SELECT * FROM books WHERE id = $1';
        let value = [id];
        client.query(SQL2,value)
        .then(results =>{
            console.log(results.rows);
            res.render('pages/books/details',{results:results.rows[0]});
        })
    })
}

function deleteBook(req,res){
    let id = req.params.book_ID;
    let SQL = 'DELETE FROM books WHERE id=$1;';
    let value = [req.params.book_delete_ID];
    client.query(SQL,value)
    .then(()=>{
            res.redirect('/');
        })
    }




function Book(data){
    this.title = data.volumeInfo.title;
    this.image = (data.volumeInfo.imageLinks)?data.volumeInfo.imageLinks.thumbnail : '';
    this.authors = data.volumeInfo.authors;
    this.desc = data.volumeInfo.description; 
}


app.get('*', notFound);

app.use(errors);

function notFound(req, res) {
    res.status(404).send('Not Found');
}
function errors(error, req, res) {
    res.status(500).send(error);
}

client.connect()
    .then(() => {
app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
})
})