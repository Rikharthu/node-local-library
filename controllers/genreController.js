const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

var Genre = require("../data/models/genre");
var Book = require("../data/models/book");
var async = require("async");

// Display list of all Genre.
exports.genre_list = function(req, res, next) {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec((err, list_genres) => {
      if (err) {
        return next(err);
      }
      res.render("genre_list", {
        title: "Genre list",
        genre_list: list_genres
      });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
  var id = mongoose.Types.ObjectId(req.params.id);
  async.parallel(
    {
      genre: function(callback) {
        Genre.findById(id).exec(callback);
      },

      genre_books: function(callback) {
        Book.find({ genre: id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // No results.
        var err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("genre_detail", {
        title: "Genre Detail",
        genre: results.genre,
        genre_books: results.genre_books
      });
    }
  );
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
// This is array of middleware functions, called in order
exports.genre_create_post = [
  // Validate that the name field is not empty
  body("name", "Genre name required")
    .isLength({ min: 1 })
    .trim(), // P.S. sanitizers during validation do not modify request data (thats why we call trim() twice)
  // Sanitize (trim and escape) the name field.
  sanitizeBody("name")
    .trim()
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);
    // Create a genre object with escaped and trimmed data
    let genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      return res.render("genre_form", {
        title: "Create genre",
        genre: genre,
        errors: errors.array()
      });
    }

    // Data from form is valid.
    // Check if Genre with same name already exists
    Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
      if (err) {
        return next(err);
      }

      if (found_genre) {
        // Genre exists, redirect to its detail page.
        return res.redirect(found_genre.url);
      }

      // Save the genre
      genre.save(err => {
        if (err) {
          return next(err);
        }
        // Genre saved. Redirect to genre detail page
        res.redirect(genre.url);
      });
    });
  }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
  res.send("NOT IMPLEMENTED: Genre update POST");
};
