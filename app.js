const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

// BEFORE TOKEN PROTECTION
// app.post('/api/post', (req, res) => {
//   res.json({
//     message: 'Post created...'
//   });
// });

// AFTER TOKEN PROTECTION ADDED (verfy token)
app.post('/api/posts', verifyToken, (req, res) => { // add middleware verifyToken function
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
      });
    }
  });
});

// route to get the JWS token we can use above to protect route
app.post('/api/login', (req, res) => {
  // Mock user
  const user = {
    id: 1,
    username: 'brad',
    email: 'brad#gmail.com'
  }
  // can do sync or async (this is async with a callback)
  jwt.sign({user: user}, 'secretkey', { expiresIn: '30s' }, (err, token) => { // added token expiration option
    res.json({
      token: token // in ES6 since they are the same you can just do "token"
    });
  }); 
});

// FORMAT OF TOKEN
// Authorization: `bearer <access_token>`

// VerifyToken Middleware
function verifyToken(req, res, next) {
  // when token is sent it is in the header as an authorization value
  const bearerHeader = req.headers['authorization'];
  // check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // take it out of the `bearer <access_token>`
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from above array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Call next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

app.listen(5000, () => console.log('Server started on port 5000'));