module.exports = fetchCountries;

const BASE_URL = 'https://restcountries.com/v3.1/name/';
const options = 'fields=name,capital,population,flags,languages'

function fetchCountries(query)
{
    const countryName = query;

    if (countryName == '') {
        return;
    }
    return fetch(`${BASE_URL}/${countryName}?${options}`)
    .then((response) => {
        return response.json()})
    .then((response) =>
    {        
        return response;
    })
    .catch((error) => {return error})
    .catch((TypeError) => {return TypeError})
}