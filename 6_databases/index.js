'use strict'

var express = require("express");
var app = express();
var Book = require("../models/book"); // use database model

// configure Express app
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/../public'));
app.use(require("body-parser").urlencoded({extended: true}));

// set template engine
let handlebars =  require("express-handlebars");
app.engine(".html", handlebars({extname: '.html', defaultLayout: 'main' }));
app.set("view engine", ".html");

app.get('/', (req,res) => {
    Book.find((err,books) => {
        if (err) return next(err);
        res.render('home', {books: books });    
    })
});

app.get('/about', (req,res) => {
    res.type('text/html');
    res.render('about');
});

app.get('/get', (req,res) => {
    Book.findOne({ title:req.query.title }, (err, book) => {
        if (err) return next(err);
        res.type('text/html');
        res.render('details', {result: book} ); 
    });
});

app.post('/get', (req,res) => {
    Book.findOne({ title:req.body.title }, (err, book) => {
        if (err) return next(err);
        res.type('text/html');
        res.render('details', {result: book} ); 
    });
});

app.get('/delete', (req,res) => {
    Book.remove({ title:req.query.title }, (err, result) => {
        if (err) return next(err);
        let deleted = result.result.n !== 0; // n will be 0 if no docs deleted
        Book.count((err, total) => {
            res.type('text/html');
            res.render('delete', {title: req.query.title, deleted: result.result.n !== 0, total: total } );    
        });
    });
});

app.use((req,res) => {
    res.type('text/plain'); 
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
    console.log('Express started');    
});