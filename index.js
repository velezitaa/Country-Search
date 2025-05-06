const searchInput = document.querySelector('#search');
const container = document.querySelector('.container');
const body = document.querySelector('.main');
const loader = document.querySelector('.loader'); 
const formContainer = document.querySelector('.form-container');
const title = document.querySelector('.title');

// Los paises descargados desde la api se guardan en el array de countries
// La api deberia pedirse solo una vez
// Usar este array para crear el filtrado
let countries = [];

// Funcion que pide todos los paises
const getCountries = async () => {
  try {
    // Deberia estar la funcion para pedir los paises
    
    container.innerHTML = `
    <div class="loader"></div>
    `;

    // const url = 'https://restcountries.com/v3.1/all';
    // const response = await fetch(url, { method: 'GET' });
    // const data = await response.json();
    
    // Llamada API de los paises
    const response = await (await fetch (`https://restcountries.com/v3.1/all`)).json();
    // console.log(response);

    countries = response;
    // console.log(countries);

  } catch (error) {
    console.log(error);
  }
}

getCountries();

searchInput.addEventListener('input', async e => {
  // Busqueda en tiempo real mientras el usuario escribe
  const query = e.target.value.toLowerCase();

  // La funcion del filtrado
  const countriesFilter = countries.filter((country) => country.translations.spa.common.toLowerCase().startsWith(query));
  console.log(countriesFilter);

  // Limpiar el contenedor antes de mostrar los resultados
  container.innerHTML = '';

  // Renderizar los paises:
  // 1. Si no hay nada escrito en el input, no hacer nada
  if (query === '') {
    return;

  // 2. Si hay mas de 10 resultados, mostrar un mensaje
  } else if (countriesFilter.length > 10) {
    container.innerHTML = `
    <p class="country-helper-text">Por favor, sea más específico</p>
    `;

  // 3. Si hay 10 o menos resultados, mostrarlos en miniatura
  } else if (countriesFilter.length > 1 && countriesFilter.length <= 10) {
  // Recorrer el array de paises uno por uno
    countriesFilter.forEach(country => {
  //  Crear el div
    const div = document.createElement('div');
    div.className = 'country-container-min';
  // Contenido del div
    div.innerHTML = `
    <img class="country-img-min" src="${country.flags.svg}" alt="Bandera de ${country.translations.spa.common}" >
    <h2 class="country-name-min">${country.translations.spa.common}</h2>
    `;
    // Agregar div al contenedor
    container.appendChild(div);
    console.log(div);
    })

  // 4. Si un solo pais concuerda, mostrar todos los datos
  } else if (countriesFilter.length === 1) {

    // Obtener el pais del array q coincide con el input
    const country = countriesFilter[0];
    // console.log(country);

    // Contenido del container
    container.innerHTML = `
    <div class="country-container-max">
      <div class="country-principal-info">
    <h2 class="country-name-max">${country.translations.spa.common}</h2>
    <img class="country-img-max" src="${country.flags.svg}" alt="Bandera de ${country.translations.spa.common}" >
      </div>
      <div class="country-info-container">
    <p class="country-info">Capital: ${country.capital}</p>
    <p class="country-info">Habitantes: ${country.population.toLocaleString()}</p>
    <p class="country-info">Continente: ${country.continents}</p>
    <p class="country-info">Región: ${country.subregion}</p>
    <p class="country-info">Zona Horaria: ${country.timezones}</p>
    <div id="weather-info">
        <p>Cargando información del clima...</p>
    </div>
      </div>
    </div>
    `;

    try {
    // Llamada API del clima
    const apiKey = '77f7ab6c0dd4a6615ae6fda09523b054';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${apiKey}&units=metric&lang=es`;
    const weatherResponse = await fetch(weatherUrl);
    const dataWeather = await weatherResponse.json();
    // console.log(dataWeather);

    const weatherInfo = document.getElementById('weather-info');
      weatherInfo.innerHTML = `
      <p class="country-info">Temperatura: ${dataWeather.main.temp}°Celsius</p>
        <div class="weather-icon-container">
      <p class="country-info">Clima: ${dataWeather.weather[0].description}</p>
      <img class="weather-icon" src="http://openweathermap.org/img/w/${dataWeather.weather[0].icon}.png" alt="Icono clima">
        </div>
      `;

    } catch (error) {
      console.log(error);
    }

   }

});

