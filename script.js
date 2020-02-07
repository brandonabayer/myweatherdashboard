$(document).ready(function() {
    $("#search-button").on("click", function() {
        var searchLocation = $("#search-location").val();

        console.log(searchLocation);
        // empty search box
        $("#search-location").val("");

        searchWeather(searchLocation);
    });

    $(".history").on("click", "li", function() {
        searchWeather($(this).text());
    });

    function newRow(text){
        var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
        $(".history").append(li);
    }

    function searchWeather(searchLocation) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchLocation + "&appid=0ee42d3011ef8af909385f6f86b5f4ab&units=imperial",
            dataType: "json",
            success: function(data) {
                // history link for this search
                if (history.indexOf(searchLocation) === -1) {
                    history.push(searchLocation);
                    // console.log("history", history);
                    window.localStorage.setItem("history", JSON.stringify(history));

                    newRow(searchLocation);
                }

                // erase old queries
                $("#today").empty();
console.log("data", data)

                // markup for new queries of current weather
                var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
                var card = $("<div>").addClass("card");
                var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
                var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
                var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " F");
                var cardBody = $("<div>").addClass("card-body");
                var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

                // merge to page
                title.append(img);
                cardBody.append(title, temp, humidity, wind);
                card.append(cardBody);
                $("#today").append(card);
                getForecast(searchLocation);
                getUVIndex(data.coord.lat, data.coord.lon);
            }
        });
    }
    
    function getForecast(searchLocation) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchLocation + "&appid=0ee42d3011ef8af909385f6f86b5f4ab&units=imperial",
            dataType: "json",
            success: function(data) {
                // console.log("forecast", data)
                    // generate new weather based on location entered
                $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

                // loop for all forecast by hour +15
                for (var i=0; i < data.list.length; i++) {
                    // starting at 3:30pm
                    if(data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        // var f = data.list[i]
                        // console.log("f", f)

                        var col = $("<div>").addClass("col-md-2");
                        var card = $("<div>").addClass("card bg-primary text-white");
                        var body = $("<div>").addClass("card-body p-2");

                        var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                        var p1 = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp_max + " F");
                        var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + " %");
                    
                        // merge to page

                        col.append(card.append(body.append(title, img, p1, p2)));
                        $("#forecast .row").append(col);
                    }
                }
            }
        })
    }
    function getUVIndex(lat, lon) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/uvi/forecast?&aapid=0ee42d3011ef8af909385f6f86b5f4ab" + lat + "&lon" + lon,
            dataType: "json",
            success: function(data) {
                var uvIndex = $("<p>").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(data.value);

                // color shift
                if (data.value < 3) {
                    btn.addClass("btn-success");
                }
                else if (data.value < 7) {
                    btn.addClass("btn.warning");
                }

                // merge to page

                // uvIndex.append to today card
                }
            })
        }
    // current history
    var history = JSON.parse(window.localStorage.getItem("history")) || [];

    if (history.length > 0) {
        searchWeather(history[history.length-1]);
    }

    for (var i=0; i < history.length; i++) {
        newRow(history[i]);
    }
})
