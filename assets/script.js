// VARIABLES
var currentConditionsEl = $(".currentConditions");
var forecastEl = $(".forecast");
var previousSearchesEl = $(".previousSearches");
var cityInput = $(".searchField");
var citySearch = '';
var searchButton = $(".searchbtn");
var citiesSearched = [];
var queryURL = '';
var currentDayEl = $("#currentDay");





// API
    // https://openweathermap.org/forecast5
    // api key = 19ead611ac1f13b1c00469e35bb98b61
    // sample query = https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={your api key}

currentDayEl.html(moment().format('LLLL'));

// EVENT LISTENERS
searchButton.on("click", runSearch);




// FUNCTIONS

function runSearch () {
    citySearch = cityInput.val();
    queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=19ead611ac1f13b1c00469e35bb98b61"
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
          console.log(response);
          var cityTitle = $("<h2>").text(response.city.name + "   ");
          var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@2x.png");
          var cityTemp = $("<p>").text("Temperature: " + ((response.list[0].main.temp - 273.15)*1.8+32).toFixed(0) + " degrees fahrenheit");
          var cityHumidity = $("<p>").text("Humidity: " + response.list[0].main.humidity + "%");
          var windSpeed = $("<p>").text("Wind Speed: " + response.list[0].wind.speed + " MPH");
          var uvIndex = $("<p>").text()
          
          
          
          currentConditionsEl.append(cityTitle.append(weatherIcon), cityTemp, cityHumidity, windSpeed, uvIndex);
})};







