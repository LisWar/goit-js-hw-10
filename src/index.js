import './css/styles.css';
import fetchCountries from './fetchCountries';
import Notiflix from 'notiflix';
var _ = require('lodash');

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
}

// const demoCanada = [{"flags":{"png":"https://flagcdn.com/w320/ca.png","svg":"https://flagcdn.com/ca.svg","alt":"The flag of Canada is composed of a red vertical band on the hoist and fly sides and a central white square that is twice the width of the vertical bands. A large eleven-pointed red maple leaf is centered in the white square."},"name":{"common":"Canada","official":"Canada","nativeName":{"eng":{"official":"Canada","common":"Canada"},"fra":{"official":"Canada","common":"Canada"}}},"capital":["Ottawa"],"altSpellings":["CA"],"languages":{"eng":"English","fra":"French"},"population":38005238}];
// const demoUkraine = [{"flags": {"png": "https://flagcdn.com/w320/ua.png","svg": "https://flagcdn.com/ua.svg","alt": "The flag of Ukraine is composed of two equal horizontal bands of blue and yellow."},"name": {"common": "Ukraine","official": "Ukraine","nativeName": {"ukr": {"official": "Україна","common": "Україна"}}},"capital": ["Kyiv"],"altSpellings": ["UA","Ukrayina"],"languages": {"ukr": "Ukrainian"},"population": 44134693}];
// demoTwo = [demoCanada, demoUkraine];
// showInfo(demoCanada);
// showInfo(demoUkraine);
// showList(demoTwo)

refs.input.addEventListener('input', _.debounce(getCountries, DEBOUNCE_DELAY))

function getCountries({target}) {
    // console.log(' getCountries target: ', target);
    const query = target.value.trim();
    if (query == '') {
        clearOutput();
        return;
    }
    
    try {
    fetchCountries(query)
    .then((response) => evaluateResponse(response))
    .catch((error) => console.log(error))
    } catch (TypeError) {
        evaluateResponse(undefined)
    }
}

function showInfo(country) {
    clearOutput()

    const data = country[0];
    const languageObj = data.languages;

    const markup = `
    <p class="list-name"><img src=${data.flags.svg} alt="${data.name.official} flag" width="40" style="margin-right: 20px;">${data.name.official}</p>
    <ul class="list-info">
        <li><b>Capital: </b>${data.capital}</li>
        <li><b>Population: </b>${data.population}</li>
        <li><b>Languages: </b>`+Object.values(languageObj).join(', ')+`</li>
    </ul>
    `

    refs.info.innerHTML = markup;
}

function showList(data) {
    clearOutput()

    // console.log('refs.list: ', refs.list);
    // refs.list.addEventListener('click', (e) => {listClick(e);})

    data.forEach(country => {   
        const markup = `
        <li class="list-item">
        <p ><img src=${country.flags.svg} alt="${country.name.official} flag" width="20" style="margin-right: 20px;">${country.name.official}</p>
        </li>
        `
        refs.list.insertAdjacentHTML("beforeend", markup);
    });
}

function evaluateResponse(response) {
    if (response === undefined) {
        return;
    }

    const len = response.length;

    if (len > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        clearOutput()
        return;
    }
    if (len > 1) {
        showList(response)
        return;
    }
    if (len === 1) {
        showInfo(response)
        return;
    }
    if (len === undefined) {
        clearOutput()
        Notiflix.Notify.failure("Oops, there is no country with that name")
        return;
    }
    
}

function clearOutput() {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
}

// function listClick({target}) {
    
//     console.log('target: ', target);
//     if (target.textContent == '') {
//         return;
//     }
//     console.log('listClick target: ', target);
//     refs.input.value = target.textContent
//     console.log('refs.input CLICK: ', refs.input.value);
//     refs.input.fireEvent('input');
//     // getCountries(refs.input);
// }