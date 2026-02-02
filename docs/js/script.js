import './playList.js';

//-------------------
// Translation
//-------------------
const state = {
    language: ['en', 'ru'],
    photoSource: ['github', 'unsplash', 'flickr'],
    blocks: ['time', 'date','greeting', 'quote', 'weather', 'audio']
}

let language;
let photoSource;
let blocks;
let blocksArray;

// translate greeting en/ru
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

// translate error weather en/ru
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

// translate setting en/ru
const settingTranslation = {
    language: {
        en: "Language: ",
        ru: "Язык: "
    },
    photoSource: {
        en: "Photo Source: ",
        ru: "Источник фото: "
    },
    blocks: {
        en: "View: ",
        ru: "Отобразить: "
    },
    time: {
        en: "Time",
        ru: "Время"
    },
    date: {
        en: "Date",
        ru: "Дата"
    },
    greeting: {
        en: "Greeting",
        ru: "Приветствие"
    },
    quote: {
        en: "Quote",
        ru: "Цитаты"
    },
    weather: {
        en: "Weather",
        ru: "Погода"
    },
    audio: {
        en: "Audio",
        ru: "Аудио"
    }
}

const body = document.body;
const nameUser = document.getElementsByTagName("input")[1];
const city = document.querySelector('.city');
const player = document.querySelector('.player');

// set language in browser
function setLanguage() {
    getLocalStorage();
    if (!language) {
        language = 'en';
        localStorage.setItem('language', language);
    }
    setDefaultCity(language);
}
setLanguage();

// Set Default City
function setDefaultCity(language) {
    getLocalStorage();
    if (localStorage.getItem('city')) {
        if (city.value === weatherTranslation.defaultCity.ru || city.value === weatherTranslation.defaultCity.en) {
            city.value = weatherTranslation.defaultCity[language];
            localStorage.setItem('city', city.value);
        }
    } else {city.value = weatherTranslation.defaultCity[language]}
    getWeather();
}

//#region SettingList;
const settings = document.querySelector('.settings');
const settingsBtn = document.querySelector('.settings-btn');
const settingsIcon = document.querySelector('.settings-icon');
let isOpen = false;

function createSettingList() {
    if (!isOpen) {
        getLocalStorage()

        let divSetting = document.createElement('div');
        divSetting.classList.add('setting-list', 'settings-container');
        settings.prepend(divSetting);
        // create SettingList by object state
        for(let key in state) {
            let div = document.createElement('div');
            div.classList.add('settings-item', 'settings-container');
            divSetting.append(div);

            let attribute = document.createElement('div');
            attribute.classList.add('settings-attribute', 'settings-container');
            div.append(attribute);
            attribute.textContent = settingTranslation[key][language];

            let options = document.createElement('div');
            options.classList.add('settings-value', 'settings-container');
            div.append(options);

            let ul = document.createElement('ul');
            ul.classList.add('settings-options', `${key}`, 'settings-container');
            options.append(ul);

            for(let value of state[key]) {
                let li = document.createElement('li');
                li.classList.add('settings-option', 'settings-container');
                li.setAttribute('id', `${value}`);
                ul.append(li);
                if (settingTranslation[value]) {
                    li.textContent = settingTranslation[value][language];
                } else {li.textContent = value;}

                // check active option from localStorage
                if (localStorage.getItem(`${key}`, value) === value || localStorage.getItem(`${key}`, value).includes(value)) {
                    li.classList.add('settings-active');
                }
            }
        }
        settingsIcon.classList.add('active');

        // function toggle options in setting
        document.querySelector('.setting-list').addEventListener('click', function(e){
            getLocalStorage()
            for(let key in state) {
                for(let value of state[key]) {
                    console.log(e.target)
                    if (e.target.id === value) {
                        const parentUL = e.target.closest('ul');
                        if (!parentUL.classList.contains('blocks')) {
                            if (!e.target.classList.contains('settings-active')) {
                                if (parentUL.classList.contains('language')) {
                                    language = e.target.id;
                                    localStorage.setItem('language', e.target.id);
                                    setDefaultCity(language);
                                    getQuotes(language);
                                    createSettingList(language);
                                }
                                if (parentUL.classList.contains('photoSource')) {
                                    photoSource = e.target.id;
                                    localStorage.setItem('photoSource', e.target.id);
                                    setBg();
                                }
                                const childrenLi = parentUL.children;
                                for(let children of childrenLi) {
                                    children.classList.remove('settings-active');
                                    e.target.classList.add('settings-active');
                                };
                            }
                        } else {
                            setBlocks()
                            if (blocks.has(e.target.id)) {
                                blocks.delete(e.target.id);
                                blocksArray = [...blocks];
                                localStorage.setItem('blocks', blocksArray)
                            } else {
                                blocks.add(e.target.id);
                                blocksArray = [...blocks];
                                localStorage.setItem('blocks', blocksArray)
                            }
                            e.target.classList.toggle('settings-active');
                            checkSetting();
                        }
                    }
                }
            }
        });
        isOpen = true;
    } else {
        document.querySelector('.setting-list').remove();
        settingsIcon.classList.remove('active');
        isOpen = false;
    }
}
settingsBtn.addEventListener('click', createSettingList);

