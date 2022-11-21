// IE check (unsupported browser redirect)
if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
  window.location = "microsoft-edge:" + window.location;
  setTimeout(function () {
    window.location = "https://go.microsoft.com/fwlink/?linkid=2135547";
  }, 1);
}

String.prototype.escape = function () {
  var tagsToReplace = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
  };
  return this.replace(/[&<>]/g, function (tag) {
    return tagsToReplace[tag] || tag;
  });
};

let gridCount = 0;
let gridVisible = false;
let hrsLoaded = false;

const cleanInputData = (elementsArr) => {
  //clean the single textarea
  let textarea = $("textarea[name='message']");
  textarea.val(textarea.val().escape());

  //clean the remaining inputs
  let selectedInput = "";
  elementsArr.forEach((el) => {
    selectedInput = $(`input[name='${el}']`);
    selectedInput.val(selectedInput.val().escape());
    if (checkForURLS(selectedInput.val()) === true) return true;
  });
};

const checkForURLS = (input) => {
  var expression =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  if (input.match(regex)) return true;
  else return false;
};

//ensure reCaptcha completed before form submit
$(document).on("submit", ".form", function (e) {
  //check for any URL spam
    if (checkForURLS($('input[name="name"]').val()))
      e.preventDefault();
    if (checkForURLS($('input[name="address"]').val()))
      e.preventDefault();
    if (checkForURLS($('input[name="city"]').val()))
      e.preventDefault();

  cleanInputData(["zipcode", "name", "email", "phoneNum", "address", "city"]);

  let elem = $(".errorMsg");
  if (grecaptcha.getResponse().length === 0) {
    //reCaptcha not verified
    e.preventDefault();
    elem.removeClass("d-none");
    elem.attr("aria-invalid", "true");
  } else {
    elem.addClass("d-none");
    elem.attr("aria-invalid", "false");
  }
});

// This function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function checkScroll() {
  let anchor_offset = $(".banner").offset().top,
    anchor_offset_two = $(".description").offset().top,
    anchor_offset_three = $(".bannerTwo").offset().top,
    anchor_offset_four = $(".display-4").offset().top,
    anchor_offset_five = $($(".card-text")[3]).offset().top;

  $(window).on("scroll", function () {

    //logo
    if ($(window).scrollTop() >= anchor_offset) {
      $(".navbar-brand").removeClass("expand");
      $(".navbar-brand").addClass("shrink");
    } else {
      $(".navbar-brand").removeClass("shrink");
      $(".navbar-brand").addClass("expand");
    }

    if (gridVisible === false) {
      //1st hr
      if ($(window).scrollTop() > anchor_offset_four) {
        $($("hr")[0]).addClass("expandHr");
      }

      //grid top half
      if ($(window).scrollTop() > anchor_offset_two) {
        setTimeout(() => {
          if (gridCount < 3) {
            $($(".card-img-top")[gridCount]).addClass("appear");
            $($(".card-img-top")[gridCount]).removeClass("hidden-at-first");
            gridCount++;
          }
        }, 300);
      }

      //grid bottom half
      if ($(window).scrollTop() > anchor_offset_three) {
        setTimeout(() => {
          if (gridCount < 6) {
            $($(".card-img-top")[gridCount]).addClass("appear");
            $($(".card-img-top")[gridCount]).removeClass("hidden-at-first");
            gridCount++;
            if (gridCount === 6) {
              gridVisible = true;
            }
          }
        }, 300);
      }
    }

    //2nd hr
    if ($(window).scrollTop() > anchor_offset_five && hrsLoaded === false) {
      $($("hr")[1]).addClass("expandHr");
      hrsLoaded = true;
    }

    if (hrsLoaded) {
      //scrolled through site already
      if (grecaptcha.getResponse().length != 0) {
        //reCaptcha verified
        $(".errorMsg").addClass("d-none"); //hide this msg again
      }
    }
  });
}

$(window).scroll(debounce(checkScroll, 15)); //delay the firing slightly

$(document).ready(function () {
  setTimeout(function () {
    $(".fadeIn").addClass("appear");

    //disable the long, midpage parallax on Safari browsers (known issue with jittering)
    let is_safari =
      navigator.userAgent.indexOf("Safari") != -1 &&
      navigator.userAgent.indexOf("Chrome") == -1;
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/) || is_safari) {
      $("column div").attr("id", "safari-parallax-disable");
      $(".heroImage").addClass("fixBG");
    }

    checkScroll(); //check if user has pre-scrolled on page load
  }, 200);
});
