const async = require("async");

// The method async.parallel() is used to run multiple asynchronous operations in parallel.
// First argument - collection of async function to run (array/object/iterable)
// Each function is passed a callback(err,result) which it must call on completion with an error err (or null) and
// an optional results value
// Optional second argument - callback that will be run when all the functions have completed (or when first function fails)
async.parallel(
  {
    one: callback => {
      console.log("Executing 'one'");
      callback(null, 1);
    },
    two: callback => {
      console.log("Executing 'two'");
      callback(null, 2);
    },
    three: callback => {
      console.log("Executing 'three'");
      callback(null, 3);
    },
    four: callback => {
      console.log("Executing 'four'");
      callback("Could not execute 'four'");
    },
    five: callback => {
      // This won't execute, because 'four' will fail before, thus stopping execution
      // though order is not guaranteed
      console.log("Executing 'five'");
      callback(null, 5);
    }
  },
  (err, results) => {
    console.log(
      `Parallel tasks finished, err: ${err}, results: ${JSON.stringify(
        results
      )}`
    );
  }
);

// If the order is important then use 'series'
async.series(
  {
    one: callback => {
      console.log("Executing 'one'");
      callback(null, 1);
    },
    two: callback => {
      console.log("Executing 'two'");
      callback(null, 2);
    },
    three: callback => {
      console.log("Executing 'three'");
      callback(null, 3);
    },
    four: callback => {
      console.log("Executing 'four'");
      callback("Could not execute 'four'");
    },
    five: callback => {
      // This won't execute, because 'four' will fail before, thus stopping execution
      // though order is not guaranteed
      console.log("Executing 'five'");
      callback(null, 5);
    }
  },
  (err, results) => {
    console.log(
      `Parallel tasks finished, err: ${err}, results: ${JSON.stringify(
        results
      )}`
    );
  }
);

// The method async.waterfall() is used to run multiple asynchronous operations
// in sequence when each operation is dependent on the result of the previous operation.
async.waterfall(
  [
    function(callback) {
      callback(null, "one", "two");
    },
    function(arg1, arg2, callback) {
      // arg1 now equals 'one' and arg2 now equals 'two'
      callback(null, "three");
    },
    function(arg1, callback) {
      // arg1 now equals 'three'
      callback(null, "done");
    }
  ],
  function(err, result) {
    // result now equals 'done'
    console.log(
      "Waterfall finished, error: " +
        err +
        ", result: " +
        JSON.stringify(result)
    );
  }
);
