$(window).on("load", function () {

    $("#mailCate").click(function () {
        $("#cateName").html("הודעות");
        $(".contectMail").css("display", "none");
        $(".contectNot").css("display", "none");
        $(".contectCityhall").css("display", "block");
    });

    $("#notCate").click(function () {
        $("#cateName").html("התראות");
        $(".contectMail").css("display", "none");
        $(".contectNot").css("display", "block");
        $(".contectCityhall").css("display", "none");
    });

    $("#cityhallCate").click(function () {
        $("#cateName").html("דבר ראש העיר");
        $(".contectMail").css("display", "none");
        $(".contectNot").css("display", "none");
        $(".contectCityhall").css("display", "block");
    });
});