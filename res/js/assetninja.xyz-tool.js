var theImage= {
  url:null
}

var start = function()
{
  activityIndicator.show(); // show spinner
  $('.sidenav').sidenav({edge:'right',draggable: false});
  loadInsp();
  loadImage();
}

var inst;
function loadImage()
{
    var url = window.location.hash.replace("#","");
    convertImgToDataURLviaCanvas(url, function(data){
     // document.getElementById("imagePreview").onload = __start;
      document.getElementById("imagePreview").src = data;
      //setTimeout("__start()", 300);
      activityIndicator.hide();
      /*inst = panzoom(document.getElementById("imagePreview"), {
          maxZoom: 10,
          minZoom: 0.1,
          smoothScroll: true,
          beforeWheel: function(e) {
            // allow wheel-zoom only if altKey is down. Otherwise - ignore
           // return false;
            var shouldIgnore = !e.shiftKey;
            return shouldIgnore;
          }
        });*/
    });
}

function loadInsp()
{
  loadFile("/res/insp.html", function(data){
    $(".sidenav").html($(".sidenav").html() + data);
    $('.collapsible').collapsible();
    $('select').formSelect();
    $(".specColor").spectrum(
      {clickoutFiresChange: true,
        flat:true,
        showPalette: true,
        cancelText: "",
        chooseText: "",
        localStorageKey: "spec"});
  });
}

function convertImgToDataURLviaCanvas(url, callback){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL("png");
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
}

var activityIndicator = {
  show:function(){
    $("body").append('<div style="position: fixed;height: 100vh;width: 100vw;text-align: center;background-color: rgba(255,255,255,.8);z-index: 100000;" class="ac"><svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg" style="margin-top: 45vh;"> <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle> </svg></div>');
  },
  hide: function(){
    $(".ac").remove();
  }
}

function gradCheckChanged(e)
{
  var v = e.target.checked;
  if(v){
    $(".gradOptions").fadeIn();
  }
  else{
    $(".gradOptions").fadeOut();
  }
  $(".gradOptions").val(v);
}


function selectChanged(e)
{
  var v = e.target.value;
  if(v === "custom"){
    $(".customOptions").fadeIn();
  }
  else{
    $(".customOptions").fadeOut();
  }
  $(".theSelect").val(v);
}


function fselectChanged(e)
{
  var v = e.target.value;
  if(v === "none"){
    $(".filtersWrapper").fadeOut();
  }
  else{
    $(".filtersWrapper").fadeIn();
  }
  $(".theFSelect").val(v);
}

function updateValueI (e) {
  var sibling = $(e.target).closest(".row").find("input[type=range]")
  console.log(sibling)
  sibling.val(e.target.value);
}

function updateValueS (e) {
  var sibling = $(e.target).closest(".row").find("input[type=number]")
  sibling.val(e.target.value);
}

function imageDataChange(e)
{
  var v = e.target.value;
  var t = e.target.dataset.target;

}

