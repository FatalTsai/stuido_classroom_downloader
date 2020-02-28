const express = require('express')
const path = require('path')
//const PORT = process.env.PORT || 5000
const  app  =  express()
var port = process.env.PORT || 5000
var fetch = require('node-fetch')
var fs = require('fs')
var date ='0229'
var url = `https://d17lx9ucc6k9fc.cloudfront.net/studioclassroom/202002/SC2020${date}.mp4`
//var url = 'https://github.com/FawenYo/LineBot_Tutorial'

/*
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
*/

var   downloadBlock = async function(){
  return await fetch(url, {})
  .then((response) => {
    // 這裡會得到一個 ReadableStream 的物件
    console.log(response);
    // 可以透過 blob(), json(), text() 轉成可用的資訊
    return response.buffer();
  }).then((jsonData) => {
    fs.writeFileSync(`./source/${date}.mp4`,jsonData)
    //console.log('jsonData = ' +jsonData);
  }).bind(this)
  

}

(async function () {  

  downloadBlock(url)
  

})









var initFolder = './source/'
app.get('/api/video/*',(req,res) =>{
  const lastfilename = req.params['0']
  const filename =
  initFolder +lastfilename
  const stats = fs.statSync(filename) //read target file's imformation
  //console.log("size = "+stats.size)
  const rangeRequest = readRangeHeader(req.headers['range'], stats.size) 
  //console.log(rangeRequest)
  var resHeaders={};

  var mimeNames = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.ogg': 'application/ogg', 
    '.ogv': 'video/ogg', 
    '.oga': 'audio/ogg',
    '.txt': 'text/plain',
    '.wav': 'audio/x-wav',
    '.webm': 'video/webm'
  };
 

  console.log("filename = "+filename)

  // If 'Range' header exists, we will parse it with Regular Expression.
  if (rangeRequest == null) {
      resHeaders['Content-Type'] = getMimeNameFromExt(path.extname(filename));
      resHeaders['Content-Type'] = mimeNames['.mp4']
      resHeaders['Content-Length'] = stats.size;  // File size.
      resHeaders['Accept-Ranges'] = 'bytes';

      //  If not, will return file directly.
      sendResponse(res, 200, resHeaders, fs.createReadStream(filename));
      return null;
  }
  var start = rangeRequest.Start;
  var end = rangeRequest.End;

  // If the range can't be fulfilled. 
  if (start >= stats.size || end >= stats.size) {
      // Indicate the acceptable range.
      resHeaders['Content-Range'] = 'bytes */' + stats.size; // File size.

      // Return the 416 'Requested Range Not Satisfiable'.
      sendResponse(res, 416, resHeaders, null);
      return null;
  }

  // Indicate the current range. 
  resHeaders['Content-Range'] = 'bytes ' + start + '-' + end + '/' + stats.size;
  resHeaders['Content-Length'] = start == end ? 0 : (end - start + 1);
  //resHeaders['Content-Type'] = getMimeNameFromExt(path.extname(filename));
  resHeaders['Content-Type'] = mimeNames['.mp4']
  resHeaders['Accept-Ranges'] = 'bytes';
  resHeaders['Cache-Control'] = 'no-cache';

  // Return the 206 'Partial Content'.
  sendResponse(res, 206, resHeaders, fs.createReadStream(filename, { start: start, end: end }));

})  

app.get('/', (req, res) => {
  res.json({
      'message': 'fuck'
  });
});

app.listen(port, () => console.log(`backend listening on port ${port}!`))


function readRangeHeader(range,totalLength) {
  var array = String(range).split(/bytes=([0-9]*)-([0-9]*)/); //使用正規表示法 切割字串 array == ['',start,end,'']
  var start = parseInt(array[1]);
  var end = parseInt(array[2]);
 
  var result = {
      Start: isNaN(start) ? 0 : start,
      End: isNaN(end) ? (totalLength - 1) : end //如果request.header缺少start 或是 end（isNaN成立）  則將start ,end 設成檔案的頭跟尾

  };
 
  if (!isNaN(start) && isNaN(end)) {
      result.Start = start;
      result.End = totalLength - 1;
  }

  if (isNaN(start) && !isNaN(end)) {
      result.Start = totalLength - end;
      result.End = totalLength - 1;
  }
  
  return result;
  
}

function sendResponse(response, responseStatus, responseHeaders, readable) {
  response.writeHead(responseStatus, responseHeaders);

  if (readable == null)
      response.end();
  else
      readable.on('open', function () {
          readable.pipe(response);
      });

  return null;
}