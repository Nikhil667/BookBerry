const { response } = require('express');
const express = require('express');

const router = express.Router();

//import author from model
const Author = require('../models/author')
const Book = require('../models/book')

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
        res.redirect(`authors/${newAuthor.id}`)
        //res.redirect('authors')
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
    //         // res.redirect(authors/$//{newAuthor.id})
    //         res.redirect('authors')
    //     }
    // })
})

router.get('/:id', async(req, res) => {
    //res.send('Show Author' + req.params.id)
    try {
        const author = await Author.findById(req.params.id)
        //let book = book.find().sort({createAt: 'disc'}).limit(10).exec();
        //book = book.reverse();
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.render('authors/show', {
            author: author,
            bookByAuthor: books
        })
    } catch {   
        res.redirect('/')
    }
})

router.get('/:id/edit',async (req, res) => {
    //res.send('Edit Author' + req.params.id)
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author})
    } catch {
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => {
    //res.send('Update Author' + req.params.id)
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name2
        await author.save()
        res.redirect(`/authors/${author.id}`)
        //res.redirect('authors')
    } catch {
        if(author == null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating author'
            })
        }      
    }
})
router.delete('/:id',async (req, res) => {
    //res.send('Delete Author' + req.params.id)
    let author
    try {
        author = await Author.findById(req.params.id)
        // await author.remove()
        const response = await Author.deleteOne({_id: req.params.id})
        res.redirect('/authors')
    } catch {
        if(author == null) {
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }      
})


module.exports = router;