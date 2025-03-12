const http = require('http');
const fs = require('fs');


function returnHtmlFile(status, path, res) {
    const content = fs.readFileSync(path, 'utf-8');
    res.writeHead(status, { 'Content-Type': 'text/html' });
    res.end(content + `<a href="/">home</a><a href="/about">about</a><a href="/contact">contact</a>`);
}

const server = http.createServer(function (req, res) {
    if (req.url == '/') {
        returnHtmlFile(200, 'index.html', res);
    } else if (req.url == '/about') {
        returnHtmlFile(200, 'about.html', res);
    } else if (req.url == '/contact') {
        returnHtmlFile(200, 'contact.html', res);
    } else {
        returnHtmlFile(404, 'notFound.html', res);
    }
});

server.listen(8082)