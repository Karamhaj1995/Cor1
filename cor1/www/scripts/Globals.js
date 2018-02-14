var local = false;
var web = "http://ruppinmobile.ac.il.preview26.livedns.co.il/site13/WebService.asmx";
var streetsList = new Array();
if (local) {
    web = "http://localhost:60881/WebService.asmx";
}

var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
var backButtonToMain = '<img class="backBTN" src="images/backiii.png" >';
var backButtonToStart = '<img class="backBTNToStart" src="images/backiii.png" >';

addMenuToPages();
addBackButtonToPages();

function showMenu() {
    $(".menu").fadeIn(1000);
    $(".main").css("-webkit-filter", "grayscale(0.5)");
}

function hideMenu() {
    $(".menu").fadeOut(1000);
    $(".main").css("-webkit-filter", "grayscale(0)");
}

$(".backBTN").click(function () {
    window.location.replace("MainPage.html");
});

$(".backBTNToStart").click(function () {
    window.location.replace("LoginPage.html");
});

function logout() {
    localStorage.clear();
    window.location.replace("LoginPage.html");
}

function addMenuToPages() {
    if (sPage.slice(sPage[0], sPage.indexOf(".")) !== "LoginPage" && sPage.slice(sPage[0], sPage.indexOf(".")) !== "sign") {
        $.ajax({
            async: true,
            url: web + "/NumberOfHazardsToUser",
            method: "POST",
            data: '{"userid":"' + localStorage.getItem("id") + '"}',
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                var res = data.d;
                var menu = '<img src="images/menu.png" class="menuo" onclick="showMenu()">'
                    + '<div class="menu">'
                    + '<a href="#" class="menuoo"><img src="images/menu.png" onclick="hideMenu()"></a>'
                    + '<a target="_self" href="#" class="profile">'
                    + '<p>' + localStorage.getItem("fullname") + '</p>'
                    + '</a>'
                    + '<a target="_self" href="OwnHazardsPage.html">דיווחים שלי (' + res + ')</a>'
                    + '<a target="_self" href="MessagePage.html">הודעות</a>'
                    + '<a target="_self" href="NewsPage.html">חדשות</a>'
                    + '<a target="_self" href="#" onclick="logout()">התנתק</a>'
                    + '<hr>'
                    + '<a target="_self" href="settingsPage.html">הגדרות</a>'
                    + '<a target="_self" href="AboutPage.html">אודות</a>'
                    + '<a target="_self" href="#">צור קשר</a>'
                    + '</div>';
                if (localStorage.getItem("id") !== "99") {
                    $("body").append(menu);
                } else {
                    menu = '<img src="images/menu.png" class="menuo" onclick="showMenu()">'
                        + '<div class="menu">'
                        + '<a href="#" class="menuoo"><img src="images/menu.png" onclick="hideMenu()"></a>'
                        + '<a target="_self" href="#" class="profile">'
                        + '<p>אהלן, אורח!</p>'
                        + '</a>'
                        + '<a target="_self" href="OwnHazardsPage.html">דיווחים שלי (' + res + ')</a>'
                        + '<a target="_self" href="MessagePage.html">הודעות</a>'
                        + '<a target="_self" href="NewsPage.html">חדשות</a>'
                        + '<a target="_self" href="#" onclick="logout()">התנתק</a>'
                        + '<hr>'
                        + '<a target="_self" href="settingsPage.html">הגדרות</a>'
                        + '<a target="_self" href="AboutPage.html">אודות</a>'
                        + '<a target="_self" href="#">צור קשר</a>'
                        + '</div>';
                    $("body").append(menu);
                    setGuestSettings();
                }
            },
            error: function (xhr) {
                var menu = '<img src="images/menu.png" class="menuo">'
                    + '<div class="menu">'
                    + '<a href="#" class="menuoo"><img src="images/menu.png" onclick="hideMenu()"></a>'
                    + '<a target="_self" href="#" class="profile">'
                    + '<p>איזור אישי</p>'
                    + '</a>'
                    + '<a target="_self" href="OwnHazardsPage.html">דיווחים שלי (0)</a>'
                    + '<a target="_self" href="MessagePage.html">הודעות</a>'
                    + '<a target="_self" href="NewsPage.html">חדשות</a>'
                    + '<a target="_self" href="#" id="logoutBtn">התנתק</a>'
                    + '<hr>'
                    + '<a target="_self" href="settingsPage.html">הגדרות</a>'
                    + '<a target="_self" href="AboutPage.html">אודות</a>'
                    + '<a target="_self" href="#">צור קשר</a>'
                    + '</div>';
                $("body").append(menu);
            }
        });
    }
}

function addBackButtonToPages() {
    if (sPage.slice(sPage[0], sPage.indexOf(".")) !== "LoginPage" && sPage.slice(sPage[0], sPage.indexOf(".")) !== "MainPage") {
        if (sPage.slice(sPage[0], sPage.indexOf(".")) !== "sign") {
            $("body").append(backButtonToMain);
        } else {
            $("body").append(backButtonToStart);
        }
    }
}

function setGuestSettings() {
    $(".menu a:eq(1)").css("background-color", "gray");
    $(".menu a:eq(2)").css("background-color", "gray");
    $(".menu a:eq(3)").css("background-color", "gray");
    $(".menu a:eq(1)").css("pointer-events", "none");
    $(".menu a:eq(2)").css("pointer-events", "none");
    $(".menu a:eq(3)").css("pointer-events", "none");
    $(".mail").css("pointer-events", "none");
    $("#thumbsUp").css("pointer-events", "none");
} //Global to all pages

function changePicture(profilePicture) {

    if (localStorage.getItem("id") === "99") {
        $("#profileImage").attr("src", "images/user.svg");
    }
    else {
        $("#profileImage").attr("src", localStorage.getItem("picture"));
        sleep(500);
        $("#profileImage").css("transform", "rotate(-90deg)");
        $(".fullImageInBox").css("transform", "rotate(-90deg)");
    }
}

function changeName(userfullname) {
    if (localStorage.getItem("id") === "99")
        $("a.profile p").html("אהלן, אורח!");
    else
        $("a.profile p").html(userfullname);
}

function getCountHazardsToUser() {

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}