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

function setArrow(element, id){
  var div = element.querySelector("#"+id);
  var left = div.querySelector(".left-link");
  var right = div.querySelector(".right-link");

  left.onclick = function(){
    var myID = id;
    var div = document.querySelector("#"+myID);

    var itemHeader = div.querySelector(".itemHeader");
    var productLink = div.querySelector(".productLink");
    var productImage = div.querySelector(".product_image");
    var productPrice = div.querySelector(".productPrice");

    var index = globalIndex[id];
    var data = globalData[id];
    var leftIndex = index-1;
    if(leftIndex < 0){
      leftIndex += globalData[id].links.length;
    }

    itemHeader.innerHTML = data.links[leftIndex].item_name;
    productLink.setAttribute("href", data.links[leftIndex].url);
    productImage.setAttribute("src", data.links[leftIndex].med_image_urls[0].imageUrl);
    productPrice.innerHTML = "価格"+data.links[leftIndex].price;

    globalIndex[id] = leftIndex;

    return false;
  }

  console.log(right);
  right.onclick = function(){
    var myID = id;
    var div = document.querySelector("#"+myID);

    var itemHeader = div.querySelector(".itemHeader");
    var productLink = div.querySelector(".productLink");
    var productImage = div.querySelector(".product_image");
    var productPrice = div.querySelector(".productPrice");

    var index = globalIndex[id];
    var data = globalData[id];
    var rightIndex = index+1;
    rightIndex %= globalData[id].links.length;

    itemHeader.innerHTML = data.links[rightIndex].item_name;
    productLink.setAttribute("href", data.links[rightIndex].url);
    productImage.setAttribute("src", data.links[rightIndex].med_image_urls[0].imageUrl);
    productPrice.innerHTML = "価格"+data.links[rightIndex].price;

    globalIndex[id] = rightIndex;

    return false;
  }
}

function hideAll() {
    var span = document.querySelectorAll(".popup");
    for (var i = span.length; i--;) {
        span[i].className = 'popup';
    }
};
