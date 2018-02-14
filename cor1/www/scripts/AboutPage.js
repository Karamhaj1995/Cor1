if (localStorage.getItem("id") == "99") {
    $(".menu a:eq(1)").css("background-color", "gray");
    $(".menu a:eq(2)").css("background-color", "gray");
    $(".menu a:eq(3)").css("background-color", "gray");
    $(".menu a:eq(1)").css("pointer-events", "none");
    $(".menu a:eq(2)").css("pointer-events", "none");
    $(".menu a:eq(3)").css("pointer-events", "none");
}

$(window).on("load", function () {

});