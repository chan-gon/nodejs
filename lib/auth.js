// 로그인 유무 확인에 따른 UI 출력 라우터

module.exports = {
    isOwner:function(request, response){
        if(request.session.is_logined){
            return true;
        }else{
            return false;
        }
    },
    statusUI:function(request, response){
        var authStatusUI = '<a href="/auth/login">login</a>';
        if(this.isOwner(request, response)){
            authStatusUI = `${request.session.nickname} | <a href="/auth/logout">logout</a>`;
        }
        return authStatusUI;
    }
}

