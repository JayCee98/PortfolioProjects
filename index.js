const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const voice = document.querySelector('.voice button');

const startButton = document.getElementById('startButton');
const convertedText = document.getElementById('convertedText');

function startSearch(city) {
  const APIKey = '7c03d65bce701e7556db809f80fe7006';

  if (city === '') return;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => response.json())
    .then(json => {
      console.log(json);

      if (json.cod === '404') {
        container.style.height = '400px';
        weatherBox.style.display = 'none';
        weatherDetails.style.display = 'none';
        error404.style.display = 'block';
        error404.classList.add('fadeIn');
        return;
      }

      error404.style.display = 'none';
      error404.classList.remove('fadeIn');

      const image = document.querySelector('.weather-box img');
      const temperature = document.querySelector('.weather-box .temperature');
      const description = document.querySelector('.weather-box .description');
      const humidity = document.querySelector('.weather-details .humidity span');
      const wind = document.querySelector('.weather-details .wind span');

      switch (json.weather[0].main) {
        case 'Clear':
          image.src = 'images/clear.png';
          break;

        case 'Rain':
          image.src = 'images/rain.png';
          break;

        case 'Snow':
          image.src = 'images/snow.png';
          break;

        case 'Clouds':
          image.src = 'images/cloud.png';
          break;

        case 'Haze':
          image.src = 'images/mist.png';
          break;

        default:
          image.src = '';
      }

      temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
      description.innerHTML = `${json.weather[0].description}`;
      humidity.innerHTML = `${json.main.humidity}%`;
      wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

      weatherBox.style.display = '';
      weatherDetails.style.display = '';
      weatherBox.classList.add('fadeIn');
      weatherDetails.classList.add('fadeIn');
      container.style.height = '590px';
    });
}

let recognition;

// Función para iniciar el reconocimiento de voz y realizar la búsqueda por voz
function startRecognition() {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
  recognition.lang = 'es-ES'; // Configura el idioma para el reconocimiento (puedes cambiarlo según tus necesidades)

  // Deshabilitar el botón de inicio mientras el reconocimiento de voz está en curso
  startButton.disabled = true;
  convertedText.placeholder = 'Escuchando...';

  // Evento que se dispara cuando el reconocimiento de voz obtiene un resultado
  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    convertedText.value = result;
    convertedText.placeholder = 'Habla para convertir a texto...';
    startButton.disabled = false; // Habilitar el botón de inicio cuando el reconocimiento de voz finaliza
    startSearch(result); // Llamar a la función de búsqueda con el resultado del reconocimiento de voz
  };

  // Evento para manejar errores en el reconocimiento de voz
  recognition.onerror = (event) => {
    console.error('Error en el reconocimiento de voz:', event.error);
    convertedText.placeholder = 'Ha ocurrido un error, inténtalo nuevamente...';
    startButton.disabled = false; // Habilitar el botón de inicio en caso de error
  };

  recognition.start();
}

// Agregar evento al botón de búsqueda por voz
voice.addEventListener('click', () => {
  startRecognition();
});

// Agregar evento al botón de búsqueda normal
search.addEventListener('click', () => {
  const city = document.querySelector('.search-box input').value;
  startSearch(city);
});
