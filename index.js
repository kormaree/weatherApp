import conditions from './conditions.js'
const apiKey = '0d2022e0cf27417a91671107242911';

const header = document.querySelector("header")
const inputlongitude = document.querySelector("#input-longitude")
const inputlatitude = document.querySelector("#input-latitude")
const btn = document.querySelector("#btn")

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('button-delete')) {
        const card = event.target.closest('.current-weather');
        if (card) {
            card.remove(); 
        }
    }
});

ymaps.ready().then(initMap);

btn.onclick = async function(e) {
    e.preventDefault();
    let lat = inputlatitude.value.trim();
    let long = inputlongitude.value.trim();

    const data = await getWeather(lat, long);

    if (data.error) {
        showError(data.error.message);
    }
    else {
        const info = conditions.find((obj) => obj.code === data.current.condition.code);
        const fileName = data.current.isday ? info.day : info.night;

        showCard(
            data.location.name,
            data.current.temp_c,
            data.location.localtime,
            fileName
        );

        initMap(lat, long);          
    }
}

async function getWeather(lat, long) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${long}`;

    const responce = await fetch(url);
    const data = await responce.json();
    return data;
}

function showError(errorMessage) {
    const html = `<main class = "main">${errorMessage}</main>`

    header.insertAdjacentHTML('afterend', html);
}

function showCard(name, temp, time, pict) {
    const html = `<div class="current-weather">
                    <div class="current-weather_container_info">
                        <h1>${name}</h1>
                        <h2>Температура: ${temp}</h2>
                        <h2>Местное время: ${time.slice(-5)}</h2>
                    </div>
                    <img class="picture-weather" src="images/${pict}.png" alt="${pict}">
                    <div id="map"></div>
                    <button class="button-delete">Удалить</button>
                </div>`;
    
    header.insertAdjacentHTML('afterend', html);
}

function initMap(lat, long) {
    const map = new ymaps.Map("map", {
        center: [lat, long],
        zoom: 20
    });

    const placemark = new ymaps.Placemark([lat, long]);
    map.geoObjects.add(placemark);
}