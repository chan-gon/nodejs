// var http = require('http');
// var fs = require('fs');
// var url = require('url');
// var qs = require('querystring');
// var template = require('./lib/template.js');
// var path = require('path');
// var sanitizeHtml = require('sanitize-html');

// var app = http.createServer(function(request,response){
//     var _url = request.url;
//     var queryData = url.parse(_url, true).query;
//     var pathName = url.parse(_url, true).pathname;

//     if(pathName === '/'){ //메인 페이지
//       if(queryData.id === undefined){

//         fs.readdir('./data', function(err, filelist){
//           var title = 'Welcome';
//           var description = 'Hello, Charlie';

//             var list = template.list(filelist);
//             var html = template.html(title, list
//               , `<h2>${title}</h2>${description}`
//               , `<a href="/create">create</a>`);
//             response.writeHead(200);
//             response.end(html);
//         });
//       }
//       else{
//         fs.readdir('./data', function(err, filelist){
//           var filteredId = path.parse(queryData.id).base;
//         fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
//           var title = queryData.id;

//           var sanitizedTitle = sanitizeHtml(title);
//           var sanitizedDescription = sanitizeHtml(description);

//           var list = template.list(filelist);

//           var html = template.html(title, list
//             , `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`
//             , `<a href="/create">create</a>
//                <a href="/update?id=${sanitizedTitle}">update</a>
//                <form action="delete_process" method="post" onsubmit="return confirm('${sanitizedTitle}파일을 삭제하시겠습니까?')">
//                   <input type="hidden" name="id" value="${sanitizedTitle}">
//                   <input type="submit" value="delete">
//                </form>
//                `);
//           response.writeHead(200);
//           response.end(html);
//           });
//         });
//       }
//     }
//     else if(pathName === '/create'){
//       fs.readdir('./data', function(err, filelist){
//         var title = 'WEB - CREATE';
//         var list = template.list(filelist);
//         var html = template.html(title, list,
//             `<form class="" action="/create_process" method="post">
//               <p><input type="text" name="title" placeholder="title"></p>
//               <p>

//               </p><textarea name="description" rows="8" cols="80" placeholder="description"></textarea>
//               <p>
//                 <input type="submit" name="" value="create">
//               </p>
//             </form>
//             `,``);
//           response.writeHead(200);
//           response.end(html);
//       });
//     }
//     else if(pathName === '/create_process'){
//       var body = '';
//       request.on('data', function(data){
//         body += data;
//       });

//       request.on('end', function(){
//         var post = qs.parse(body);
//         var title = post.title;
//         var description = post.description;
//         fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//           response.writeHead(302, {Location: `/?id=${title}`});
//           response.end();
//         });
//       });

//     }
//     else if(pathName === '/update'){
//       fs.readdir('./data', function(err, filelist){
//         var filteredId = path.parse(queryData.id).base;
//       fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
//       var title = queryData.id;
//       var list = template.list(filelist);
//       var html = template.html(title, list,
//         `<form class="" action="/update_process" method="post">
//           <input type="text" name="id" value="${title}" hidden="hidden">
//           <p><input type="text" name="title" placeholder="title" value="${title}"></p>
//           <p>

//           </p><textarea name="description" rows="8" cols="80" placeholder="description">${description}</textarea>
//           <p>
//             <input type="submit" name="" value="update">
//           </p>
//         </form>
//         `,``);
//         response.writeHead(200);
//         response.end(html);
//           });
//         });
//     }
//     else if(pathName === '/update_process'){
//       var body = '';
//       request.on('data', function(data){
//         body += data;
//       });

//       request.on('end', function(){
//         var post = qs.parse(body);
//         var id = post.id;
//         var title = post.title;
//         var description = post.description;
//         console.log("post = " + JSON.stringify(post));
//         fs.rename(`data/${id}`, `data/${title}`, function(){
//           fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//             response.writeHead(302, {Location: `/?id=${title}`});
//             response.end();
//           });
//         });
//       });
//     }
//     else if(pathName === '/delete_process'){
//       var body = '';
//       request.on('data', function(data){
//         body += data;
//       });
//       request.on('end', function(){
//         var post = qs.parse(body);
//         var id = post.id;
//         var filteredId = path.parse(id).base;
//         fs.unlink(`data/${filteredId}`, function(err){
//           response.writeHead(302, {Location: `/`});
//           response.end();
//         });
//       });
//     }
//     else{
//       response.writeHead(404);
//       response.end("NOT FOUND");
//     }
// });
// app.listen(3000);

/*
  express 모듈 로드
  
*/
const express = require('express')
const app = express()
const fs = require('fs')
const template = require('./lib/template.js')
const port = 3000

var sanitizeHtml = require('sanitize-html');
var path = require('path');
var qs = require('querystring');

app.get('/', (request, response) => {
 
          fs.readdir('./data', function(err, filelist){
          var title = 'Welcome';
          var description = 'Hello, Charlie';
          var list = template.list(filelist);
          var html = template.html(title, list
              , `<h2>${title}</h2>${description}`
              , `<a href="/create">create</a>`);
            response.end(html);
        });

});

app.get('/page/:pageId', (request, response) => {

  fs.readdir('./data', function(err, filelist){
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      
      var title = filteredId;

      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description);

      var list = template.list(filelist);

      var html = template.html(title, list
        , `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`
        , `<a href="/create">create</a>
           <a href="/update/${sanitizedTitle}">update</a>
           <form action="/delete_process" method="post" onsubmit="return confirm('${sanitizedTitle}파일을 삭제하시겠습니까?')">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
           </form>
           `);
      response.send(html);
      });
  });
     
});

app.get('/create', (request, response) => {
        fs.readdir('./data', function(err, filelist){
        var title = 'WEB - CREATE';
        var list = template.list(filelist);
        var html = template.html(title, list,
            `<form class="" action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>

              </p><textarea name="description" rows="8" cols="80" placeholder="description"></textarea>
              <p>
                <input type="submit" name="" value="create">
              </p>
            </form>
            `,``);
          response.send(html);
      });
});

app.post('/create_process', (request, response) => {
        var body = '';
        request.on('data', function(data){
          body += data;
        });
  
        request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/page/${title}`});
            response.end();
          });
        });
});

app.get('/update/:pageId', (request, response) => {
    fs.readdir('./data', function(err, filelist){
        var filteredId = path.parse(request.params.pageId).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = filteredId;
      var list = template.list(filelist);
      var html = template.html(title, list,
        `<form class="" action="/update_process" method="post">
          <input type="text" name="id" value="${title}" hidden="hidden">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>

          </p><textarea name="description" rows="8" cols="80" placeholder="description">${description}</textarea>
          <p>
            <input type="submit" name="" value="update">
          </p>
        </form>
        `,``);
        response.send(html);
          });
        });
});

app.post('/update_process', (request, response) => {
  var body = '';
        request.on('data', function(data){
          body += data;
        });
  
        request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          console.log("post = " + JSON.stringify(post));
          fs.rename(`data/${id}`, `data/${title}`, function(){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.redirect(`/page/${title}`);
            });
          });
        });
});

app.post('/delete_process', (request, response) => {
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(err){
          response.redirect('/');
        });
      });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})