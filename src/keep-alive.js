
const express = require('express');
const app = express();


app.get('/', (req, res) => {
  // Serve the index.html file
  res.sendDate({'messsage': 'Please go to our main site'});
});

function startKeepAliveServer() {
  app.listen(process.env.PORT || 3000, () => {
    console.log('Keep-alive server is running.');
  });
}

module.exports = { startKeepAliveServer };
