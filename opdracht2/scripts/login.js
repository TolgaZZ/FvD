const CLIENT_ID = '2096ba39d9d84680a3ef01dc24958128';
const CLIENT_SECRET = '28887880065d4ff3bb6ced7d494b1860';
const REDIRECT_URI = 'http://127.0.0.1:5500/songdeck.html';

const SCOPES = ['user-read-private', 'playlist-read-private', 'user-top-read'];

// function buildUrl() {
//   const baseUrl = 'https://accounts.spotify.com/authorize';
//   const queryParams = new URLSearchParams({
//     client_id: CLIENT_ID,
//     redirect_uri: REDIRECT_URI,
//     response_type: 'token',
//     scope: SCOPES.join(' '),
//     show_dialog: true,
//   });
//   return `${baseUrl}?${queryParams}`;
// }

// function login() {
//   const url = buildUrl();
//   window.location.href = url;
// }


function generateRandomString(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
let codeVerifier = generateRandomString(128);

async function generateCodeChallenge(codeVerifier) {
  function base64encode(string) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return base64encode(digest);
}

function login() {
  generateCodeChallenge(codeVerifier).then(codeChallenge => {
    let state = generateRandomString(16);
    let scope = 'user-read-private user-read-email playlist-read-private user-top-read';

    localStorage.setItem('code_verifier', codeVerifier);

    let args = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });

    console.log('codeVerifier: ' + codeVerifier);
    setTimeout(function(){
      window.location = 'https://accounts.spotify.com/authorize?' + args;
    }, 3000);
  });
}

// var authOptions = {
//   url: 'https://accounts.spotify.com/api/token',
//   headers: {
//     'Authorization': 'Basic ' + (CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
//   },
//   form: {
//     grant_type: 'client_credentials'
//   },
//   json: true
// };

// request.post(authOptions, function(error, response, body) {
//   if (!error && response.statusCode === 200) {
//     var token = body.access_token;
//     localStorage.setItem('auth-token', token);
//     window.location = REDIRECT_URI;
//   }
// });

// function login() {
//   let body = new URLSearchParams({
//     grant_type: 'client_credentials',
//   });
//   const response = fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
//     },
//     body: body
//   })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('HTTP status ' + response.status);
//       }
//       return response.json();
//     })
//     .then(data => {
//       localStorage.setItem('access_token', data.access_token);
//       console.log('received access token: ' + data.access_token);
//       setTimeout(function() {
//         window.location = REDIRECT_URI;
//       }, 2000);
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
// }