$("#info").css("pointer-events", "none");

if (localStorage.getItem("id") === "99") {
    //showMessage("היי, מכיוון שאתה מתחבר למערכת כאורח לא תהייה לך גישה להודעות וגם לא תהייה לך פענת דיווחים ומיעודת לך.", 3000);
    //$(".menuo a 3").css("pointer-events", "none");
    setGuestSettings();
}

var radius;
var newLat;
var newLng;
var curlat;
var curlng;
var distance;
var radiusLimit = 500;
var hazardsInRadius = 0;
var nextAngle = 0;
var map;
var marker = null;
var markers = [];
var watchId = null;
var hazards = new Array();
var markerHzr;
var imageID;
var dateToShow;
var numberToPicture;
var firstTimeCenter = true;
var allHazards;
var myOptions = {
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
    disableDefaultUI: true,
    zoomControl: false,
    styles: [
        {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "weight": "2.00"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#faebd7"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#f2f2f2"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 45
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#7b7b7b"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#46bcec"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#aabac8"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#070707" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#ffffff" }]
        }
    ]
};

var imgHzr = {
    url: "images/hazardPointer.png", // url
    scaledSize: new google.maps.Size(60, 60), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(30, 60)
};
var imgPos = {
    url: "images/pos.png", // url
    scaledSize: new google.maps.Size(60, 60), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(30, 60)
};
var loadHazardsCall = window.setInterval(function () {
    loadHazards();
}, 10000);
var showMeOnMap = window.setInterval(function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(changePosition, showError, {});
    }
}, 10000);

map = new google.maps.Map(document.getElementById("map"), myOptions);

$(document).ready(function () {

    changePicture(localStorage.getItem("picture"));

    changeName(localStorage.getItem("fullname"));

    google.maps.event.addListenerOnce(map, 'idle', function () {
        showMessage("המפה בטעינה, אנא המתן", 30000);
    });

    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        $(".messages").css('display', 'none');
        $("#info").css("pointer-events", "auto");
        showMessage("הכל מוכן", 3000);
        $(".status").fadeIn(1000);
    });

    getStreets();

    $("#alertBtn").click(function () {
        $(".dlg").fadeIn(1000);
        dateToShow = new Date();
        document.getElementById('harazdDateTimeTXT').value = dateToShow.getDate() + "/" + (dateToShow.getMonth() + 1) + "/" + dateToShow.getFullYear();
        var curlatlng = new google.maps.LatLng(newLat, newLng);
        var geocoder = geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': curlatlng }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                $('#hazardLocationTXT').val(results[1].formatted_address);
            }
        });
    });

    $(document).ajaxStart(function () {
        $("#wait").css("display", "block");
        $(".main").css("-webkit-filter", "grayscale(0.5)");
    });

    $(document).ajaxComplete(function () {
        $("#wait").css("display", "none");
        $(".main").css("-webkit-filter", "grayscale(0)");
    });

    $(".backButton").click(function () {
        if ($(".search").css("display") === "block") {
            $('.search').fadeOut(250);
        }
        else if ($(".dlg").css("display") === "block") {
            $("#hazardImage").attr("src", "images/photo-camera.svg");
            $("#hazardDescription").text("");
            $('.dlg').fadeOut(250);
        }
        else if ($(".hazardInfo").css("display") === "block") {
            $('.hazardInfo').fadeOut(250);
        }
        else if ($(".messages").css("display") === "block") {
            $('.messages').fadeOut(250);
        }
        else if ($(".fullImage").css("display") === "block") {
            $('.fullImage').fadeOut(250);
            $(".ROR").css("display", "block");
            $(".ROL").css("display", "block");
            $(".OK").css("display", "block");
        }
    });

    $("#addHazard").click(function addHazardToDB() {
        var newImg = $('#hazardImage').prop('src');
        var newDate = $('#harazdDateTimeTXT').val();
        var newLoc = $('#hazardLocationTXT').val();
        var newStreet = $("#streetSelector").val();
        var newDes = $("#hazardDescription").val();
        var newUploader = localStorage.getItem("username");
        var hazard = {
            uid: localStorage.id,
            dt: newDate,
            strid: newStreet,
            img: newImg,
            des: newDes,
            lat: newLat,
            lng: newLng,
            uname: newUploader
        };
        $.ajax({
            async: true,
            url: web + "/AddHazardToDB",
            dataType: "json",
            method: "POST",
            data: JSON.stringify(hazard),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                var res = data.d;
                var resOutput = JSON.parse(res);
                if (resOutput === "Added") {
                    showMessage("הדיווח נשלח תודה על שיתוף הפעולה, מקווים לטפל בזמן המהר ביותר", 3000);
                    $('.dlg').fadeOut(1000);
                    addHazardToMap();
                }
            },
            error: function () {
                showMessage("קיימת תקלת קלט נא לבדוק את אחד הנתונים", 3000);
                $('.dlg').fadeOut(1000);
            }
        });
    });

    $('#hazardImage').click(function () {
        var options = {
            DestinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA
        };

        navigator.camera.getPicture(onSuccess, onFail, options);

    });

    $("#thumbsUp").click(function () {
        addHazardToUser($("#hazardID").text(), $("#hazardImgInfo").attr('src'), $("#pDes").text());
        $(".hazardInfo").fadeOut(1000);
        updateMessage();
    });

    $("#showMe").click(function () {
        firstTimeCenter = true;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(changePosition, showError, {});
        }
    });

    $("#info").click(function () {
        showMessage("היי, מכיוון שאתה מתחבר למערכת כאורח לא תהייה לך גישה להודעות וגם לא תהייה לך פינת דיווחים ומיעודת לך.", 3000);
    });

    $(".messages").on("swiperight", function () {
        $(".messages").animate({
            right: '0',
            opacity: '0'
        });
    });

    $(".messages").on("swipeleft", function () {
        $(".messages").animate({
            left: '0',
            opacity: '0'
        });
    });

    $("#profileImage").click(function () {
        $(".fullImage").fadeIn(250);
        $(".fullImageInBox").attr("src", $(this).attr("src"));
        $(".ROR").css("display", "none");
        $(".ROL").css("display", "none");
        $(".OK").css("display", "none");
    });

    $(".fullImageInBox").click(function () {
        $("#hazardImage").attr("src", $(this).attr("src"));
        $(".fullImage").fadeOut(1000);
        $(".ROR").css("display", "block");
        $(".ROL").css("display", "block");
        $(".OK").css("display", "block");
    });

    $("#hazardImgInfo").click(function () {
        $(".fullImage").fadeIn(250);
        $(".fullImageInBox").attr("src", $(this).attr("src"));
    });

    $(".ROR").click(function () {
        $(".fullImageInBox").css("transform", "rotate(" + rotateImage(0) + "deg)");
    });

    $(".ROL").click(function () {
        $(".fullImageInBox").css("transform", "rotate(" + rotateImage(1) + "deg)");
    });

    $(".OK").click(function () {
        $("#hazardImage").attr("src", $(".fullImageInBox").attr("src"));
        $(".fullImage").fadeOut(1000);
    });
});

