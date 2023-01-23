const form = document.querySelector("form");
const input = document.querySelector("input");
let res;
let res2;
let res3;
let res4;
let res5;
let timeAPI;
let latitude;
let longitude;
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const cityName = input.value;
  const config = {
    params: {
      q: cityName,
      limit: 1,
      appid: "//ReplaceKey",
    },
  };
  res = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?`,
    config
  );
  latitude = res.data[0].lat;
  longitude = res.data[0].lon;
  const config2 = {
    params: {
      lat: latitude,
      lon: longitude,
      appid: "//ReplaceKey",
    },
  };
  res2 = await axios.get(
    `http://api.openweathermap.org/data/2.5/forecast?`,
    config2
  );
  const config3 = {
    params: {
      lat: latitude,
      lon: longitude,
      appid: "//ReplaceKey",
    },
  };
  res3 = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?`,
    config3
  );
  const config4 = {
    params: {
      lat: latitude,
      lon: longitude,
      appid: "//ReplaceKey",
    },
  };
  res4 = await axios.get(
    "https://api.openweathermap.org/data/3.0/onecall?",
    config4
  );
  getPlace();
  input.value = "";
});

function getCurrentForecast() {
  const temperature = res4.data.hourly[0].temp - 273.15;
  return Math.round(temperature);
}

function getPlace() {
  const weatherDiv = document.querySelector("#weatherDiv");
  weatherDiv.style.display = "block";

  const weatherImageDiv = document.querySelector("#weatherImageDiv");
  weatherImageDiv.style.display = "block";

  const cityName = document.querySelector("#cityName");
  cityName.innerHTML = res.data[0].name;

  const currentTemperature = document.querySelector("#currentTemperature");
  currentTemperature.innerHTML = getCurrentForecast() + "&#x1D52;" + "C";

  const getWind = document.querySelector("#wind");
  getWind.innerHTML = `Wind: ${getWinds()} mph`;

  const getMinTemp = document.querySelector("#lowTemp");
  getMinTemp.innerHTML = getTempMin() + "&#x1D52;" + "C";

  const getMaxTemp = document.querySelector("#highTemp");
  getMaxTemp.innerHTML = " " + getTempMax() + "&#x1D52;" + "C";
  const getDateTime = document.querySelector("#dateTime");
  getDateTime.innerHTML = `${getDate()} ${getTime()}`;
  const getWeatherDescription = document.querySelector("#weatherDescription");
  getWeatherDescription.innerHTML = getWeatherDescrip();
  const weeklyDays = document.querySelector("#otherDays");
  weeklyDays.style.display = "flex";
  getWeeklyDates();
  getWeeklyTemperatures();
  const weatherImg = document.querySelector("#weatherImage");
  setWeatherImagesMain(getWeatherMain(), weatherImg);
  setWeatherImages(getWeatherDescrip(), weatherImg);
  setOtherDaysImages();

  function getWinds() {
    let wind = res3.data.wind.speed;
    return Math.round(wind);
  }

  function getTempMin() {
    let min = res4.data.daily[0].temp.min - 273.15;
    return Math.round(min);
  }

  function getTempMax() {
    let max = res4.data.daily[0].temp.max - 273.15;
    return Math.round(max);
  }

  function getWeatherMain() {
    return res3.data.weather[0].main;
  }

  function getWeatherDescrip() {
    return res3.data.weather[0].description;
  }

  function setWeatherImages(description, image) {
    if (description === "few clouds") {
      image.src = "Images/few-clouds.png";
    } else if (
      description === "scattered clouds" ||
      description === "broken clouds"
    ) {
      image.src = "Images/scattered-broken.png";
    } else if (description === "overcast clouds") {
      image.src = "Images/overcast.png";
    } else if (
      description === "light rain" ||
      description === "moderate rain" ||
      description === "freezing rain" ||
      description === "light intensity rain shower"
    ) {
      image.src = "Images/rain.png";
    } else if (
      description === "heavy intensity rain" ||
      description === "very heavy rain" ||
      description === "extreme rain" ||
      description === "shower rain" ||
      description === "heavy intensity shower rain" ||
      description === "ragged shower rain"
    ) {
      image.src = "Images/heavyRain.png";
    } else if (
      description === "Sleet" ||
      description === "Light shower sleet" ||
      description === "Shower sleet" ||
      description === "Sleet" ||
      description === "Light rain and snow"
    ) {
      image.src = "Images/sleet.png";
    }
  }

  function setWeatherImagesMain(main, image) {
    if (main === "Thunderstorm") {
      image.src = "Images/thunderstorm.png";
    } else if (main === "Drizzle") {
      image.src = "Images/drizzle.png";
    } else if (main === "Snow") {
      image.src = "Images/snow.png";
    } else if (main === "Clear") {
      image.src = "Images/clearSky.png";
    } else if (
      main === "Mist" ||
      main === "Smoke" ||
      main === "Haze" ||
      main === "Dust" ||
      main === "Fog" ||
      main === "Sand" ||
      main === "Dust" ||
      main === "Ash" ||
      main === "Squall" ||
      main === "Tornado"
    ) {
      image.src = "Images/mist.png";
    }
  }

  function setOtherDaysImages() {
    const day1 = document.querySelector("#otherDayImage1");
    const day2 = document.querySelector("#otherDayImage2");
    const day3 = document.querySelector("#otherDayImage3");
    const day4 = document.querySelector("#otherDayImage4");
    const day5 = document.querySelector("#otherDayImage5");

    setWeatherImages(res4.data.daily[1].weather[0].description, day1);
    setWeatherImages(res4.data.daily[2].weather[0].description, day2);
    setWeatherImages(res4.data.daily[3].weather[0].description, day3);
    setWeatherImages(res4.data.daily[4].weather[0].description, day4);
    setWeatherImages(res4.data.daily[5].weather[0].description, day5);

    setWeatherImagesMain(res4.data.daily[1].weather[0].main, day1);
    setWeatherImagesMain(res4.data.daily[2].weather[0].main, day2);
    setWeatherImagesMain(res4.data.daily[3].weather[0].main, day3);
    setWeatherImagesMain(res4.data.daily[4].weather[0].main, day4);
    setWeatherImagesMain(res4.data.daily[5].weather[0].main, day5);
  }

  function getWeeklyTemperatures() {
    const highDay1 = document.querySelector("#day1HighTemp");
    const lowDay1 = document.querySelector("#day1LowTemp");
    highDay1.innerHTML =
      `${Math.round(res4.data.daily[1].temp.max - 273.15)}` + "&#x1D52;" + "C";
    lowDay1.innerHTML =
      `${Math.round(res4.data.daily[1].temp.min - 273.15)}` + "&#x1D52;" + "C";
    const highDay2 = document.querySelector("#day2HighTemp");
    const lowDay2 = document.querySelector("#day2LowTemp");
    highDay2.innerHTML =
      `${Math.round(res4.data.daily[2].temp.max - 273.15)}` + "&#x1D52;" + "C";
    lowDay2.innerHTML =
      `${Math.round(res4.data.daily[2].temp.min - 273.15)}` + "&#x1D52;" + "C";
    const highDay3 = document.querySelector("#day3HighTemp");
    const lowDay3 = document.querySelector("#day3LowTemp");
    highDay3.innerHTML =
      `${Math.round(res4.data.daily[3].temp.max - 273.15)}` + "&#x1D52;" + "C";
    lowDay3.innerHTML =
      `${Math.round(res4.data.daily[3].temp.min - 273.15)}` + "&#x1D52;" + "C";
    const highDay4 = document.querySelector("#day4HighTemp");
    const lowDay4 = document.querySelector("#day4LowTemp");
    highDay4.innerHTML =
      `${Math.round(res4.data.daily[4].temp.max - 273.15)}` + "&#x1D52;" + "C";
    lowDay4.innerHTML =
      `${Math.round(res4.data.daily[4].temp.min - 273.15)}` + "&#x1D52;" + "C";
    const highDay5 = document.querySelector("#day5HighTemp");
    const lowDay5 = document.querySelector("#day5LowTemp");
    highDay5.innerHTML =
      `${Math.round(res4.data.daily[5].temp.max - 273.15)}` + "&#x1D52;" + "C";
    lowDay5.innerHTML =
      `${Math.round(res4.data.daily[5].temp.min - 273.15)}` + "&#x1D52;" + "C";
  }

  function getWeeklyDates() {
    const date1 = new Date(
      (res4.data.daily[1].dt + res4.data.timezone_offset) * 1000
    );
    const date2 = new Date(
      (res4.data.daily[2].dt + res4.data.timezone_offset) * 1000
    );
    const date3 = new Date(
      (res4.data.daily[3].dt + res4.data.timezone_offset) * 1000
    );
    const date4 = new Date(
      (res4.data.daily[4].dt + res4.data.timezone_offset) * 1000
    );
    const date5 = new Date(
      (res4.data.daily[5].dt + res4.data.timezone_offset) * 1000
    );
    const getDay1 = document.querySelector("#day1");
    const getDay2 = document.querySelector("#day2");
    const getDay3 = document.querySelector("#day3");
    const getDay4 = document.querySelector("#day4");
    const getDay5 = document.querySelector("#day5");
    getDay1.innerHTML = `${date1.getDate()}/${date1.getMonth() + 1}`;
    getDay2.innerHTML = `${date2.getDate()}/${date2.getMonth() + 1}`;
    getDay3.innerHTML = `${date3.getDate()}/${date3.getMonth() + 1}`;
    getDay4.innerHTML = `${date4.getDate()}/${date4.getMonth() + 1}`;
    getDay5.innerHTML = `${date5.getDate()}/${date5.getMonth() + 1}`;

    if (
      (date1.getMonth() + 1 < 10 && date1.getDate() < 10) ||
      (date2.getMonth() + 1 < 10 && date2.getDate() < 10) ||
      (date3.getMonth() + 1 < 10 && date3.getDate() < 10) ||
      (date4.getMonth() + 1 < 10 && date4.getDate() < 10) ||
      (date5.getMonth() + 1 < 10 && date5.getDate() < 10)
    ) {
      getDay1.innerHTML = `0${date1.getDate()}/0${date1.getMonth() + 1}`;
      getDay2.innerHTML = `0${date2.getDate()}/0${date2.getMonth() + 1}`;
      getDay3.innerHTML = `0${date3.getDate()}/0${date3.getMonth() + 1}`;
      getDay4.innerHTML = `0${date4.getDate()}/0${date4.getMonth() + 1}`;
      getDay5.innerHTML = `0${date5.getDate()}/0${date5.getMonth() + 1}`;
    } else if (
      date1.getMonth() + 1 < 10 ||
      date2.getMonth() + 1 < 10 ||
      date3.getMonth() + 1 < 10 ||
      date4.getMonth() + 1 < 10 ||
      date5.getMonth() + 1 < 10
    ) {
      getDay1.innerHTML = `${date1.getDate()}/0${date1.getMonth() + 1}`;
      getDay2.innerHTML = `${date2.getDate()}/0${date2.getMonth() + 1}`;
      getDay3.innerHTML = `${date3.getDate()}/0${date3.getMonth() + 1}`;
      getDay4.innerHTML = `${date4.getDate()}/0${date4.getMonth() + 1}`;
      getDay5.innerHTML = `${date5.getDate()}/0${date5.getMonth() + 1}`;
    } else if (
      date1.getDate() < 10 ||
      date2.getDate() < 10 ||
      date3.getDate() < 10 ||
      date4.getDate() < 10 ||
      date5.getDate() < 10
    ) {
      getDay1.innerHTML = `0${date1.getDate()}/${date1.getMonth() + 1}`;
      getDay2.innerHTML = `0${date2.getDate()}/${date1.getMonth() + 1}`;
      getDay3.innerHTML = `0${date3.getDate()}/${date1.getMonth() + 1}`;
      getDay4.innerHTML = `0${date4.getDate()}/${date1.getMonth() + 1}`;
      getDay5.innerHTML = `0${date5.getDate()}/${date1.getMonth() + 1}`;
    }
  }

  function getDate() {
    const date = new Date(
      (res4.data.hourly[0].dt + res4.data.timezone_offset) * 1000
    );
    let day;
    let d = date.getDay();

    switch (d) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
        break;
    }
    return day;
  }

  function getTime() {
    const date = new Date(
      (res4.data.hourly[0].dt + res4.data.timezone_offset * 60) * 1000
    );
    const hours = date.getHours();

    let hour;
    if (hours < 10) {
      hour = "0" + date.getHours();
    } else {
      hour = date.getHours();
    }
    return `${hour}:00`;
  }
}
