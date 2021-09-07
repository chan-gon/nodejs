// 아래 코드는 nodejs cookie & auth 수업 관련 코드 

// var http = require('http');
// var fs = require('fs');
// var url = require('url');
// var qs = require('querystring');
// var template = require('./lib/template.js');
// var path = require('path');
// var sanitizeHtml = require('sanitize-html');
// var cookie = require('cookie');

// function authIsOwner(request, response) {
//   var isOwner = false;
//   var cookies = {}
//   if (request.headers.cookie) {
//     cookies = cookie.parse(request.headers.cookie);
//   }
//   // 이것은 매우 위험한 코드입니다. 현실에서는 쿠키가 아닌 세션 방법을 사용해야 합니다. 
//   if (cookies.email === 'charlie@gmail.com' && cookies.password === '123') {
//     isOwner = true;
//   }
//   return isOwner;
// }

// function authStatusUI(request, response) {
//   var authStatusUI = '<a href="/login">login</a>';
//   if (authIsOwner(request, response)) {
//     authStatusUI = '<a href="/logout_process">logout</a>';
//   }
//   return authStatusUI;
// }

// var app = http.createServer(function (request, response) {
//   var _url = request.url;
//   var queryData = url.parse(_url, true).query;
//   var pathname = url.parse(_url, true).pathname;
//   if (pathname === '/') {
//     if (queryData.id === undefined) {
//       fs.readdir('./data', function (error, filelist) {
//         var title = 'Welcome';
//         var description = 'Hello, Node.js';
//         var list = template.list(filelist);
//         var html = template.HTML(title, list,
//           `<h2>${title}</h2>${description}`,
//           `<a href="/create">create</a>`,
//           authStatusUI(request, response)
//         );
//         response.writeHead(200);
//         response.end(html);
//       });
//     } else {
//       fs.readdir('./data', function (error, filelist) {
//         var filteredId = path.parse(queryData.id).base;
//         fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
//           var title = queryData.id;
//           var sanitizedTitle = sanitizeHtml(title);
//           var sanitizedDescription = sanitizeHtml(description, {
//             allowedTags: ['h1']
//           });
//           var list = template.list(filelist);
//           var html = template.HTML(sanitizedTitle, list,
//             `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
//             ` <a href="/create">create</a>
//                 <a href="/update?id=${sanitizedTitle}">update</a>
//                 <form action="delete_process" method="post">
//                   <input type="hidden" name="id" value="${sanitizedTitle}">
//                   <input type="submit" value="delete">
//                 </form>`, authStatusUI(request, response)
//           );
//           response.writeHead(200);
//           response.end(html);
//         });
//       });
//     }
//   } else if (pathname === '/create') {
//     if(authIsOwner(request, response) === false){
//       response.end('Login required!!');
//       return false;
//     }
//     fs.readdir('./data', function (error, filelist) {
//       var title = 'WEB - create';
//       var list = template.list(filelist);
//       var html = template.HTML(title, list, `
//           <form action="/create_process" method="post">
//             <p><input type="text" name="title" placeholder="title"></p>
//             <p>
//               <textarea name="description" placeholder="description"></textarea>
//             </p>
//             <p>
//               <input type="submit">
//             </p>
//           </form>
//         `, '', authStatusUI(request, response));
//       response.writeHead(200);
//       response.end(html);
//     });
//   } else if (pathname === '/create_process') {
//     if(authIsOwner(request, response) === false){
//       response.end('Login required!!');
//       return false;
//     }
//     var body = '';
//     request.on('data', function (data) {
//       body = body + data;
//     });
//     request.on('end', function () {
//       var post = qs.parse(body);
//       var title = post.title;
//       var description = post.description;
//       fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
//         response.writeHead(302, {
//           Location: `/?id=${title}`
//         });
//         response.end();
//       })
//     });
//   } else if (pathname === '/update') {
//     if(authIsOwner(request, response) === false){
//       response.end('Login required!!');
//       return false;
//     }
//     fs.readdir('./data', function (error, filelist) {
//       var filteredId = path.parse(queryData.id).base;
//       fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
//         var title = queryData.id;
//         var list = template.list(filelist);
//         var html = template.HTML(title, list,
//           `
//             <form action="/update_process" method="post">
//               <input type="hidden" name="id" value="${title}">
//               <p><input type="text" name="title" placeholder="title" value="${title}"></p>
//               <p>
//                 <textarea name="description" placeholder="description">${description}</textarea>
//               </p>
//               <p>
//                 <input type="submit">
//               </p>
//             </form>
//             `,
//           `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`,
//           authStatusUI(request, response)
//         );
//         response.writeHead(200);
//         response.end(html);
//       });
//     });
//   } else if (pathname === '/update_process') {
//     if(authIsOwner(request, response) === false){
//       response.end('Login required!!');
//       return false;
//     }
//     var body = '';
//     request.on('data', function (data) {
//       body = body + data;
//     });
//     request.on('end', function () {
//       var post = qs.parse(body);
//       var id = post.id;
//       var title = post.title;
//       var description = post.description;
//       fs.rename(`data/${id}`, `data/${title}`, function (error) {
//         fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
//           response.writeHead(302, {
//             Location: `/?id=${title}`
//           });
//           response.end();
//         })
//       });
//     });
//   } else if (pathname === '/delete_process') {
//     if(authIsOwner(request, response) === false){
//       response.end('Login required!!');
//       return false;
//     }
//     var body = '';
//     request.on('data', function (data) {
//       body = body + data;
//     });
//     request.on('end', function () {
//       var post = qs.parse(body);
//       var id = post.id;
//       var filteredId = path.parse(id).base;
//       fs.unlink(`data/${filteredId}`, function (error) {
//         response.writeHead(302, {
//           Location: `/`
//         });
//         response.end();
//       })
//     });
//   } else if (pathname === '/login') {
//     fs.readdir('./data', function (error, filelist) {
//       var title = 'Login';
//       var list = template.list(filelist);
//       var html = template.HTML(title, list,
//         `
//           <form action="login_process" method="post">
//             <p><input type="text" name="email" placeholder="email"></p>
//             <p><input type="password" name="password" placeholder="password"></p>
//             <p><input type="submit"></p>
//           </form>`,
//         `<a href="/create">create</a>`
//       );
//       response.writeHead(200);
//       response.end(html);
//     });
//   } else if (pathname === '/login_process') {
//     var body = '';
//     request.on('data', function (data) {
//       body = body + data;
//     });
//     request.on('end', function () {
//       var post = qs.parse(body);
//       // 이것은 매우 위험한 코드입니다. 현실에서는 쿠키가 아닌 세션 방법을 사용해야 합니다. 
//       if (post.email === 'charlie@gmail.com' && post.password === '123') {
//         response.writeHead(302, {
//           'Set-Cookie': [
//             `email=${post.email}`,
//             `password=${post.password}`,
//             `nickname=charlie`
//           ],
//           Location: `/`
//         });
//         response.end();
//       } else {
//         response.end('Login failed / check your ID/PW');
//       }
//     });
//   } else if (pathname === '/logout_process') {
//     if(authIsOwner(request, response) === false){
//       response.end('Login required!!');
//       return false;
//     }
//     var body = '';
//     request.on('data', function (data) {
//       body = body + data;
//     });
//     request.on('end', function () {
//       var post = qs.parse(body);
//       response.writeHead(302, {
//         'Set-Cookie': [
//           `email=; Max-Age=0`,
//           `password=; Max-Age=0`,
//           `nickname=; Max-Age=0`
//         ],
//         Location: `/`
//       });
//       response.end();
//     });
//   } else {
//     response.writeHead(404);
//     response.end('Not found');
//   }
// });
// app.listen(3000);

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
var authRouter = require('./routes/auth.js');
var helmet = require('helmet');
app.use(helmet());
var session = require('express-session');
var FileStore = require('session-file-store')(session);

app.use(express.static('public')); //public 디렉토리 안에서 static 파일을 찾겠다고 선언

/*
  bodyParser는 POST로 요청된 body를 쉽게 추출할 수 있는 모듈이다
  추출된 결과는 request 객체의 body 프로퍼티로 저장된다
  express 4.16 이상부터 express 내부에 bodyParser가 포함되기 때문에 일부러 bodyParser를 추가할 필요가 없다
  기존 방식인 app.use(bodyParser.urlencoded({ extended: false }))은 deprecated
*/
app.use(express.urlencoded({ extended: false }));
app.use(compression());

// 사용자 요청 때마다 해당 미들웨어가 개입되어 세션 사용할 수 있도록 한다
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false, // 세션 데이터가 바뀌기 전까지 세션 저장소에 저장하지 않는다(true라면 바뀌는 여부와 상관없이 계속 저장)
  saveUninitialized: true, // true = 세션이 필요하기 전까지 세션을 구동시키지 않는다
  store: new FileStore()
}))

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

app.use('/auth', authRouter);


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