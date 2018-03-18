const mongoose = require("mongoose");

// Define a schema
var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
  name: String,
  a_date: Date,
  an_array: [],
  _an_other_id: Schema.Types.ObjectId,
  age: { type: Number, min: 18, max: 64, required: true }
});

var BreakfastSchema = new Schema({
  eggs: {
    type: Number,
    min: [6, "Too few eggs"],
    max: 12,
    required: [true, "Why no eggs?"]
  },
  drink: {
    type: String,
    enum: ["Coffee", "Tea", "Water"]
  }
});

// Compile model from schema
// 1st arg - collection name +s at the end (somemodels), 2nd arg - actual schema
var SomeModel = mongoose.model("SomeModel", SomeModelSchema);

const connectionString = "mongodb://localhost:27017/playground";

mongoose.connect(connectionString);

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on("error", err => {
  console.log(`MongoDB connection error: ${err}`);
});

// Create an instance of model SomeModel
var awesome_instance = new SomeModel({ name: "awesome", age: 19 });

// Save the new model instance, passing a callback
awesome_instance.save(err => {
  if (err) {
    return console.log("Could not save model: " + err);
  } else {
    return console.log("Model saved successfully!");
  }
});

awesome_instance.name = "New cool name";
awesome_instance.save();

// Search for records
SomeModel.find({ name: "New cool name" }, "age _id", (err, instances) => {
  if (err) {
    return console.log("Could not find: " + err);
  }
  console.log("Found: " + instances);
});

// Or construct a query without passing callback:
var query = SomeModel.find({ name: "New cool name" });
query.select("age _id");
query.limit(5);
query.sort({ age: -1 });
// Execute query at a later time
query.exec((err, instances) => {
  if (err) {
    return console.log("Could not find (query): " + err);
  }
  console.log("Found (query): " + instances);
});
// You can also specify conditions in a where() clause:
var query2 = SomeModel.find()
  .where("name")
  .equals("New cool name")
  .where("age")
  .gt(18)
  .lt(30)
  .limit(5)
  .sort({ age: -1 })
  .select("name _id")
  .exec(callback);
function callback(err, result) {
  if (err) {
    return console.log("Could not find (callback): " + err);
  }
  console.log("Found (callback): " + result);
}

/*
The find() method gets all matching records, but often you just want to get one match. The following methods query for a single record:

findById(): Finds the document with the specified id (every document has a unique id).

findOne(): Finds a single document that matches the specified criteria.

findByIdAndRemove(), findByIdAndUpdate(), findOneAndRemove(), findOneAndUpdate(): 
    Finds a single document by id or criteria and either update or remove it. These are useful convenience functions 
    for updating and removing records.

count(): get count without actually fetching the results
*/

/*
Models are defined using the Schema interface. 
The Schema allows you to define the fields stored in each document along with their validation requirements and default values. 
In addition, you can define static and instance helper methods to make it easier to work with your data types, 
and also virtual properties that you can use like any other field, but which aren't actually stored in the database 
(we'll discuss a bit further below).

Schemas are then "compiled" into models using the mongoose.model() method. Once you have a model you can use it to find, 
create, update, and delete objects of the given type.
*/
