

$(window).on("load", function () {    
    getNews();
});

async function getNews() {
    await sleep(500);
    showTopNews(3);
    if (localStorage.getItem("id") == "99") {
        setGuestSettings();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showTopNews(top) {
    $.ajax({
        async: true,
        url: web + "/GetNews",
        method: "POST",
        contentType: "application/json",
        success: function (data) {
            var result = JSON.parse(data.d);
            showNews(result, 20);
        },
        failure: function (err) {
            alert("Weew Error !! ");
        }
    });
}

function showNews(news, top) {
    var newOne;
    var newTwo;
    var newThree;
    for (var i = 0, j = 0; i < news.length; i++ , j++) {
        if (j === 0) {
            newOne = $('<a href="#" class="one"><p>' + (news[i].New_Header).substring(0, 50) + '</p><span>המשך קריאה</span></a>');
            $(".list").on("click", "a", function (news) { alert((news[i].New_Header).substring(0, 50)); });
            $(".list").append(newOne.clone());
        } else if (j === 1) {
            newTwo = $('<a href="#" class="two""><p>' + (news[i].New_Header).substring(0, 50) + '</p><span>המשך קריאה</span></a>');
            $(".list").on("click", "a", function () { alert("Wewewewew"); });
            $(".list").append(newTwo.clone());
        }
        else if (j === 2) {
            newTwo = $('<a href="#" class="three""><p>' + (news[i].New_Header).substring(0, 50) + '</p><span>המשך קריאה</span></a>');
            $(".list").on("click", "a", function () { alert("Wewewewew"); });
            $(".list").append(newTwo.clone());
        } else {
            newTwo = $('<a href="#" class="four""><p>' + (news[i].New_Header).substring(0, 50) + '</p><span>המשך קריאה</span></a>');
            $(".list").on("click", "a", function () { alert("Wewewewew"); });
            $(".list").append(newTwo.clone());
            j = -1;
        }
    }
}

function showFullNewContent() {
        alert("WEW!!!");
    }