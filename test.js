const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener('readystatechange', function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open('GET', 'https://echo.free.beeceptor.com/');
xhr.setRequestHeader(
  'accept',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
);
xhr.setRequestHeader('accept-language', 'en-US,en;q=0.9');
xhr.setRequestHeader('cache-control', 'no-cache');
xhr.setRequestHeader('pragma', 'no-cache');
xhr.setRequestHeader('priority', 'u=0, i');
xhr.setRequestHeader(
  'sec-ch-ua',
  '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
);
xhr.setRequestHeader('sec-ch-ua-mobile', '?0');
xhr.setRequestHeader('sec-ch-ua-platform', '"macOS"');
xhr.setRequestHeader('sec-fetch-dest', 'document');
xhr.setRequestHeader('X-Forwarded-Host-Custom', 'gato.com');
xhr.setRequestHeader('X-Forwarded-Host', 'gato.com');

xhr.send(data);
