// VARIABLES
var currentConditionsEl = $(".currentConditions");
var forecastEl = $(".forecast");
var previousSearchesEl = $(".previousSearches");
var cityInput = $(".searchField");
var citySearch = '';
var searchButton = $(".searchbtn");
var queryURL = '';
var currentDayEl = $("#currentDay");
var lat = '';
var lon = '';
var searchedArray = [];


// API
    // https://openweathermap.org/forecast5
    // api key = 19ead611ac1f13b1c00469e35bb98b61
    // sample query = https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={your api key}

currentDayEl.html(moment().format('LLLL'));
loadSearched();

// FUNCTIONS

function loadSearched () {
    // clear out previously added buttons
    previousSearchesEl.empty();
    // get item from local storage
    searchedArray = JSON.parse(localStorage.getItem("searched"));
    // if there is no item, stop
    if (searchedArray === null) {
        return
    // loop through the array    
    } else {
        for (var i = 0; i < searchedArray.length; i++) {
    // create a button for each value and append to the page        
        var psbutton = $("<button>").text(searchedArray[i]).attr({
            class: "psearch",
        
        })
        previousSearchesEl.append(psbutton);
        }
    }
}



function runSearchfromSearch () {
    // clear previously searched weather data
    currentConditionsEl.empty();
    forecastEl.empty();
    // get & store user city input
    citySearch = cityInput.val();
    // create & call initial ajax URL
    coordQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=19ead611ac1f13b1c00469e35bb98b61";
    $.ajax({
        url: coordQueryURL,
        method: "GET"
      }).then(function(r) {
        // get the lat & lon for future use
        lat = r.city.coord.lat;
        lon = r.city.coord.lon;
        // get city name, weather icon, temp, humidity, & windspeed and add to page
        var cityTitle = $("<h2>").text(r.city.name + "   ");
        var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + r.list[0].weather[0].icon + "@2x.png");
        var cityTemp = $("<p>").text("Temperature: " + ((r.list[0].main.temp - 273.15)*1.8+32).toFixed(0) + " degrees fahrenheit");
        var cityHumidity = $("<p>").text("Humidity: " + r.list[0].main.humidity + "%");
        var windSpeed = $("<p>").text("Wind Speed: " + r.list[0].wind.speed + " MPH");
        currentConditionsEl.append(cityTitle.append(weatherIcon), cityTemp, cityHumidity, windSpeed);
        
        // create & call second query for forecast & UVI data using previously gotten lat & lon
        fullQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=19ead611ac1f13b1c00469e35bb98b61";
        $.ajax({
            url: fullQueryURL,
            method: "GET"
        }).then(function(re) {
            console.log(re);
            // get UVindex, add general class
            var uvIndex = $("<p>").text("UV Index: " + re.current.uvi).attr("id", "uv");
            // change new element color based on index #
            if (re.current.uvi < 3) {uvIndex.attr("id", "uv-low")};
            if (re.current.uvi > 8) {uvIndex.attr("id", "uv-high")};
            currentConditionsEl.append(uvIndex);
            // get the forcast array from the ajax call
            var fiveDayForecast = re.daily
            // loop through the array
            for (var i = 1; i < 6; i++) {
                // get date, weather icon, temp & humidity and add to div, append to page
                var fcard = $("<div>").attr("class", "col-lg-2")
                var fdate = $("<h6>").text(moment().add(i,'days').format("L"));
                var ficon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + fiveDayForecast[i].weather[0].icon + "@2x.png");
                var ftemp = $("<p>").text("Temp: " + ((fiveDayForecast[i].temp.day - 273.15)*1.8+32).toFixed(0) + "F");
                var fhumidity = $("<p>").text("Humidity: " + fiveDayForecast[i].humidity + "%");
                forecastEl.append(fcard.append(fdate, ficon, ftemp, fhumidity));
            }
            
        });
    });
    // get item from local storage
    searchedArray = JSON.parse(localStorage.getItem("searched"));
        // if no item, set to an empty array
        if (searchedArray === null) {
            searchedArray = [];
        };
        // add new user input to 
        searchedArray.push(citySearch);
        localStorage.setItem("searched", JSON.stringify(searchedArray));
};
            
