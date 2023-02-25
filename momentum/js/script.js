import './playList.js';

//-------------------
// Translation
//-------------------
let language;
let photoSource;
const langBtn = document.querySelector('.lang');
const nameUser = document.getElementsByTagName("input")[1];
const city = document.querySelector('.city');

// const state = {
//     language: 'en',
//     photoSource: ['github', 'unsplash', 'flickr']
//     // blocks: ['time', 'date','greeting', 'quote', 'weather', 'audio', 'todolist']
// }

// function translate greeting en/ru
const greetingTranslation = {
    night: {
        en: "Good night",
        ru: "Доброй ночи"
    },
    morning: {
        en: "Good morning",
        ru: "Доброе утро"
    },
    afternoon: {
        en: "Good afternoon",
        ru: "Добрый день"
    },
    evening: {
        en: "Good evening",
        ru: "Добрый вечер"
    },
    placeholderName: {
        en: " Enter name ",
        ru: " Введите имя "
    }
}

// function translate error weather en/ru
const weatherTranslation = {
    404: {
        en: "Error! City not found for ",
        ru: "Ошибка! Город не найден для "
    },
    400: {
        en: "Error! Nothing to geocode for ",
        ru: "Ошибка! Геокод не введен"
    },
    defaultCity: {
        en: "Minsk",
        ru: "Минск"
    },
    placeholderCity: {
        en: " Enter city ",
        ru: " Введите город "
    },
    windSpeed: {
        text: {
            en: "Wind speed",
            ru: "Скорость ветра"
        },
        quantity: {
            en: "m/s",
            ru: "м/с"
        }
    },
    humidity: {
        en: "Humidity",
        ru: "Влажность"
    }
}

// set language in browser
function setLanguage() {
    getLocalStorage();
    if (!language) {language = 'en'}
    langBtn.textContent = language;
    localStorage.setItem('lang', language);
    if (!city.value) {
        city.value = weatherTranslation.defaultCity[language];
        getWeather();
    }
}
setLanguage();

// toggle language on button
function toggleLanguage() {
    getLocalStorage();
    language = language === 'en' ? 'ru' : 'en';
    langBtn.textContent = language;
    localStorage.setItem('lang', language);
    if (!city.value) {city.value = weatherTranslation.defaultCity[language]}
    if (city.value == weatherTranslation.defaultCity.ru || city.value == weatherTranslation.defaultCity.en) {
        city.value = weatherTranslation.defaultCity[language];
    }
}
langBtn.addEventListener('click', toggleLanguage);

//-------------------
// set time and date
//-------------------
const date = new Date();
const hours = date.getHours();
const timeOfDay = getTimeOfDay(hours);
const time = document.querySelector('.time');
const showedDate = document.querySelector('.date');
const greeting = document.querySelector('.greeting');


// Show Current Time
function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate(date);
    showGreeting(timeOfDay);
    setTimeout(showTime, 1000);
}
showTime();

// Show Current Date
function showDate() {
    const options = {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'};
    const currentDate = date.toLocaleDateString(language, options);
    showedDate.textContent = currentDate;
}

// Show Greeting
function showGreeting() {
    greeting.textContent = greetingTranslation[timeOfDay][language];
    if (!nameUser.value) {nameUser.placeholder = `[${greetingTranslation.placeholderName[language]}]`}
}

// Choice time of day
function getTimeOfDay() {
    const rate = hours/6;
    if (0 <= rate && rate < 1) { return 'night'; }
    if (1 <= rate && rate < 2) { return 'morning'; }
    if (2 <= rate && rate < 3) { return 'afternoon'; }
    if (3 <= rate && rate < 4) { return 'evening'; }
}

// Save greeting name in localStorage
function setLocalStorage() {
    localStorage.setItem('lang', language);
    localStorage.setItem('name', nameUser.value);
    localStorage.setItem('city', city.value);
    localStorage.setItem('photoSource', photoSource);
}
window.addEventListener('beforeunload', setLocalStorage)

// Get greeting name from localStorage
function getLocalStorage() {
    if(localStorage.getItem('lang')) {
        language = localStorage.getItem('lang');
    }
    if(localStorage.getItem('name')) {
        nameUser.value = localStorage.getItem('name');
    }
    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
    }
    if(localStorage.getItem('photoSource')) {
        photoSource = localStorage.getItem('photoSource');
    }
}
window.addEventListener('load', getLocalStorage)

//------------------------
// Background Image
//------------------------
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const imgSource = document.querySelector('.img-source');
const body = document.body;
let randomNum = getRandomNum(1, 20);

// function create random number image included min and max
function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Set background Image
function setBg(randomNum) {
    getLocalStorage();
    switch (photoSource) {
        case 'github':
            setBgGithub(randomNum);
            break;
        case 'unsplash':
            getImageUnsplash(randomNum);
            break;
        case 'flickr':
            getImageFlickr(randomNum);
            break;
        default:
            photoSource = 'github';
            setBgGithub(randomNum);
    }
    imgSource.textContent = photoSource;
    localStorage.setItem('photoSource', photoSource);
}
window.addEventListener('load', setBg);

