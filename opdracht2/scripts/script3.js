// JavaScript Document
function login() {
    const clientId = '2096ba39d9d84680a3ef01dc24958128';
    const redirectUri = encodeURIComponent('https://tolgazorlu.nl/opdracht2/songdeck.html');
    const scopes = encodeURIComponent('playlist-read-private');
  
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
  }
    
    async function fetchPlaylist(playlistId, accessToken) {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      return data.tracks.items.map(item => ({
        name: item.track.name,
        artist: item.track.artists[0].name,
        coverUrl: item.track.album.images[0].url,
        previewUrl: item.track.preview_url
      }));
    }
    
    function getAccessTokenFromUrl() {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      return params.get('access_token');
    }
    
    const cards = document.querySelectorAll('.card');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    
    let selectedIndex = 2;
    
    function updateCards() {
      cards.forEach((card, index) => {
        card.style.zIndex = selectedIndex - Math.abs(selectedIndex - index);
        card.classList.remove('selected');
        card.style.transform = `translateX(${(index - selectedIndex) * 50}px) scale(${1 - Math.abs(index - selectedIndex) * 0.1})`;
      });
    
      cards[selectedIndex].style.zIndex = cards.length;
      cards[selectedIndex].classList.add('selected');
    }
    
    cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        selectedIndex = index;
        updateCards();
      });
    });
    
    leftArrow.addEventListener('click', () => {
      selectedIndex = Math.max(0, selectedIndex - 1);
      updateCards();
    });
    
    rightArrow.addEventListener('click', () => {
      selectedIndex = Math.min(cards.length - 1, selectedIndex + 1);
      updateCards();
    });
    
    updateCards();
    
    const accessToken = getAccessTokenFromUrl();
    
    if (accessToken) {
      const playlistId = '2TuEeBAviJcV42k1pUMTTe';
    
      fetchPlaylist(playlistId, accessToken).then(tracks => {
        tracks.forEach((track, index) => {
          const card = document.getElementById(`card${index + 1}`);
          card.innerHTML = `
            <img src="${track.coverUrl}" alt="${track.name}" />
          `;
    
          card.dataset.trackInfo = JSON.stringify(track);
    
          card.addEventListener('click', () => {
            const trackInfo = JSON.parse(card.dataset.trackInfo);
            updateSongInfo(trackInfo);
          });
        });
    
        const initialTrackInfo = JSON.parse(cards[selectedIndex].dataset.trackInfo);
        updateSongInfo(initialTrackInfo);
      });
    }
    
    const songTitleElement = document.querySelector('.song-title');
    const playButton = document.querySelector('.play-button');
    const currentTimeElement = document.querySelector('.current-time');
    
    const audio = new Audio();
    
    function updateSongInfo(track) {
      songTitleElement.textContent = `${track.name} - ${track.artist}`;
      audio.src = track.previewUrl;
    }
    
    playButton.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playButton.textContent = 'Pause';
      } else {
        audio.pause();
        playButton.textContent = 'Play';
      }
    });
    
    audio.addEventListener('timeupdate', () => {
      const currentTime = audio.currentTime;
      const minutes = Math.floor(currentTime / 60);
      const seconds = Math.floor(currentTime % 60);
      currentTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    });