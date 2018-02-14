var errStr = "";
var errCnt = 0;
var imageID;
var boxheight;

window.fbAsyncInit = function () {
    FB.init({
        appId: '234112013795743',
        cookie: true,
        xfbml: true,
        version: 'v2.11'
    });
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
};
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(document).ready(function () {

    $(".LoginWays").fadeIn(1000);
    $(".sign").css("-webkit-filter", "grayscale(0.9)");

    $(document).ajaxStart(function () {
        $("#wait").css("display", "block");
        $(".sign").css("-webkit-filter", "grayscale(1)");
    });

    $(document).ajaxComplete(function () {
        $("#wait").css("display", "none");
        $(".sign").css("-webkit-filter", "grayscale(0)");
    });

    $('#addProfilePicture').click(function () {
        navigator.camera.getPicture(onSuccessRegister, onFailRegister, {});
    });

    $('#RPUsernameTXT').change(function () {
        checkDetails($('#RPUsernameTXT').val(),"asd", "dsa","dsa")
    });

    $('#RegisterBTN').click(function () {
        errStr = "";
        errCnt = 0;
        var newPic = $('#addProfilePicture').prop('src');
        var newUserName = $('#RPUsernameTXT').val();
        var newName = $('#RPUserfullnameTXT').val();
        var newDate = $('#RPUserDateTXT').val();
        var newPass = $('#RPUserPassTXT').val();
        var newPassII = $('#RPUserRePassTXT').val();

        if (newUserName === "") {
            errStr += "נא להקליד שם משתמש";
            errStr += "\n";
            errCnt++;
        }
        if (newUserName.length < 8) {
            errStr += "שם משתמש חייב להיות בן 8 ספרות או יותר";
            errStr += "\n";
            errCnt++;
        }
        if (newName.length < 5) {
            errStr += "שם חייב להיות מעל 3 אותיות";
            errStr += "\n";
            errCnt++;
        }
        if (newPass !== "") {
            if (newPass !== newPassII) {
                errStr += "סיסמאות לא זהות";
                errStr += "\n";
                errCnt++;
            }
        }
        else {
            errStr += "נא להזין סיסמאות";
            errStr += "\n";
            errCnt++;
        }
        if (errCnt === 0) {
            var user = {
                uname: newUserName,
                name: newName,
                br: newDate,
                pass: newPass,
                pic: newPic
            };
            $.ajax({
                async: true,
                url: web + "/AddUserToDB",
                dataType: "json",
                method: "PosT",
                data: JSON.stringify(user),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    var res = data.d;
                    var resOutput = JSON.parse(res);
                    if (resOutput === "added") {
                        alert("הוזנת למערכת בהצלחה");
                        localStorage.clear();
                        localStorage = null;
                        setDefaultSettingsToUser();
                        window.location.replace("LoginPage.html");
                    }
                },
                error: function () {
                }
            });
        } else {
        }
    });

    $('#RPUsernameTXT').keypress(function (e) {
        if (e.which === 13) {
            $('#RPUserfullnameTXT').focus().click();
        }
    });

    $('#RPUserfullnameTXT').keypress(function (e) {
        if (e.which === 13) {
            $('#RPUserDateTXT').focus().click();
        }
    });

    $('#RPUserDateTXT').change(function () {
        $('#RPUserPassTXT').focus().click();
    });

    $('#RPUserPassTXT').keypress(function (e) {
        if (e.which === 13) {
            $('#RPUserRePassTXT').focus().click();
        }
    });

    $('#RPUserRePassTXT').keypress(function (e) {
        if (e.which === 13) {
            $('#RegisterBTN').focus().click();
        }
    });

    $("#RPUserPassTXT").focus(function (event) {
        $('.deatils').animate({ marginTop: '-45%' }, 300);
    });

    $("#RPUserPassTXT").focusout(function (event) {
        $('.deatils').animate({ marginTop: '0' }, 300);
    });

    $("#RPUserRePassTXT").focus(function (event) {
        $('.deatils').animate({ marginTop: '-55%' }, 300);
    });

    $("#RPUserRePassTXT").focusout(function (event) {
        $('.deatils').animate({ marginTop: '0' }, 300);
        if ($("#RPUserRePassTXT").val() !== $("#RPUserPassTXT").val()) {
            $('.messages').css("background-color", "red");
            showWarningMessage("סיסמאות לא זהות, בדוק אותם שוב.", 3000);
            $('#RPUserRePassTXT').focus().click();
        }
    });

    $("#Loginwithfacebook").click(function () {
        FB.login(statusChangeCallback);
    });

    $(".backButton").click(function () {
        $(".LoginWays").fadeOut(1000);
        $(".sign").css("-webkit-filter", "grayscale(0)");
    });
});

