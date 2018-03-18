var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Render a specified template with passed arguments
  // This will render /views/index.pug
  res.render('index', { title: 'Express' });
});

module.exports = router;
