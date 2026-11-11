let navListItem = document.querySelectorAll(".nav");

navListItem.forEach(function(nav) {

  nav.addEventListener("mouseenter", function() {

    nav.style.font="35px !important";
    nav.style.color="rgb(68, 68, 68)";
    
  });

  nav.addEventListener("mouseleave", function() {

    nav.style.font="25px !important";
    nav.style.color="black;

  });

});
