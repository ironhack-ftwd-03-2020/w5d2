const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');

router.get('/books', (req, res) => {
  // get all the books
  Book.find().then(books => {
    // render a 'books' view with the books data
    res.render('books', { booksList: books });
  })
  // res.send('this is the books route');
});

router.get('/books/add', (req, res) => {
  Author.find().then(authorsFromDB => {
    res.render('bookForm', { authors: authorsFromDB });
  }).catch(err => {
    next(err);
  });
  // res.render('bookForm');
});

router.get('/books/edit/:bookId', (req, res) => {
  Book.findById(req.params.bookId)
    .then(book => {
      res.render('bookEdit', { book: book });
    });
});

router.post('/books', (req, res) => {
  // const title = req.body.title;
  // const author = req.body.author;
  // const description = req.body.description;
  // const rating = req.body.rating;
  // use object destructuring
  const { title, author, description, rating } = req.body;
  Book.create({
    title: title,
    author: author,
    description: description,
    rating: rating
  }).then(book => {
    console.log(`Success ${book} was added to the database`);
    res.redirect(`/books/${book._id}`);
  }).catch(err => {
    console.log(err);
    // logs the error to the console
    next(err);
  });
});

router.get('/books/delete/:bookId', (req, res) => {
  Book.deleteOne({ _id: req.params.bookId })
    .then(() => {
      res.redirect('/books');
    })
    .catch(err => {
      next(err);
    });
});

router.get('/books/:bookId', (req, res) => {
  const bookId = req.params.bookId;
  Book.findById(bookId)
    .populate('author')
    .then(book => {
      console.log(book);
      // res.send(book);
      res.render('bookDetails', { book: book });
    });
});

router.post('/books/edit/:bookId', (req, res) => {
  const { title, author, description, rating } = req.body;

  Book.findByIdAndUpdate(req.params.bookId, {
    title: title,
    description: description,
    author: author,
    rating: rating
  }).then(book => {
    res.redirect(`/books/${book._id}`);
  }).catch(err => {
    next(err);
  })
});

router.post('/books/:bookId/reviews', (req, res) => {
  // const user = req.body.user;
  const { user, comments } = req.body;
  Book.update({ _id: req.params.bookId }, { $push: { reviews: { user: user, comments: comments } } })
    .then(book => {
      res.redirect('/books');
    })
    .catch(err => {
      console.log();
    })
});

module.exports = router;