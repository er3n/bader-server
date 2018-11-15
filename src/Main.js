var express = require('express')
var getImages = require('./getImages.js')

var app = express()
const port = 3000

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/image-list', function (req, res) {
    getImages(req.query.folder).then(result => res.json(result))
})

app.listen(port, () => console.log(`App listening on port ${port}!`))