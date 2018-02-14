var currentHazard;

$(window).on("load", function () {
    getOwnHazards();

    $(".fullImageInBox").click(function () {
        $("#hazardImage").attr("src", $(this).attr("src"));
        $(".fullImage").fadeOut(1000);
        $(".ROR").css("display", "block");
        $(".ROL").css("display", "block");
        $(".OK").css("display", "block");
    });

    $(".backButton").click(function () {
        $(".fullImage").hide(300);
    });

    $(".ROR").click(function () {
        $(".fullImageInBox").css("transform", "rotate(" + rotateImage(0) + "deg)");
    });

    $(".ROL").click(function () {
        $(".fullImageInBox").css("transform", "rotate(" + rotateImage(1) + "deg)");
    });

    $(".yesDel").click(function () {
        $(".deleteConfirmation").fadeOut(1000);
        $(".ownHazards").css("-webkit-filter", "grayscale(0)");
        harazrdDelete(currentHazard, localStorage.getItem("id"));
    });
});

function harazrdDelete(hazardID, userID) {

    var hazardToDelete = {
        HazardID: hazardID,
        UserID: userID
    };

    $.ajax({
        async: true,
        url: web + "/DeleteHazardByID",
        method: "POST",
        data: JSON.stringify(hazardToDelete),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            showMessage("הדיווח נמחק מהרשימה שלך");

            getOwnHazards();
        },
        failure: function (err) {
            showMessage("תקלה במערכת, נסה שוב");
        }
    });

}

async function getOwnHazards() {
    await sleep(500);
    showOwnHazards(50);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showOwnHazards(top) {
    var userid = {
        ID: localStorage.getItem("id"),
        Top: top
    };

    $(".ownHazards").html('<p id="countParagraph"></p>' +
        '<a href="#countParagraph"> <img src="images/arrup.png" id="goUP" /></a >' +
        '<a href="#last"><img src="images/arrdown.png" id="goDOWN" /></a>');
    $.ajax({
        async: true,
        url: web + "/GetHazardsByUserID",
        method: "POST",
        data: JSON.stringify(userid),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            var result = JSON.parse(data.d);
            var i;
            for (i = 0; result[i] !== null; i++) {
                newOne = $('<div class="hazardItem"><p>' + result[i].Hazard_Description + "<br>" + result[i].Hazard_DateTime + '<br></p><img class="hazardpic"  src="' + result[i].Hazard_Image + '" onclick="showImage()"><span><img class="deleteicn" onclick="askToDelete(' + result[i].Hazard_ID + ',' + localStorage.getItem("id") + ')" src="images/deleteicon.png"></span><br></div>');
                $(".ownHazards").append(newOne.clone());
            }
            last = $('<p id="last"></p>');
            $(".ownHazards").append(last.clone());
            $("#countParagraph").html("דיווחת כבר על " + i + " מפגעים");
        },
        failure: function (err) {
            showMessage("Weew Error !! ");
        }
    });
}

function showMessage(message) {
    $(".messages p").html(message);
    $(".messages").css('display', 'inline-block');
    setTimeout(function () {
        $(".messages").css('display', 'none');
    }, 4000);
}

function showImage() {
    $(".fullImage").fadeIn(250);
    $(".fullImageInBox").attr("src", $(".hazardpic").attr("src"));
}

function askToDelete(hazardID, userID) {
    $('.deleteConfirmation').fadeIn(1000);
    $(".ownHazards").css("-webkit-filter", "grayscale(0.9)");

    currentHazard = hazardID;
}

