const CLIENT_ID = '2096ba39d9d84680a3ef01dc24958128';
const CLIENT_SECRET = '28887880065d4ff3bb6ced7d494b1860';
const REDIRECT_URI = 'http://127.0.0.1:5500/index.html';

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
const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');
if (code != null) {
  let codeVerifier = localStorage.getItem('code-verifier');
  console.log('codeVerifier: ' + codeVerifier);

  let body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: 'http://127.0.0.1:5500/songdeck.html',
    client_id: CLIENT_ID,
    code_verifier: codeVerifier
  });

  const response = fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem('access-token', data.access_token);
      var accessToken = data.access_token;

      async function getProfile(accessToken) {
        // let accessToken = localStorage.getItem('access_token');

        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        });

        const data = await response.json();
        console.log(data);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
} else {
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
      setTimeout(function () {
        window.location = 'https://accounts.spotify.com/authorize?' + args;
      }, 3000);
    });
  }
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
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET
//   });
//   const response = fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       // 'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
//     },
//     body: body
//   })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('HTTP status ' + response.status);
//       }
//       return response.json();
//     })
//     .then(async data => {
//       // window.localStorage.setItem('accesstoken', JSON.stringify(data.access_token));
//       // var token = window.localStorage.getItem('accesstoken');
//       // console.log('received access token: ' + token);
//       console.log('received access token: ' + data.access_token);

//       const response = await fetch('https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb', {
//         headers: {
//           // 'Content-Type': 'application/x-www-form-urlencoded',
//           'Authorization': 'Bearer ' + data.access_token
//         }
//       });
//       const data2 = await response.json();
//       console.log(data2);

//       // setTimeout(function() {
//       //       let args = new URLSearchParams({
//       //         access_token: data.access_token
//       //       });
//       //   window.location = REDIRECT_URI + '?' + args;
//       // }, 2000);
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
// }