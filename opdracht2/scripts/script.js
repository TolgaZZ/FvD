async function fetchPlaylist(playlistId, accessToken) {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const data = await response.json();
  return data.items.map(item => ({
    name: item.track.name,
    artist: item.track.artists[0].name,
    coverUrl: item.track.album.images[0].url.replace('640', '300'),
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
let startX;
let startY;
let currentX;
let currentY;
let targetX;

function updateCards() {
  cards.forEach((card, index) => {
    card.style.zIndex = selectedIndex - Math.abs(selectedIndex - index);
    card.classList.remove('selected');
    card.style.transform = `translateX(${(index - selectedIndex) * 50}px) scale(${1 - Math.abs(index - selectedIndex) * 0.1})`;
  });

  cards[selectedIndex].style.zIndex = cards.length;
  cards[selectedIndex].classList.add('selected');
}

function handleStart(e) {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  targetX = 0;
}

function handleMove(e) {
  currentX = e.touches[0].clientX;
  currentY = e.touches[0].clientY;
  targetX = currentX - startX;
  if (Math.abs(targetX) > 10) {
    e.preventDefault();
    cards.forEach(card => {
      card.style.transition = 'none';
      card.style.transform = `translateX(${(card.dataset.index - selectedIndex) * 50 + targetX}px) scale(${1 - Math.abs(card.dataset.index - selectedIndex) * 0.1})`;
    });
  }
}

function handleEnd() {
  if (Math.abs(targetX) > 100) {
    targetX > 0 ? selectedIndex-- : selectedIndex++;
  }
  cards.forEach(card => {
    card.style.transition = '';
    card.style.transform = `translateX(${(card.dataset.index - selectedIndex) * 50}px) scale(${1 - Math.abs(card.dataset.index - selectedIndex) * 0.1})`;
  });
  updateCards();
}

cards.forEach((card, index) => {
  card.dataset.index = index;
  card.addEventListener('click', () => {
    selectedIndex = index;
    updateCards();
  });
  card.addEventListener('touchstart', handleStart);
  card.addEventListener('touchmove', handleMove);
  card.addEventListener('touchend', handleEnd);
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
// Constants
const SWIPE_THRESHOLD = 100;
const SWIPE_ANGLE_THRESHOLD = 30; // in degrees
const CARD_WIDTH = 320; // in pixels

// Variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

cards.forEach((card, index) => {
  card.addEventListener('touchstart', touchStart);
  card.addEventListener('touchmove', touchMove);
  card.addEventListener('touchend', touchEnd);
});

function touchStart(event) {
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
}

function touchMove(event) {
  touchEndX = event.changedTouches[0].screenX;
  touchEndY = event.changedTouches[0].screenY;
}

function touchEnd(event) {
  let deltaX = touchEndX - touchStartX;
  let deltaY = touchEndY - touchStartY;
  let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
  let swipeDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

  if (swipeDistance > SWIPE_THRESHOLD && Math.abs(angle) < SWIPE_ANGLE_THRESHOLD) {
    if (deltaX > 0) {
      selectedIndex = Math.max(0, selectedIndex - 1);
    } else {
      selectedIndex = Math.min(cards.length - 1, selectedIndex + 1);
    }

    updateCards();
  }

  touchStartX = 0;
  touchStartY = 0;
  touchEndX = 0;
  touchEndY = 0;
}
