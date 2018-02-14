
/*functions that used in home/login page*/
var boxheight;

if (localStorage.getItem("id") !== null) {
    if (localStorage.getItem("id") === "99") {
        loginAsGuest();
    }
    else {
        getStreets();
        $("#wait").css("display", "block");
        window.location.replace("MainPage.html");
    }
}

$(document).ready(function () {

    getStreets();

    $("#LPUserPassTXT").focus(function (event) {
        $('.detail').animate({ marginTop: '-35%' }, 300);
    });

    $("#LPUserPassTXT").focusout(function (event) {
        $('.detail').animate({ marginTop: '0' }, 300);
    });

    $(document).ajaxStart(function () {
        $("#wait").css("display", "block");
        $(".home").css("-webkit-filter", "grayscale(1)");
    });

    $(document).ajaxComplete(function () {
        $("#wait").css("display", "none");
        $(".home").css("-webkit-filter", "grayscale(0)");
    });

    $('#LPBtnCheckUserNamePass').click(function () {
        moveToMainPage($('#LPUserNameTXT').val(), $('#LPUserPassTXT').val());
    });

    $('#LPBtnGoToRegisterPage').click(moveToRegisterPage);

    $('#LPBtnAccessAsGuest').click(function () {
        loginAsGuest();
    });

    $('#LPUserPassTXT').keypress(function (e) {
        if (e.which === 13) {
            moveToMainPage($('#LPUserNameTXT').val(), $('#LPUserPassTXT').val());
        }
    });

    $('#LPUserNameTXT').keypress(function (e) {
        if (e.which === 13) {
            $('#LPUserPassTXT').focus().click();
        }
    });

});

function loginAsGuest() {
    localStorage.id = "99";
    localStorage.username = "Unknown/Guest";
    getStreets();
    window.location.replace("MainPage.html");   
}

function moveToRegisterPage() {
    window.location.replace("sign.html");
}

function moveToMainPage(username, password) {
    var usernameToLogin;
    var passwordToLogin;
    var userToLogin = { usernameToLogin, passwordToLogin };
    userToLogin.usernameToLogin = username;
    userToLogin.passwordToLogin = password;

    $.ajax({
        async: true,
        url: web + "/GetUserByNamePass",
        dataType: "json",
        method: "POST",
        data: JSON.stringify(userToLogin),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var res = data.d;
            var userDetails = JSON.parse(res);
            if (userDetails !== "Not Exist") {
                localStorage.id = userDetails.Id;
                localStorage.username = userDetails.User_Name;
                localStorage.fullname = userDetails.Full_Name;
                localStorage.birthday = userDetails.Birthday;
                localStorage.password = userDetails.Password;
                localStorage.reportscount = userDetails.ReportsCount;
                localStorage.picture = userDetails.Picture;
                getStreets();
                window.location.replace("MainPage.html");
            }
            else {
                alert("משתמש לא קיים במערכת, נא לבדוק את הנתונים.");
            }
        },
        error: function (exh) {
            alert("קיימת תקלה במערכת." + exh.statusText);
            //window.location.replace("MainPage.html");
        }
    });

}

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
        },
        fail: function () {
            showMessage("error");
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}//sleep for x seconds
