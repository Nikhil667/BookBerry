const express = require('express');
const router = express.Router();

//const multer = require('multer')
// const path = require('path')
// const fs = require('fs') // file system

//import book from model
const Book = require('../models/book')
const Author = require('../models/author')

//const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// });

//All Book Route
router.get('/', async (req, res) => {
    //res.send("All books")
    //renderNewPage(res, new Book())
    let query = Book.find()
    if (req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    } 
    if (req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    } 
    if (req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    } 

    try {
        const books = await query.exec()
        res.render('books/index',{
            books: books,
            searchOptions: req.body
        })
    } catch {
        res.redirect('/')
    }
    
})

//New Book Route --> This is just for displaying purpose
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

//Create New Book Route
//upload.single('cover') 
router.post('/', async (req, res) => {
    //res.send("Create books")
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        pageCount: req.body.pageCount,
        publishDate: new Date(req.body.publishDate),
        //coverImageName: fileName
    })
    saveCover(book, req.body.cover)
    try {
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id})
        res.redirect('books')
    } catch {
        // if(book.coverImageName != null){
        //     removeBookCover(book.coverImageName)
        // }
        renderNewPage(res, book, true)
    }
})

// function removeBookCover(fileName){
//     fs.unlink(path.join(uploadPath, fileName), err => { 
//         if(err) console.error(err); 
//     })
// }

async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if(hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}

function saveCover(book, coverEncoded){
    if(coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

module.exports = router;