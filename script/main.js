//Nav Hover Logic Goes Here

let navListItem = document.querySelectorAll(".nav");

navListItem.forEach(function(nav) {

  nav.addEventListener("mouseenter", function() {
    nav.style.fontSize = "30px";
    nav.style.color = "rgb(68, 68, 68)";
  });

  nav.addEventListener("mouseleave", function() {
    nav.style.fontSize = "25px";
    nav.style.color = "black";
  });

});

