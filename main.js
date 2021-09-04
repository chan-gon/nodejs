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
var bodyParser = require('body-parser');
var compression = require('compression');

app.use(express.static('public')); //public 디렉토리 안에서 static 파일을 찾겠다고 선언

/*
  bodyParser는 POST로 요청된 body를 쉽게 추출할 수 있는 모듈이다
  추출된 결과는 request 객체의 body 프로퍼티로 저장된다
  express 4.16 이상부터 express 내부에 bodyParser가 포함되기 때문에 일부러 bodyParser를 추가할 필요가 없다
  기존 방식인 app.use(bodyParser.urlencoded({ extended: false }))은 deprecated
*/
app.use(express.urlencoded({ extended: false }));
app.use(compression());

//파일 목록을 불러오는 미들웨어 함수(get 요청에 대해서만 실행)되는 미들웨어 함수
app.get('*' , function(request, response, next){
  fs.readdir('./data', function(err, filelist){
    request.list = filelist;
    next();
  });
});

app.get('/', (request, response) => {
 
          var title = 'Welcome';
          var description = 'Hello, Charlie';
          var list = template.list(request.list);
          var html = template.html(title, list
              , `<h2>${title}</h2>${description}
              <img src="/images/hello.jpg" style="width:300px; display:block; margin:10px"></img>`
              , `<a href="/create">create</a>`);
          response.send(html);
});

app.get('/page/:pageId', (request, response) => {

  console.log(request.list); //181번 라인에 선언된 미들웨어 함수 정의에 따라 request.list로 목록 불러오기 가능

    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      
      var title = filteredId;

      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description);

      var list = template.list(request.list);

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

app.get('/create', (request, response) => {

        var title = 'WEB - CREATE';
        var list = template.list(request.list);
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

app.post('/create_process', (request, response) => {

  var post = request.body; //body-parser 설정으로 request 객체의 body 프로퍼티에 접근 가능
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    response.writeHead(302, {Location: `/page/${title}`});
    response.end();
  });

  /*
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
   */
});

app.get('/update/:pageId', (request, response) => {

        var filteredId = path.parse(request.params.pageId).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = filteredId;
      var list = template.list(request.list);
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

app.post('/update_process', (request, response) => {
  
          var post = request.body;
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

app.post('/delete_process', (request, response) => {

        var post = request.body;
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(err){
          response.redirect('/');
        });

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})