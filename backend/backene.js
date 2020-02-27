var fetch = require('node-fetch')
var fs = require('fs')

var api_url = ' https://d17lx9ucc6k9fc.cloudfront.net/studioclassroom/202002/SC20200228.mp4'


var   downloadBlock = async function(url){
  
  return await fetch(api_url, {})
  .then((response) => {
    // 這裡會得到一個 ReadableStream 的物件
    console.log(response);
    // 可以透過 blob(), json(), text() 轉成可用的資訊
    return response.buffer();
  }).then((jsonData) => {
    fs.writeFileSync('./source/test.mp4',jsonData)
    //console.log('jsonData = ' +jsonData);
  }).bind(this)

}

(async function () {  

 var buffer = downloadBlock(api_url)
  console.log(buffer)
  fs.writeFileSync('./source/test.mp4',buffer)

})