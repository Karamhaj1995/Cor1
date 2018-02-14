
$(document).ready(function () {
    $(".systemSettings").css("display", "none");

    loadUserDetails();

    $("#accountSettings").click(function () {
        $(".accountSettings").css("display", "block");
        $(".systemSettings").css("display", "none");
    });

    $("#applicationSettings").click(function () {
        $(".systemSettings").css("display", "block");
        $(".accountSettings").css("display", "none");
    });

    $("#saveBTN").click(function () {
        showMessage("עודכן בהצלחה", 1000);
    });
});

function loadUserDetails() {
    $("#profileImage").attr("src", localStorage.getItem("picture"));
    $("#username").val(localStorage.getItem("username"));
    $("#fullname").val(localStorage.getItem("fullname"));
    $("#birthday").val();
}

function showMessage(message, time) {
    $(".messages p").html(message);
    $(".messages").css('display', 'inline-block');
    setTimeout(function () {
        $(".messages").css('display', 'none');
    }, time);
} // Show messages on screen

