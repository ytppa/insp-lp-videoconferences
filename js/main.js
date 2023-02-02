AOS.init();


(function(){

const scroll = function(area) { 
    
    var sizes = {
        height: area.height(),
        scrollheight: area.prop("scrollHeight"),
        scrolltop: area.scrollTop(),
        bottom: 0
    };
    sizes.bottom = sizes.scrollheight - sizes.height - sizes.scrolltop;

    return sizes;
}

window.on("scroll", e => console.log(scroll()))

})()