const CLIENT_ID = '2096ba39d9d84680a3ef01dc24958128';
const REDIRECT_URI = 'http://localhost:8000/songdeck.html';
const SCOPES = ['user-read-private', 'playlist-read-private'];

function buildUrl() {
  const baseUrl = 'https://accounts.spotify.com/authorize';
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'token',
    scope: SCOPES.join(' '),
    show_dialog: true,
  });
  return `${baseUrl}?${queryParams}`;
}

function login() {
  const url = buildUrl();
  window.location.href = url;
}
