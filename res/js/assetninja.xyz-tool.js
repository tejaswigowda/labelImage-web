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

var inst, canvas;
var rect, isDown, origX, origY;
function loadImage()
{
    var url = window.location.hash.replace("#","");
    convertImgToDataURLviaCanvas(url, function(data){
     // document.getElementById("imagePreview").onload = __start;
 //     document.getElementById("imagePreview").src = data;
       var c = document.getElementById("imageC");
       var ctx = c.getContext("2d");
       
       var img = new Image();
            img.onload = function(){
            // c.width = img.width;
            // c.height = img.height;


             canvas = new fabric.Canvas('imageC', { selection: true, hasControls:true, width:img.width, height:img.height});
             fabric.Image.fromURL(data, function(oImg) {
              canvas.add(oImg);
              oImg.set('selectable', false);
              oImg.set('hasBorders', false);
              oImg.set('hasControls', false);
              oImg.set('lockMovementX', true);
              });

  

            canvas.on('mouse:wheel', function(opt) {

              if(!opt.e.shiftKey) return;
                
              var delta = opt.e.deltaY;
              var zoom = canvas.getZoom();
              zoom = zoom + delta/200;
              if (zoom > 2) zoom = 2;
              if (zoom < 0.05) zoom = 0.05;
              canvas.setZoom(zoom);
              opt.e.preventDefault();
              opt.e.stopPropagation();
            });
            canvas.on('mouse:down', function(o){
              if (canvas.getActiveObject())
                  return;
              isDown = true;
              var pointer = canvas.getPointer(o.e);
              origX = pointer.x;
              origY = pointer.y;
              var pointer = canvas.getPointer(o.e);
              rect = new fabric.Rect({
                  left: origX,
                  top: origY,
                  originX: 'left',
                  originY: 'top',
                  width: pointer.x-origX,
                  height: pointer.y-origY,
                  angle: 0,
                  fill: 'rgba(255,0,0,0.2)',
                  transparentCorners: false,
                  hasRotatingPoint: false
              });
              canvas.add(rect);
          });

          canvas.on('mouse:move', function(o){
              if (!isDown) return;
              var pointer = canvas.getPointer(o.e);

//$("#imageC .upper-canvas").css({cursor:"pointer"});
              if(origX>pointer.x){
                  rect.set({ left: Math.abs(pointer.x) });
              }
              if(origY>pointer.y){
                  rect.set({ top: Math.abs(pointer.y) });
              }

              rect.set({ width: Math.abs(origX - pointer.x) });
              rect.set({ height: Math.abs(origY - pointer.y) });
              console.log(pointer);

              canvas.renderAll();
          });

          canvas.on('mouse:up', function(o){
              if (isDown) {
                rect.setCoords();
                isDown = false;
              }
          });
        }
        img.src = data;

      activityIndicator.hide();
      /*
      inst = panzoom(document.getElementById("imagePreview"), {
          maxZoom: 10,
          minZoom: 0.1,
          smoothScroll: true,
          beforeWheel: function(e) {
            // allow wheel-zoom only if altKey is down. Otherwise - ignore
           // return false;
            var shouldIgnore = !e.shiftKey;
            return shouldIgnore;
          }
        });
       */
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

