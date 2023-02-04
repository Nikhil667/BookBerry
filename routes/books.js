const express = require('express');
const router = express.Router();

//import book from model
const Book = require('../models/book')

//All Book Route
router.get('/', async (req, res) => {
    res.send("All books")
})

//New Book Route --> This is just for displaying purpose
router.get('/new', (req, res) => {
    res.send("New books")
})

//Create New Book Route 
router.post('/', async (req, res) => {
    res.send("Create books")
})

module.exports = router;