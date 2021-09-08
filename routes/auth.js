
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

var authData = {
  email: 'charlie@gmail.com',
  password: '123',
  nickname: 'charlie'
}

router.get('/login', (request, response) => {
    var title = 'WEB - LOGIN';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `<form class="" action="/auth/login_process" method="post">
          <p><input type="text" name="email" placeholder="email"></p>
          <p>
  
          <p><input type="password" name="pwd" placeholder="password"></p>
          <p>
            <input type="submit" value="login">
          </p>
        </form>
        `,``);
      response.send(html);
  
  });

router.get('/logout', (request, response) => {
   request.session.destroy(function(err){
      response.redirect('/');
   });
});

router.post('/login_process', (request, response) => {
  
    var post = request.body; //body-parser 설정으로 request 객체의 body 프로퍼티에 접근 가능
    var email = post.email;
    var password = post.pwd;
    if(email === authData.email && password === authData.password){
      request.session.is_logined = true;
      request.session.nickname = authData.nickname;
      request.session.save(function(){// save함수를 사용하면 session 객체의 데이터를 session store에 적용하는 작업을 바로 실행
        response.redirect(`/`); // session store에 저장이 완료되면 redirection 실행(이렇게 안하면 redirection 먼저 되고 session 객체 저장 안되는 상황이 발생할 수 있음)
      }); 
    }else{
      response.send('incorrect email or password');
    }
    

});
// router.get('/create', (request, response) => {

//     var title = 'WEB - CREATE';
//     var list = template.list(request.list);
//     var html = template.HTML(title, list,
//         `<form class="" action="/topic/create_process" method="post">
//           <p><input type="text" name="title" placeholder="title"></p>
//           <p>
  
//           </p><textarea name="description" rows="8" cols="80" placeholder="description"></textarea>
//           <p>
//             <input type="submit" name="" value="create">
//           </p>
//         </form>
//         `,``);
//       response.send(html);
  
//   });
  
//   router.post('/create_process', (request, response) => {
  
//     var post = request.body; //body-parser 설정으로 request 객체의 body 프로퍼티에 접근 가능
//     var title = post.title;
//     var description = post.description;
//     fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//       response.redirect(`/topic/${title}`);
//     });
  
//     /*
//           var body = '';
//           request.on('data', function(data){
//             body += data;
//           });
    
//           request.on('end', function(){
//             var post = qs.parse(body);
//             var title = post.title;
//             var description = post.description;
//             fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//               response.writeHead(302, {Location: `/page/${title}`});
//               response.end();
//             });
//           });
//      */
//   });
  
//   router.get('/update/:pageId', (request, response) => {
  
//     var filteredId = path.parse(request.params.pageId).base;
//   fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
//   var title = filteredId;
//   var list = template.list(request.list);
//   var html = template.HTML(title, list,
//     `<form class="" action="/topic/update_process" method="post">
//       <input type="text" name="id" value="${title}" hidden="hidden">
//       <p><input type="text" name="title" placeholder="title" value="${title}"></p>
//       <p>
  
//       </p><textarea name="description" rows="8" cols="80" placeholder="description">${description}</textarea>
//       <p>
//         <input type="submit" name="" value="update">
//       </p>
//     </form>
//     `,``);
//     response.send(html);
//       });
  
//   });
  
//   router.post('/update_process', (request, response) => {
    
//     var post = request.body;
//     var id = post.id;
//     var title = post.title;
//     var description = post.description;
//     console.log("post = " + JSON.stringify(post));
//     fs.rename(`data/${id}`, `data/${title}`, function(){
//       fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//         response.redirect(`/topic/${title}`);
//       });
//     });
  
//   });
  
//   router.post('/delete_process', (request, response) => {
  
//     var post = request.body;
//     var id = post.id;
//     var filteredId = path.parse(id).base;
//     fs.unlink(`data/${filteredId}`, function(err){
//       response.redirect('/');
//     });
  
//   });
  
//   router.get('/:pageId', (request, response, next) => {
  
//     console.log(request.list); //181번 라인에 선언된 미들웨어 함수 정의에 따라 request.list로 목록 불러오기 가능
  
//       var filteredId = path.parse(request.params.pageId).base;
//       fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
  
//          if(err){
//           next(err); //하단 500번 에러가 설정된 미들웨어 호출
          
//          }else{
//           var title = filteredId;
//           var sanitizedTitle = sanitizeHtml(title);
//           var sanitizedDescription = sanitizeHtml(description);
//           var list = template.list(request.list);
    
//           var html = template.html(title, list
//             , `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`
//             , `<a href="/topic/create">create</a>
//                <a href="/topic/update/${sanitizedTitle}">update</a>
//                <form action="/topic/delete_process" method="post" onsubmit="return confirm('${sanitizedTitle}파일을 삭제하시겠습니까?')">
//                   <input type="hidden" name="id" value="${sanitizedTitle}">
//                   <input type="submit" value="delete">
//                </form>
//                `);
//           response.send(html);
//          }
//       });
//   });

  module.exports = router;