// toggle photoSource on button
function togglePhotoSource() {
    getLocalStorage();
    photoSource = (photoSource === 'github') ? 'unsplash' : (photoSource === 'unsplash') ? 'flickr' : 'github';
    imgSource.textContent = photoSource;
    localStorage.setItem('photoSource', photoSource);
    setBg();
}
imgSource.addEventListener('click', togglePhotoSource);

// function getSlideNext
function getSlideNext() {
    (randomNum === 20) ? randomNum = 1 : randomNum += 1;
    setBg(randomNum);
}
slideNext.addEventListener('click', getSlideNext)

// function getSlidePrev
function getSlidePrev() {
    (randomNum == 1) ? randomNum = 20 : randomNum -= 1;
    setBg(randomNum);
}
slidePrev.addEventListener('click', getSlidePrev)

// Show background Image from Github
function setBgGithub() {
    const img = new Image();
    const bgNum = randomNum.toString().padStart(2,'0');
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {
      body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`;
      body.style.backgroundSize = 'cover';
    };
}

// Get background Image from Unsplash
async function getImageUnsplash() {
    const url = `https://api.unsplash.com/search/photos?query=${timeOfDay},nature&per_page=20&orientation=landscape&client_id=mVmC8bOmEn8XT4AtzUNuuaeYCnjUJCKyamkqZ8MgHPE`
    const res = await fetch(url);
    const unsplash = await res.json();

    showImageUnsplash(unsplash);
}

// Show background Image from Unsplash
function showImageUnsplash(unsplash) {
    const img = new Image();
    const bgNum = randomNum-1;
    img.src = unsplash.results[bgNum].urls.regular;
    img.onload = () => {
      body.style.backgroundImage = `url('${unsplash.results[bgNum].urls.regular}')`;
      body.style.backgroundSize = 'cover';
    };
}

// Get background Image from flickr
async function getImageFlickr() {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&per_page=20&orientation=landscape&api_key=eef9bb652324a6e67361c2bc1ff26004&tags=${timeOfDay},nature&tag_mode=all&extras=url_m&format=json&nojsoncallback=1`
    const res = await fetch(url);
    const flickr = await res.json();

    showImageFlickr(flickr);
}

// Show background Image from flickr
function showImageFlickr(flickr) {
    const img = new Image();
    const bgNum = randomNum-1;
    img.src = flickr.photos.photo[bgNum].url_m;
    img.onload = () => {
      body.style.backgroundImage = `url('${flickr.photos.photo[bgNum].url_m}')`;
      body.style.backgroundSize = 'cover';
    };
}

//------------------
// Widget of Weather
//------------------
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const windSpeed = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');

// function getWeather
async function getWeather() {
    getLocalStorage();
    if (!city.value) {city.placeholder = `[${weatherTranslation.placeholderCity[language]}]`}
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${language}&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
    const res = await fetch(url);
    const weather = await res.json();
    if (weather.cod == '404' || weather.cod == '400') {
        weatherIcon.className = 'weather-icon owf';
        temperature.textContent = ``;
        weatherDescription.textContent =  ``;
        windSpeed.textContent =  ``;
        humidity.textContent =  ``;
        if (weather.cod == '404') {
            weatherError.textContent = `${weatherTranslation[404][language]}'${city.value}'!`;
        }
        if (weather.cod == '400') {
            weatherError.textContent = `${weatherTranslation[400][language]}!`;
        }
    } else {
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${weather.weather[0].id}`);
        temperature.textContent = `${weather.main.temp.toFixed(0)}°C`;
        weatherDescription.textContent = weather.weather[0].description;
        windSpeed.textContent = `${weatherTranslation.windSpeed.text[language]}: ${weather.wind.speed.toFixed(0)} ${weatherTranslation.windSpeed.quantity[language]}`;
        humidity.textContent = `${weatherTranslation.humidity[language]}: ${weather.main.humidity.toFixed(0)} %`;
    }
}

// function set city after Enter in input
function setCity(event) {
    if (event.code === 'Enter') {
        setLocalStorage();
        getLocalStorage();
        getWeather();
        city.blur();
    }
}

// getWeather after click
onclick = () => {
    setLocalStorage();
    getLocalStorage();
    getWeather();
};

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
window.addEventListener('click', onclick);

//------------------
// Quotes
//------------------
const textQuote = document.querySelector('.quote');
const authorQuote = document.querySelector('.author');
const changeQuoteBtn = document.querySelector('.change-quote');
let randomQuote;

// function get quotes from json
async function getQuotes() {
    const quotes = './js/data.json';
    const res = await fetch(quotes);
    const data = await res.json();
    showQuotes(data);
}
getQuotes();

// function show quotes on page
function showQuotes(data) {
    let quoteNum = getRandomNum(0, 95);
    // check the same quotes after onload
    while (randomQuote === quoteNum) {
        quoteNum = getRandomNum(0, 95);
    }
    randomQuote = quoteNum;

    textQuote.textContent = `"${data[language][randomQuote].text}"`;
    authorQuote.textContent = data[language][randomQuote].author;
}

changeQuoteBtn.addEventListener('click', getQuotes);
langBtn.addEventListener('click', getQuotes);
document.addEventListener('DOMContentLoaded', getQuotes);


