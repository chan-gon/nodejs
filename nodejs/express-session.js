var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store')(session);

var app = express()

// 사용자 요청 때마다 해당 미들웨어가 개입되어 세션 사용할 수 있도록 한다
app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false, // 세션 데이터가 바뀌기 전까지 세션 저장소에 저장하지 않는다(true라면 바뀌는 여부와 상관없이 계속 저장)
    saveUninitialized: true, // true = 세션이 필요하기 전까지 세션을 구동시키지 않는다
    store: new FileStore()
}))

app.get('/', function (req, res, next) {
    console.log(req.session);
    if(req.session.num === undefined){
        req.session.num = 1; // 임의의 property num에 숫자 1 대입하여 세션 호출 때마다 숫자가 1씩 증가하도록 설정
    }else{
        req.session.num = req.session.num+1;
    }
    res.send(`Views : ${req.session.num}`);
})

app.listen(3000, function () {
    console.log('3000!');
});