// function close setting-list when click outside setting-list
body.addEventListener("click", e => {
    console.log(e.target)
    if (!e.target.classList.contains('settings-container') && !e.target.classList.contains('settings-btn')) {
        document.querySelector('.setting-list').remove();
        settingsIcon.classList.remove('active');
        isOpen = false;
        }
    }
);
//#endregion

//-------------------
// set time and date
//-------------------
const date = new Date();
const hours = date.getHours();
const timeOfDay = getTimeOfDay(hours);
const time = document.querySelector('.time');
const showedDate = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const greetingContainer = document.querySelector('.greeting-container');

// Show Current Time
function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate();
    showGreeting(timeOfDay);
    setTimeout(showTime, 1000);
}
showTime();

// Show Current Date
function showDate() {
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'};
    const currentDate = date.toLocaleDateString(language, options);
    showedDate.textContent = currentDate;
}

// Show Greeting
function showGreeting(timeOfDay) {
    greeting.textContent = greetingTranslation[timeOfDay][language];
    if (!nameUser.value) {nameUser.placeholder = `[${greetingTranslation.placeholderName[language]}]`}
}

// Choice time of day
function getTimeOfDay(hours) {
    const rate = hours/6;
    if (0 <= rate && rate < 1) { return 'night'; }
    if (1 <= rate && rate < 2) { return 'morning'; }
    if (2 <= rate && rate < 3) { return 'afternoon'; }
    if (3 <= rate && rate < 4) { return 'evening'; }
}

//------------------------
// Background Image
//------------------------
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
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
    localStorage.setItem('photoSource', photoSource);
}
window.addEventListener('load', setBg);

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
const weatherContainer = document.querySelector('.weather');

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
const quotesContainer = document.querySelector('.quotes');
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
document.addEventListener('DOMContentLoaded', getQuotes);

//--------------
// localStorage
//--------------
// Save item in localStorage
function setLocalStorage() {
    localStorage.setItem('language', language);
    localStorage.setItem('name', nameUser.value);
    localStorage.setItem('city', city.value);
    localStorage.setItem('photoSource', photoSource);
}
window.addEventListener('beforeunload', setLocalStorage)

// Get item from localStorage
function getLocalStorage() {
    if(localStorage.getItem('language')) {
        language = localStorage.getItem('language');
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
    if(localStorage.getItem('blocks')) {
        blocksArray = localStorage.getItem('blocks');
    }
}
window.addEventListener('load', getLocalStorage)

//----------------
// Setting
//---------------

function setBlocks() {
    getLocalStorage();
    if (!blocksArray) {
        blocks = new Set(state.blocks);
        blocksArray = [...blocks];
        localStorage.setItem('blocks', blocksArray);
    }
    if (typeof(blocksArray) === 'string') {
        blocksArray = blocksArray.split(',');
        blocks = new Set(blocksArray);
    }
    checkSetting();
}
window.addEventListener('load', setBlocks);

function checkSetting() {
    if (blocks.has('time')) {
        time.classList.remove('time-hidden');
    } else {time.classList.add('time-hidden')}

    if (blocks.has('date')) {
        showedDate.classList.remove('hidden');
    } else {showedDate.classList.add('hidden')}

    if (blocks.has('greeting')) {
        greetingContainer.classList.remove('greeting-hidden');
    } else {greetingContainer.classList.add('greeting-hidden')}

    if (blocks.has('weather')) {
        weatherContainer.classList.remove('hidden');
    } else {weatherContainer.classList.add('hidden')}

    if (blocks.has('audio')) {
        player.classList.remove('hidden');
    } else {player.classList.add('hidden')}

    if (blocks.has('quote')) {
        quotesContainer.classList.remove('quotes-hidden');
    } else {quotesContainer.classList.add('quotes-hidden')}
}