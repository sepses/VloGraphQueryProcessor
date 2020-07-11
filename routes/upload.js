var express = require('express');
var router = express.Router();
var url = require('url');
var Request = require("request");
var multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  const upload = multer({storage: storage})


/* GET users listing. */
router.post('/', upload.single('statement'), function(req, res, next) { 
    console.log(`new upload = ${req.file.filename}\n`);
    console.log(req.file);
    res.json({ msg: 'Upload Works' });
 });

module.exports = router;