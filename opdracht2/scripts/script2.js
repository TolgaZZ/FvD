function login() {
  const clientId = '2096ba39d9d84680a3ef01dc24958128';
  const redirectUri = encodeURIComponent('http://127.0.0.1:5500/songdeck.html');
  const scopes = encodeURIComponent('playlist-read-private playlist-read-private user-top-read');

  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
}

window.addEventListener('load', async () => {
  // const urlParams = new URLSearchParams(window.location.search);
  // let code = urlParams.get('code');
  // if (!code) {
  //   window.location.replace("http://localhost:5500/index.html");
  //   return;
  // }
  // if(!window.location.hash) {
  //   window.location.replace("http://localhost:5500/index.html");
  //   return;
  // }
  // var hash = window.location.hash.substring(1);
  // if (!hash.includes('access_token')) {
  //   window.location.replace("http://localhost:5500/index.html");
  //   return;
  // }

  // const params = new URLSearchParams(window.location.search);
  // const accessToken = params.get('access_token');
  // console.log('accesToken: ' + accessToken);

  // var access_token = hash.replace('access_token=', '').replace('&token_type=Bearer&expires_in=3600', '');
  // console.log(access_token);

  // Your Spotify API credentials
  const CLIENT_ID = '2096ba39d9d84680a3ef01dc24958128';
  const CLIENT_SECRET = '28887880065d4ff3bb6ced7d494b1860';

  // var accessToken = '';
  // let body = new URLSearchParams({
  //   grant_type: 'client_credentials',
  //   client_id: CLIENT_ID,
  //   client_secret: CLIENT_SECRET
  // });
  // await fetch('https://accounts.spotify.com/api/token', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     // 'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
  //   },
  //   body: body
  // })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('HTTP status ' + response.status);
  //     }
  //     return response.json();
  //   })
  //   .then(async data => {
  //     // window.localStorage.setItem('accesstoken', JSON.stringify(data.access_token));
  //     // var token = window.localStorage.getItem('accesstoken');
  //     // console.log('received access token: ' + token);
  //     console.log('received access token: ' + data.access_token);
  //     accessToken = data.access_token;

  //     // const response = await fetch('https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb', {
  //     //   headers: {
  //     //     // 'Content-Type': 'application/x-www-form-urlencoded',
  //     //     'Authorization': 'Bearer ' + data.access_token
  //     //   }
  //     // });
  //     // const data2 = await response.json();
  //     // console.log(data2);

  //     // setTimeout(function() {
  //     //       let args = new URLSearchParams({
  //     //         access_token: data.access_token
  //     //       });
  //     //   window.location = REDIRECT_URI + '?' + args;
  //     // }, 2000);
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });

  // Authenticate and get an access token
  // const getAccessToken = async () => {
  //   const response = await fetch('https://accounts.spotify.com/api/token', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
  //     },
  //     body: 'grant_type=client_credentials'
  //   });
  //   const data = await response.json();
  //   return data.access_token;
  // };

  // let accessToken = window.localStorage.getItem('accesstoken');
  // console.log('accesToken: ' + JSON.parse(accessToken));

  // function getAccessTokenFromUrl() {
  //   const hash = window.location.hash.substring(1);
  //   const params = new URLSearchParams(hash);
  //   return params.get('access_token');
  // }
  const accessToken = getAccessTokenFromUrl();

  if (accessToken) {
    const playlistId = '2TuEeBAviJcV42k1pUMTTe';

    fetchPlaylist(playlistId, accessToken).then(tracks => {
      tracks.forEach((track, index) => {
        console.log('index: ' + index);
        const card = document.getElementById(`card${index + 1}`);
        card.style.backgroundImage = `url('${track.coverUrl}')`;
        // const cardImage = card.getElementsByClassName('card-image')[0];
        // card.innerHTML = `
        //   <img src="${track.coverUrl}" alt="${track.name}" />
        // `;

        card.dataset.trackInfo = JSON.stringify(track);

        card.addEventListener('click', () => {
          const trackInfo = JSON.parse(card.dataset.trackInfo);
          updateSongInfo(trackInfo);
        });
      });

      const initialTrackInfo = JSON.parse(cards[selectedIndex].dataset.trackInfo);
      updateSongInfo(initialTrackInfo);
    });

    // Get user's top 5 tracks
    const getTopTracks = async (accessToken) => {
      const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + accessToken
        }
      });
      const data = await response.json();
      console.log(data);
      return data.items;
    };
    const tracks = getTopTracks();
  }

  const songTitleElement = document.querySelector('.song-title');
  const audio = new Audio();

  function updateSongInfo(track) {
    songTitleElement.textContent = `${track.name} - ${track.artist}`;
    audio.src = track.previewUrl;
    console.log('preview url: ' + track.previewUrl);
    audio.play();
  }


  // const getArtist = async (accessToken) => {
  //   const response = await fetch('https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb', {
  //     headers: {
  //       // 'Content-Type': 'application/x-www-form-urlencoded',
  //       'Authorization': 'Bearer ' + accessToken
  //     }
  //   });
  //   const data = await response.json();
  //   console.log(data);
  //   return data.items;
  // };
  // getArtist();
  // const response = fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': 'Bearer ' + accessToken
  //   }
  // })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('HTTP status ' + response.status);
  //     }
  //     return response.json();
  //   })
  //   .then(data => {
  //     // localStorage.setItem('access_token', data.access_token);
  //     console.log('received data: ' + data);
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });

  // Get image URL of a track
  const getImageUrl = (track) => {
    return track.album.images[0].url;
  };

  // Initialize the carousel
  // const initCarousel = (tracks) => {
    const cardsContainer = document.querySelector('.cards-container');
    const songTitle = document.querySelector('.song-title');
    const playButton = document.querySelector('.play-button');
    const currentTime = document.querySelector('.current-time');
    let currentTrackIndex = 0;

    // Update the currently selected card and song info
    const updateSelection = () => {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        card.classList.remove('selected');
      });
      cards[currentTrackIndex].classList.add('selected');
      const track = tracks[currentTrackIndex];
      songTitle.textContent = `${track.name} - ${track.artists[0].name}`;
      audio.src = track.preview_url;
    };

    // Initialize the cards
    tracks.forEach((track, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      if (index === currentTrackIndex) {
        card.classList.add('selected');
      }
      const image = document.createElement('img');
      image.src = getImageUrl(track);
      image.alt = track.name;
      card.appendChild(image);
      card.addEventListener('click', () => {
        currentTrackIndex = index;
        updateSelection();
      });
      cardsContainer.appendChild(card);
    });

    // Initialize the play button
    playButton.addEventListener('click', () => {
      console.log('clicked');
      if (audio.paused) {
        console.log('playing audio');
        audio.play();
        playButton.textContent = 'Pause';
      } else {
        console.log('paused audio');
        audio.pause();
        playButton.textContent = 'Play';
      }
    });

    // Initialize the timer
    audio.addEventListener('timeupdate', () => {
      const minutes = Math.floor(audio.currentTime / 60);
      const seconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
      currentTime.textContent = `${minutes}:${seconds}`;
    });

    // Initialize the arrow buttons
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    leftArrow.addEventListener('click', () => {
      currentTrackIndex--;
      if (currentTrackIndex < 0) {
        currentTrackIndex = tracks.length - 1;
      }
      updateSelection();
    });
  // };
  // rightArrow.addEventListener('click', () => {
  //   currentTrackIndex++;
  //   if (currentTrack
});