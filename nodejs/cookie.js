var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response){
    var cookies = {};
    if(request.headers.cookie !== undefined){
        cookies = cookie.parse(request.headers.cookie);
    }

    response.writeHead(200, {
        'Set-Cookie':['yummy_cookie=choco', 
                        'tasty_cookie=strawberry',
                        `Permanent=cookies; Max-Age=${60*60*24*30}`, //Max-Age: cookie의 lifespan 설정
                        'Secure=Secure; Secure',
                        'HttpOnly=HttpOnly; HttpOnly',
                        'Path=Path; Path=/cookie', //Path 설정을 통해 특정 경로에만 및 특정 경로의 하부 디렉토리에만 cookie값이 있도록 설정
                        'Domain=Domain; Domain=o2.org'
                    ]
    });
    
    response.end('Cookie');
}).listen(3000); 