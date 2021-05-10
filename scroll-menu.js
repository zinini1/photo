    $(window).on("scroll", function() {
        if ($(window).scrollTop() > 10) {
            $("#header").addClass("active");
        } else {

            $("#header").removeClass("active");
        }
    });