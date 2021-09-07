var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');

router.get('/', (request, response) => {
 
    var title = 'Welcome';
    var description = 'Hello, Charlie';
    var list = template.list(request.list);
    var html = template.HTML(title, list
        , `<h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:300px; display:block; margin:10px"></img>`
        , `<a href="/topic/create">create</a>`);
    response.send(html);
});

module.exports = router;