function onSuccess(imageURI) {
    //$("#hazardImage").attr('src', imageURI);
    //sendFile(imageURI);
    uploadPhotoToServer(imageURI);
}

function addHazardToUser(hazardID, image, description) {
    hazardToAdd = {
        HazardID: hazardID,
        UserID: localStorage.getItem("id"),
        UserName: localStorage.getItem("username"),
        HazardImg: image,
        Description: description
    };
    $.ajax({
        async: true,
        url: web + "/AddHazardToUser",
        dataType: "json",
        method: "POST",
        data: JSON.stringify(hazardToAdd),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var res = data.d;
            var resOutput = JSON.parse(res);
            if (resOutput === "Added") {
                showMessage("הדיווח נוסף לרשימה שלך בהצלחה", 3000);
                $('.dlg').fadeOut(1000);
            } else if (resOutput === "Already Exist") {
                showMessage("הדיווח כבר קיים ברשימה שלך", 3000);
                $('.dlg').fadeOut(1000);
            } else if (resOutput === "Error") {
                showMessage("שגיאה בשלב ההוספה", 3000);
                $('.dlg').fadeOut(1000);
            }
        },
        error: function () {
            showMessage("תקלה במערכת, יש לנסות אחר כך.", 3000);
        }
    });
}

function onFail(message) {
}

function loadHazards() {
    $.ajax({
        async: true,
        dataType: "json",
        url: web + "/GetHazards",
        method: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            allHazards = JSON.parse(data.d);
            showHazardsOnMap(allHazards);
        }
    });
} // Get hazards from database

function showHazardsOnMap(hazards) {
    hazardsInRadius = 0;
    setMapOnAll(null);
    for (var i = 0; i < hazards.length; i++) {
        markerHzr = new google.maps.Marker({
            position: { lat: hazards[i].Hazard_Lat, lng: hazards[i].Hazard_Long },
            map: map,
            icon: imgHzr,
            animation: google.maps.Animation.DROP
        });//ציור מפגעים במפה
        checkDistance(new google.maps.LatLng(newLat, newLng), new google.maps.LatLng(hazards[i].Hazard_Lat, hazards[i].Hazard_Long));
        markers.push(markerHzr);
        showHazardDetails(markerHzr, hazards[i]);
    }
    $(".status").html('סה"כ מפגעים שאותרו סביבך ' + hazardsInRadius);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
    markers = [];
}

