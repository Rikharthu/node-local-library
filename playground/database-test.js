const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var authorSchema = Schema({
  name: String,
  stories: [{ type: Schema.Types.ObjectId, ref: "Story" }]
});

var storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: "Author" },
  title: String
});

var Story = mongoose.model("Story", storySchema);
var Author = mongoose.model("Author", authorSchema);

const connectionString = "mongodb://localhost:27017/playground";

mongoose.connect(connectionString);

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on("error", err => {
  console.log(`MongoDB connection error: ${err}`);
});

var bob = new Author({ name: "Bob Smith" });

bob.save(err => {
  if (err) return handleError(err);
  console.log("Bob now exists");

  // Bob now exists, lets create a story
  var story = new Story({
    title: "Bob goes sledding",
    author: bob._id // Assign the _id from the author Bob. This ID is created by default!
  });

  story.save(err => {
    if (err) return handleError(err);
    // Bob now has his story
    console.log("Bob now has his story");
  });
});

// What if we want to get all the stories written by the given author?
/*
One way would be to add our author to the stories array, but this would result in us having two places where 
the information relating authors and stories needs to be maintained.

A better way is to get the _id of our author, then use find() to search for this in the author field across all stories.
*/
Story.find({ author: bob._id }).exec((err, stories) => {
  if (err) return handleError(err);
  console.log(`Bob\'s stories: ${stories}`);
});

Story.findOne({ title: "Bob goes sledding" })
  .populate("author") //This populates the author id with actual author information!
  .exec((err, story) => {
    if (err) return handleError(err);
    console.log(`The author is ${story.author.name}`);
    console.log(`The story object is ${story}`);
  });

function handleError(err) {
  console.log("Error occurred: " + err);
}
