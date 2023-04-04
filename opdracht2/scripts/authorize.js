const CLIENT_ID = '2096ba39d9d84680a3ef01dc24958128';
const CLIENT_SECRET = '28887880065d4ff3bb6ced7d494b1860';
const REDIRECT_URI = 'http://127.0.0.1:5500/songdeck.html';

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');

let codeVerifier = localStorage.getItem('code_verifier');

console.log(code);
console.log(codeVerifier);

// let body = new URLSearchParams({
//     grant_type: 'authorization_code',
//     code: code,
//     redirect_uri: REDIRECT_URI,
//     client_id: CLIENT_ID,
//     code_verifier: codeVerifier
// });
let body = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier
};

const response = fetch('https://accounts.spotify.com/api/token', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: JSON.stringify(body),
    json: true
})
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('access_token', data.access_token);
        console.log('access token: ' + data.access_token);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    