function showHazardDetails(mark, data) {
    (function (zmark, zdata) {
        google.maps.event.addListener(zmark, 'click', function () {
            $("#hazardID").html(zdata.Hazard_ID);
            $("#hazardUploader").html(zdata.Hazard_Uploader);
            $("#hazardImgInfo").attr("src", zdata.Hazard_Image);
            $("#pDate").html(zdata.Hazard_DateTime);
            $("#pDes").html(zdata.Hazard_Description);
            $(".hazardInfo").fadeIn(1000);
        });
    })(mark, data);
} // Create a dialog foreach hazard that show when click on it

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(changePosition, showError, {});
    }
} // Watch user position

function changePosition(position) {
    newLat = position.coords.latitude;
    newLng = position.coords.longitude;

    pos = new google.maps.LatLng(newLat, newLng);

    if (firstTimeCenter) {
        map.panTo(pos);
        firstTimeCenter = !firstTimeCenter;
    }

    if (marker !== null) {
        marker.setMap(null);
        marker.setPosition(new google.maps.LatLng(newLat, newLng));
        marker.setMap(map);
        radius.setMap(null);
        radius.setCenter(new google.maps.LatLng(newLat, newLng));
        radius.setMap(map);
    }
    else {
        marker = new google.maps.Marker({ position: pos, map: map, animation: google.maps.Animation.DROP, icon: imgPos });
        radius = new google.maps.Circle({ center: marker.position, radius: radiusLimit, clickable: false, map: map });
    }

} // Change the position of the user while moving

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            showMessage("נא לשאר את השימוש בשירות המיקום.", 3000);
            break;
        case error.POSITION_UNAVAILABLE:
            showMessage("Location information is unavailable.", 3000);
            break;
        case error.TIMEOUT:
            showMessage("The request to get user location timed out.", 3000);
            break;
        case error.UNKNOWN_ERROR:
            showMessage("An unknown error occurred.", 3000);
            break;
        default:
            showMessage("An unknown error occurred.(default)", 3000);
            break;
    }
} // If an error fall, it will be shown by showMessage

function uploadPhotoToServer(imageURI) {
    imageID = Math.floor(Math.random() * 5000000 + 1);
    //   Load(); // Start the spinning "working" animation
    var options = new FileUploadOptions(); // PhoneGap object to allow server upload
    options.fileKey = "file";
    options.fileName = "HazardPicture" + imageID; // file name
    options.mimeType = "image/jpeg"; // file type
    var params = {}; // Optional parameters
    params.value1 = "test";
    params.value2 = "param";
    options.params = params;// add parameters to the FileUploadOptions object
    var ft = new FileTransfer();
    ft.upload(imageURI, "http://ruppinmobile.ac.il.preview26.livedns.co.il/site13/images/ReturnValue.ashx", win, fail, options); // Upload
}

function win(r) {
    path = r.response;
    showMessage("התמונה במערכת", 1500);
    $(".fullImage").fadeIn(250);
    $(".fullImageInBox").attr("src", "http://ruppinmobile.ac.il.preview26.livedns.co.il/site13/images/HazardPicture" + imageID + ".jpg");

    // UnLoad(); // Stop "working" animation
}

function fail(error) {
    showMessage("An error has occurred: Code = " + error.code, 3000);
    $('#hazardImage').attr('src', "images/photo-camera.svg");
}

function fillStreets() {
    var i;
    for (i = 0; i < localStorage.getItem("length"); i++) {
        $("#streetSelector").append('<option value="' + i + '">' + localStorage.getItem("street" + i) + '</option>');
    }
} // Show all steets into select box

function addHazardToMap() {
    navigator.vibrate(1500);
    loadHazards();
} // Show the hazard that we reported now

function showMessage(message, time) {
    $(".messages p").html(message);
    $(".messages").css('display', 'inline-block');
    $(".messages").animate({
        right: '12.5%',
        opacity: '1'
    });
    setTimeout(function () {
        $(".messages").css('display', 'none');
    }, time);
} // Show messages on screen

async function getStreets() {
    await sleep(500);
    $.ajax({
        async: true,
        url: web + "/FillStreetLocationSelect",
        dataType: "json",
        method: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var result = data.d;
            var i;
            for (i = 0; result[i] !== null; i++) {
                streetsList[i] = result[i].substring(1, result[i].length - 1);
                localStorage.setItem('street' + i, streetsList[i]);
            }
            localStorage.setItem('length', streetsList.length);
            fillStreets();
        },
        fail: function () {
            showMessage("error");
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function checkDistance(myPos, hzrPos) {
    distance = google.maps.geometry.spherical.computeDistanceBetween(myPos, hzrPos);
    if (distance < radiusLimit) {
        hazardsInRadius++;
    }
}

function rotateImage(side) {
    if (side === 0) {
        nextAngle += 90;
        if (nextAngle >= 360) {
            nextAngle = 0;
        }
    } else {
        nextAngle -= 90;
        if (nextAngle <= 0) {
            nextAngle = 360;
        }
    }
    return nextAngle;
}