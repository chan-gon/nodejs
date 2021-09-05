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

// -------------------------------------------------- expressjs 적용 -----------------------------------------------------

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
var topicRouter = require('./routes/topic.js');
var indexRouter = require('./routes/index.js');
var helmet = require('helmet');
app.use(helmet());

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

// '/'으로 시작하는 주소들에게 topicRouter라는 이름의 미들웨어를 적용
app.use('/', indexRouter);

// '/topic'으로 시작하는 주소들에게 topicRouter라는 이름의 미들웨어를 적용
app.use('/topic' ,topicRouter);


/* 
  에러 핸들러 미들웨어를 가장 하단에 배치한 이유는 
  미들웨어는 순차적으로 실행되고, 에러 핸들링은 모든 미들웨어를 거치는 것이 좋기 때문

*/
app.use(function(req, res, next){
  res.status(404).send("PAGE NOT FOUND");
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})