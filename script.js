'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
function renderError(msg) {
  countriesContainer.insertAdjacentHTML('beforeend', msg);
  countriesContainer.style.opacity = 1;
}
function renderData(data, className = '') {
  const html = ` <article class="country ${className}">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        data.population / 1000000
      ).toFixed('1')} Milion</p>
      <p class="country__row"><span>🗣️</span>${
        Object.values(data.languages)[0]
      }</p>
      <p class="country__row"><span>💰</span>${Object.keys(data.currencies)}</p>
    </div>
  </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
}

function getContryBorder(datacode) {
  fetch(`https://restcountries.com/v3.1/alpha/{${datacode}}`)
    .then(response => response.json())
    .then(data => renderData(data));
}

///////////////////////////////////////////

function getContry(contry) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/{${contry}}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.dir(data);

    renderData(data);
  });
}
////////////////////////////////////////////
// getContry('vietnam');
// getContry('japan');
// getContry('spain')

/////////////////Fetch api

// function getContryFetch(contry) {
//   fetch(`https://restcountries.com/v3.1/name/{${contry}}`)
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
//       renderData(data[0]);
//     });
// }

function getContryFetch(contry) {
  fetch(`https://restcountries.com/v3.1/name/${contry}`)
    .then(response => response.json())
    .then(data => {
      renderData(data[0]);
      // console.log(data[0]);
      return fetch(
        `https://restcountries.com/v3.1/alpha/${data[0].borders[0]}`
      );
    })
    .then(response => response.json())
    .then(data => {
      renderData(data[0], 'neighbour');
      // console.log(data[0]);
    })
    .catch(err => {
      console.error(err.message);

      renderError(`Try again⛔⛔⛔. Error:${err.message}`);
    })
    .finally(op => {
      countriesContainer.style.opacity = 1;
    });
}
btn.addEventListener('click', function () {
  getContryFetch('spain');
});

function whereAmI(lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(response => {
      console.log(response);
      if (!response.ok) throw new Error('Reload qua nhanh');

      return response.json();
    })
    .then(data => {
      console.log(data);

      console.log(`You are in ${data.city} ${data.country}`);
    })
    .catch(err => console.error(err.message));
}

// whereAmI(52.508, 13.381);

const a = function (time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};
a(3000)
  .then(() => {
    setTimeout(console.log('4s'), 1000);
    return a(2000);
  })
  .then(() => {
    setTimeout(console.log('4s'), 1000);
    return a(2000);
  })
  .then(() => {
    setTimeout(console.log('4s'), 1000);
    return a(2000);
  })
  .then(() => {
    setTimeout(console.log('4s'), 1000);
    return a(2000);
  });

// function getLocation() {
//   return new Promise(function( resolve(navigator.geolocation),    err => (err = new Error('Khong the truy cap vi tri'))

// )
//   );
// }

function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// getLocation().then(response=>{
// console.log(response);
// {latitude:lat,longitude:lng} = response.coords;
// return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);

// });

getLocation()
  .then(function (response) {
    const { latitude: lat, longitude: lng } = response.coords;
    return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
  })
  .then(response => {
    console.log(response);
    if (!response.ok) throw new Error('Reload qua nhanh');

    return response.json();
  })
  .then(data => {
    getContryFetch(data.country);
    console.log(data);

    console.log(`You are in ${data.city} ${data.country}`);
  })
  .catch(err => console.error(err.message));

function createImage(imgPath) {
  return new Promise((resolve, reject) => {
    let element = document.createElement('img');
    element.src=imgPath;

    resolve((el) => {
      document.querySelector('.images').appendChild(el);
      console.log(el);
    });
  });
}
createImage('img/img-1.jpg');
