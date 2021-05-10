$('#header').prepend('<div id="menu-icon"><span class="fa fa-bars"></span></div>');
	
	$("#menu-icon").on("click", function(){
    $("nav").slideToggle();
    $(this).toggleClass("active");
});