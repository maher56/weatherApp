const cards = $(".nextDays .container .card");

// taking the information from api
const file = `https://api.openweathermap.org/data/2.5/onecall?lat=36.216667&lon=37.166668&units=metric&exclude=minutely,alerts&appid=b6b4ad741fb41cf95c985aac014dca50`;

fetch(file).then((response) => response.json())
.then((data) => {
    // main data
    const baseIconUrl = "http://openweathermap.org/img/wn/";
    let now = new Date();

    $(".todayTemp").text(data.current.temp + "ْ")
    $(".todayDisc").text(data.current.weather[0].main);
    $(".todayIcon").attr("src" , baseIconUrl + data.current.weather[0].icon + ".png");
    $("body").css(`background-image` , `url("img/${data.current.weather[0].main}.gif")`);
    for(let i = 0 ; i < 5 ; i++) {
        let current = $(".main-content .container > div > div");
        current.eq(i).children().eq(1)
        .children().eq(0).attr("src" , baseIconUrl + data.hourly[i].weather[0].icon + ".png");

        current.eq(i).children().eq(1)
        .children().eq(1).text(data.hourly[i].temp + "ْ");
        if(i == 0)continue;
        let hour = (now.getHours() + i) % 24;
        if(hour <= 9)hour = "0" + hour;
        current.eq(i).children().eq(0).text("after " + hour + " Hour");
    }

    let children = $(".nextDays .container").children();
    for(let i = 0 , j = children.length ; i < j ; i++) {
        children.eq(i).children().eq(0).children().eq(0).html("after " + ((now.getDate() - 1 + i) % 30 + 1) + "<br>Day");
        children.eq(i).children().eq(0).children().eq(1).text(data.daily[i].temp.day + "ْ");
        children.eq(i).css(`background-image` , `url("img/${data.daily[i].weather[0].main}.gif")`);
        children.eq(i).children().eq(0).children().eq(2).text(data.daily[i].weather[0].main);
        children.eq(i).children().eq(0).children().eq(3).attr("src" , baseIconUrl + data.daily[i].weather[0].icon + ".png")
    }
});

nextDaysHeight();
$(window).resize(()=>{nextDaysHeight()});

numberofCards()
$(window).resize(()=>{numberofCards()});

// arrowControl
const arrowLeft = $(".arrow").children().eq(0);
const arrowRight = $(".arrow").children().eq(1);

arrowLeft.click(() => {
    const activeCard = $(".nextDays .container .card.show");
    if(activeCard.index() === 0)return;
    activeCard.removeClass("show");
    activeCard.prev().addClass("show");
    scrollToShow();
    
});

arrowRight.click(() => {
    const activeCard = $(".nextDays .container .card.show");
    if(activeCard.index() === cards.length - 1)return;
    
    activeCard.removeClass("show");
    activeCard.next().addClass("show");
    scrollToShow()
});









// functions

function scrollToShow() {
    cards.parent().stop(1);
    let activeCard = $(".nextDays .container .card.active");
    let showCard = $(".nextDays .container .card.show");
    let distance = Math.abs(activeCard.position().left - showCard.position().left);
    distance -= 10;
    cards.parent().animate({
        scrollLeft: distance * showCard.index(),
    }, 500);
    setTimeout(() => {
        showCard.addClass("active");
        showCard.siblings().removeClass("active");
    }, 200)
}

function numberofCards() {
    const windowWidth = $(window).width();
    let numberofCards;
    if(windowWidth >= 1200)
        numberofCards = 5;
    else if (windowWidth >= 992)
        numberofCards = 4;
    else if (windowWidth >= 768)
        numberofCards = 3;
    else if (windowWidth >= 400)
        numberofCards = 2;
    else
        numberofCards = 1;
    cards.eq(0).css({"left": "30px"});
    cards.eq(cards.length - 1).css({"margin-right": "30px"});
    cards.each( function(i , c){
        if(i == 0)return;
        $(c).css("left" , `${cards.eq(i - 1).position().left + 40 + cards.eq(i - 1).outerWidth()}px`);
        
    });
};

function nextDaysHeight(){
    $('.nextDays').outerHeight(Math.max(cards.height() + 100 , $(window).outerHeight(true) - 
    $("nav").outerHeight(true) - $("header").outerHeight(true) - $(".thisDay").outerHeight(true))
,1)};