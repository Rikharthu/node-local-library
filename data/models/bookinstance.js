const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

/**
 * Represents a specific copy of a book that someone might borrw, and includes information
 * about whether the copy is available or on what date it is expected back, "imprint" of version details
 */
const BookInstanceSchema = new Schema({
  book: { type: Schema.ObjectId, ref: "Book", required: true }, //reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance"
  },
  due_back: { type: Date, default: Date.now }
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual("url").get(function() {
  return "/catalog/bookinstance/" + this._id;
});

BookInstanceSchema.virtual("due_back_formatted").get(() => {
  return moment(this.due_back).format("MMMM Do, YYYY");
});

//Export model
module.exports = mongoose.model("BookInstance", BookInstanceSchema);
