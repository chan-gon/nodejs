module.exports = {
  html: function (title, list, body, control){ //본문 호출 함수
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB2 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list:function (filelist){ //파일 리스트 호출 함수
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list += `<li><a href="/page/${filelist[i]}">${filelist[i]}</a></li>`;
      i++;
    }
    list += '</ul>';

    return list;
  }
}
