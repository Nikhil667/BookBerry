const express = require('express');

const router = express.Router();

//import author from model
const Author = require('../models/author')

//All Authors Route
router.get('/', async (req, res) => {
    //for search options
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    //res.render('authors/index')
    try {
        const allAuthors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors: allAuthors,
            searchOptions: req.query
        })
    } catch (error) {
        res.redirect('/')
    }
})

//New Author Route --> This is just for displaying purpose
router.get('/new', (req, res) => {
    //res.render('authors/new')
    res.render('authors/new', { author: new Author() })
})

//Create New Author Route
router.post('/', async (req, res) => {
    //res.send('New author Created')
    //res.send(req.body.name2)
    const author = new Author({
        name: req.body.name2
    })
    try {
        const newAuthor = await author.save();
        // res.redirect(`authors/${newAuthor.id})
        res.redirect('authors')
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        })
    }

    //This is callback, we will use async as mentioned above
    // author.save( (err, newAuthor) => {
    //     if(err){
    //         res.render('authors/new', {
    //             author: author,
    //             errorMessage: 'Error creating author'
    //         })
    //     }else{
    //         // res.redirect(`authors/${newAuthor.id})
    //         res.redirect('authors')
    //     }
    // })
})

module.exports = router;