function runSearchfromPrevious (cityName) {
    currentConditionsEl.empty();
    forecastEl.empty();
    coordQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=19ead611ac1f13b1c00469e35bb98b61";
    $.ajax({
        url: coordQueryURL,
        method: "GET"
        }).then(function(r) {
        lat = r.city.coord.lat;
        lon = r.city.coord.lon;
        var cityTitle = $("<h2>").text(r.city.name + "   ");
        var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + r.list[0].weather[0].icon + "@2x.png");
        var cityTemp = $("<p>").text("Temperature: " + ((r.list[0].main.temp - 273.15)*1.8+32).toFixed(0) + " degrees fahrenheit");
        var cityHumidity = $("<p>").text("Humidity: " + r.list[0].main.humidity + "%");
        var windSpeed = $("<p>").text("Wind Speed: " + r.list[0].wind.speed + " MPH");
        currentConditionsEl.append(cityTitle.append(weatherIcon), cityTemp, cityHumidity, windSpeed);
        
        fullQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=19ead611ac1f13b1c00469e35bb98b61";
        $.ajax({
            url: fullQueryURL,
            method: "GET"
        }).then(function(re) {
            var uvIndex = $("<p>").text("UV Index: " + re.current.uvi).attr("id", "uv");
            if (re.current.uvi < 3) {uvIndex.attr("id", "uv-low")};
            if (re.current.uvi > 8) {uvIndex.attr("id", "uv-high")};
            currentConditionsEl.append(uvIndex);
            var fiveDayForecast = re.daily
            console.log(fiveDayForecast);
            for (var i = 1; i < 6; i++) {
                var fcard = $("<div>").attr("class", "col-lg-2")
                var fdate = $("<h6>").text(moment().add(i,'days').format("L"));
                var ficon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + fiveDayForecast[i].weather[0].icon + "@2x.png");
                var ftemp = $("<p>").text("Temp: " + ((fiveDayForecast[i].temp.day - 273.15)*1.8+32).toFixed(0) + "F");
                var fhumidity = $("<p>").text("Humidity: " + fiveDayForecast[i].humidity + "%");

                forecastEl.append(fcard.append(fdate, ficon, ftemp, fhumidity));


            }
            
        });
    });
    
}        

// EVENT LISTENERS
searchButton.on("click", function () {
    runSearchfromSearch();
    loadSearched();
});

$(document).on("click", ".psearch", recall);

cityInput.on('keypress', function (e) {
    if (e.which === 13) {
        runSearchfromSearch();
        loadSearched();
    };
});

function recall () {
    runSearchfromPrevious($(this).text());
    loadSearched();
}


















    // currentConditionsEl.empty();
    // citySearch = cityInput.val();
    // coordQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=19ead611ac1f13b1c00469e35bb98b61";
    // $.ajax({
    //     url: coordQueryURL,
    //     method: "GET"
    //   }).then(function(response) {
    //       lat = response.city.coord.lat;
    //       lon = response.city.coord.lon;
    //         uvIndexQuery = "http://api.openweathermap.org/data/2.5/uvi?appid=19ead611ac1f13b1c00469e35bb98b61&lat=" + lat + "&lon=" + lon;
    //         $.ajax({
    //             url: uvIndexQuery,
    //             method: "GET"
    //         }).then(function(response) {
    //             console.log(response);
    //             var uvIndex = $("<p>").text("UV Index: " + response.value).attr("id", "uv");
    //             if (response.value < 3) {
    //                 uvIndex.attr("id", "uv-low");
    //             }
    //             if (response.value > 8) {
    //                 uvIndex.attr("id", "uv-high")
    //             }
                


    //             fullQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=19ead611ac1f13b1c00469e35bb98b61";
    //                 $.ajax({
    //                     url: fullQueryURL,
    //                     method: "GET"
    //                 }).then(function(response) {
    //                     console.log(response);
    //                     var cityTitle = $("<h2>").text(response.city.name + "   ");
    //                     var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@2x.png");
    //                     var cityTemp = $("<p>").text("Temperature: " + ((response.list[0].main.temp - 273.15)*1.8+32).toFixed(0) + " degrees fahrenheit");
    //                     var cityHumidity = $("<p>").text("Humidity: " + response.list[0].main.humidity + "%");
    //                     var windSpeed = $("<p>").text("Wind Speed: " + response.list[0].wind.speed + " MPH");
    //                     currentConditionsEl.append(cityTitle.append(weatherIcon), cityTemp, cityHumidity, windSpeed, uvIndex);
    //                     var fiveDayForecast = response.list;
    //                     for (var i = 1; i<6; i++) {

    //                     }
                    
                    
                    
    //                 });
                
                    
    //         });
    //     });
    // };