const playList = [
    {
      title: 'Aqua Caelestis',
      src: '../momentum/assets/sounds/Aqua Caelestis.mp3',
      duration: '00:58'
    },
    {
      title: 'River Flows In You',
      src: '../momentum/assets/sounds/River Flows In You.mp3',
      duration: '03:50'
    },
    {
      title: 'Ennio Morricone',
      src: '../momentum/assets/sounds/Ennio Morricone.mp3',
      duration: '01:37'
    },
    {
      title: 'Summer Wind',
      src: '../momentum/assets/sounds/Summer Wind.mp3',
      duration: '01:50'
    }
  ]
  export default playList;

//-----------------
// Audio player
//-----------------
const audio = new Audio();
const playBtn = document.querySelector('.play');
const playNextBtn = document.querySelector('.play-next');
const playPrevBtn = document.querySelector('.play-prev');
const playListContainer = document.querySelector('.play-list');

let isPlay = false;
let playNum = 0;

createPlayList();

// Create Audio player
function createPlayList() {
    playList.forEach(el => {
        const li = document.createElement('li');
        li.classList.add('play-item');
        playListContainer.append(li);
        li.textContent = el.title;
    })
}

// Play/pause track
function playAudio() {
    audio.src = playList[playNum].src;
    if(!isPlay) {
        audio.currentTime = 0;
        audio.play();
        isPlay = true;
        playNow();
    } else {
        audio.pause();
        isPlay = false;
    }
}
playBtn.addEventListener('click', playAudio);

// Check current track by style
function playNow() {
    const playItems = document.querySelectorAll('.play-item');
    playItems.forEach (li => {
        li.classList.remove('item-active');
        playItems[playNum].classList.add('item-active');
    })
}

// Play next track after the end previous track
audio.onended = function(){
    playNext();
  }

// Switch icon player Play/Pause
function toggleBtn() {
    if(!isPlay) {
        playBtn.classList.remove('pause');
    } else {playBtn.classList.add('pause');}
}
playBtn.addEventListener('click', toggleBtn);

// function play next track
function playNext() {
    if (playNum == playList.length-1) {
        playNum = 0;
    } else {
        playNum += 1;
    }
    isPlay = false;
    playAudio();
    toggleBtn();
}
playNextBtn.addEventListener('click', playNext);

// function play previous track
function playPrev() {
    if (playNum == 0) {
        playNum = playList.length-1;
    } else {
        playNum -= 1;
    }
    isPlay = false;
    playAudio();
    toggleBtn();
}
playPrevBtn.addEventListener('click', playPrev);