function onSuccessRegister(imageURI) {
    uploadPhoto(imageURI);
}

function onFailRegister() {
    showWarningMessage("תמונה היא לא חיונית לשלב ההרשמה", 2000);
    $('#addProfilePicture').attr('src', "images/photo-camera.svg");
}

function uploadPhoto(imageURI) {
    imageID = Math.floor(Math.random() * 50000 + 1);
    // Load(); // Start the spinning "working" animation
    var options = new FileUploadOptions(); // PhoneGap object to allow server upload
    options.fileKey = "file";
    options.fileName = "UsersPicture" + imageID; // file name
    options.mimeType = "image/jpeg"; // file type
    var params = {}; // Optional parameters
    params.value1 = "test";
    params.value2 = "param";
    options.params = params;// add parameters to the FileUploadOptions object
    var ft = new FileTransfer();
    ft.upload(imageURI, "http://ruppinmobile.ac.il.preview26.livedns.co.il/site13/images/ReturnValue.ashx", winsign, failsign, options); // Upload
}

function winsign(r) {
    path = r.response;
    showWarningMessage("התמונה במערכת", 2000);
    $("#addProfilePicture").attr("src", "http://ruppinmobile.ac.il.preview26.livedns.co.il/site13/images/UsersPicture" + imageID + ".jpg");
    $("#addProfilePicture").css("transform", "rotate(-90deg)");
    $('#RPUsernameTXT').focus().click();
}

function failsign(error) {
    onFailRegister();
}

function showWarningMessage(message, time) {
    $(".messages p").html(message);
    $(".messages").css('display', 'inline-block');
    setTimeout(function () {
        $(".messages").css('display', 'none');
    }, time);
}

function setDefaultSettingsToUser() {
    $.ajax({
        async: true,
        url: web + "/SetDefaultSettingsToUser",
        dataType: "json",
        method: "PosT",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var result = JSON.stringify(data.d);
            alert(result);
        },
        error: function (ehr) {
            alert(ehr.responseText);
        }
    });
}

function checkDetails(newUserName, newName, newPass, newPassII) {
    var user = {
        unamee: newUserName
    };

    $.ajax({
        async: true,
        url: web + "/CheckIfUserNameAvaible",
        dataType: "json",
        method: "POST",
        data: JSON.stringify(user),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var res = data.d;
            var resOutput = JSON.parse(res);
            if (resOutput === "Exist") {
                $('#RPUsernameTXT').css("color", "red");
                $('.messages').css("background-color", "red");
                showWarningMessage("שם משתמש כבר קיים במערכת", 4000);
                $('#RPUsernameTXT').focus().click();
            }
            else {
                $('.messages').css("background-color", "orange");
                showWarningMessage("שם משתמש בסדר", 2000);
                $('#RPUsernameTXT').css("color", "green");
            }
        },
        error: function () {
            showWarningMessage("הבדיקה נכשלה", 2000);
        }
    });

    sleep(2000);

    
    
}

function statusChangeCallback(response) {
    if (response.status === 'connected') {
        $(".LoginWays").fadeOut(1000);
        FB.api('/me', 'get', { fields: 'first_name,last_name,name,picture.width(150).heigth(150)' }, ["user_birthday"], function (response) {
            $("#RPUserfullnameTXT").val(response.name);
            $("#addProfilePicture").attr("src", "" + response.picture.data.url);
            $(".LoginWays").fadeOut(1000);
            $(".sign").css("-webkit-filter", "grayscale(0)");
        });
    }
}

function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}