$(document).ready(function () {

var apiKey = "c9e1de1e6b85e8d1e42869cbae27b7aa";
var location = $("#locSrch");
var city = $("#currCity");
var tempature = $("#Temp");
var wind = $("windSpd");
var humidity = $("humidity");
var uvIndex = $("uvIndex");



 

    $(".btn").on("click", startSearch);

    $(".back").on("click", "p", function () {
        lastsearch = this.textContent;
        localStorage.setItem("lastsearch", lastsearch);
        location.val(lastsearch);
        startSearch();
        getSearches(searchVal);
    })
    function startSearch() {
        var searchCity = location.val();
        lastsearch = searchCity;
        localStorage.setItem("lastsearch", lastsearch);
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=" + apiKey + "&units=imperial";
        var queryFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&appid=" + apiKey + "&units=imperial";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (oneDayData) {
            var lat = oneDayData.coord.lat;
            var lon = oneDayData.coord.lon;
            var queryUV = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            $.ajax({
                url: queryUV,
                method: "GET"
            }).then(function (uvData) {
                $.ajax({
                    url: queryFiveDay,
                    method: "GET"
                }).then(function (fiveDayData) {
                    setCard(oneDayData);
                    setUV(uvData);
                    setFiveDay(fiveDayData);
                    saveSearch();
                    
                });
                
            });
        });


        function setUV(input) {
            var uv = input.value;
            $(uvIndex).html("UV Index: <span>" + uv + "</span");


            if (uv <= 3) {
                $("span").addClass("low");
            } else if (3 < uv && uv <= 7) {
                $("span").addClass("moderate");
            } else if (uv > 7) {
                $("span").addClass("high");
            }
        }
        function setFiveDay(input) {

            for (var i = 1; i < 6; i++) {
                $("#day" + i).text(moment().add(i, 'day').format('l'));
            }

            for (var a = 1, b = 7; a < 6; a++, b += 8) {
                $("#Temp" + a).text("Temp: " + input.list[b].main.temp + "°F");
                $("#Humid" + a).text("Humidity: " + input.list[b].main.humidity + "%");


            }

            function saveSearch() {
                var name = locationSearch.val();
                if (arr.includes(name)) {
                    return;
                } else {
                    $("<p>", {
                        text: name,
                        class: "saves",
                        value: name
                    }).appendTo(".back");
                    arr.push(name);
                    localStorage.setItem("searches", JSON.stringify(arr));
                }
            }
            function getSearches(searchVal) {
                 var arr = JSON.parse(localStorage.getItem("searches"));
                var last = localStorage.getItem("lastsearch");
                locationSearch.val(last);
                if (!arr) {
                    arr = [];
                } else {

                    for (var i = 0; i < arr.length; i++) {
                        $("<p>", {
                            text: arr[i],
                            class: "saves",
                            value: arr[i]
                        }).appendTo(".back");
                    }
                    startSearch();
                }
            }
        }

    }

});

