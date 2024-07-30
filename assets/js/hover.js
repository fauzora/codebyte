(function ($) {
  "use strict";

  [...document.getElementsByClassName("single_feature")].forEach((element) => {
    element.addEventListener("mouseover", () => {
      document.getElementById("sfx").pause();
      document.getElementById("sfx").play();
    });
  });
})(jQuery);
