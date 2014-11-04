function setPopupFunction(){
  var span = document.querySelectorAll(".popup");
  for (var i = span.length; i--;) {
    (function () {
          var t;
          span[i].onmouseover = function () {
              hideAll();
              clearTimeout(t);
              this.className = 'popupHover';
          };
          span[i].onmouseout = function () {
              var self = this;
              t = setTimeout(function () {
                  self.className = 'popup';
              }, 200);
          };
      })();
  }
}

function setPopupFuncElem(element){
  var span = element.querySelectorAll(".popup");
  for (var i = span.length; i--;) {
    (function () {
          var t;
          span[i].onmouseover = function () {
              hideAll();
              clearTimeout(t);
              this.className = 'popupHover';
          };
          span[i].onmouseout = function () {
              var self = this;
              t = setTimeout(function () {
                  self.className = 'popup';
              }, 200);
          };
      })();
  }
}

function hideAll() {
    var span = document.querySelectorAll(".popup");
    for (var i = span.length; i--;) {
        span[i].className = 'popup';
    }
};
