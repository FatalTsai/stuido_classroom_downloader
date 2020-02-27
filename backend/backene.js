var fetch = require('node-fetch')


var api_url = ' https://d17lx9ucc6k9fc.cloudfront.net/studioclassroom/202002/SC20200228.mp4'
fetch(api_url, {})
  .then((response) => {
    // 這裡會得到一個 ReadableStream 的物件
    console.log(response);
    // 可以透過 blob(), json(), text() 轉成可用的資訊
    return response.json();
  }).then((jsonData) => {
    console.log(jsonData);
  }).catch((err) => {
    console.log('錯誤:', err);
  });