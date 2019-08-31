var start = function()
{
  activityIndicator.show(); // show spinner
  $('.sidenav').sidenav({edge:'right',draggable: false});
  loadInsp();
  loadImage();
  window.addEventListener('keydown', function (e) {
    var kp = e.ctrlKey || e.keyCode;
    if(kp == 8 || kp == 46){
      canvas.remove(canvas.getActiveObject());
      refreshBoxData();
    }
  });

  $(".menuMarkup").focusin(function(){
     canvas.discardActiveObject();
     canvas.requestRenderAll();
  });
}

var theImage = {};
var theBoxes = {
  list: [],
  update: function(){
  }
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


            theImage.path = url;
            theImage.width = img.width;
            theImage.height = img.height;
            theImage.data = data;
             canvas = new fabric.Canvas('imageC', { selection: true, hasControls:true, width:img.width, height:img.height});
             /*
            theImage.obj = new fabric.Image.fromURL(data, function(oImg) {
              canvas.add(oImg);
              oImg.set('selectable', false);
              oImg.set('hasBorders', false);
              oImg.set('hasControls', false);
              oImg.set('lockMovementX', true);
              });
             */

            canvas.setBackgroundImage(
              data,
             canvas.renderAll.bind(canvas)
            );

  
            canvas.on('selection:created', (e) => {
  if(e.target.type === 'activeSelection') {
    canvas.discardActiveObject();
  } else {
    //do nothing
  }
})

  canvas.on('object:moving', function (e) {
        var obj = e.target;
        var zoom = canvas.getZoom();
         // if object is too big ignore
        if(obj.currentHeight > obj.canvas.height*zoom || obj.currentWidth > obj.canvas.width*zoom){
            return;
        }
        obj.setCoords();
        // top-left  corner
        if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
            obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
            obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
        }
        // bot-right corner
        if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height*zoom || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width*zoom){
            obj.top = Math.min(obj.top, obj.canvas.height*zoom-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
            obj.left = Math.min(obj.left, obj.canvas.width*zoom-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
        }
});

  canvas.on('object:scaling', function (e) {
        var obj = e.target;
        var zoom = canvas.getZoom();
         // if object is too big ignore
        if(obj.currentHeight > obj.canvas.height*zoom || obj.currentWidth > obj.canvas.width*zoom){
            return;
        }
        obj.setCoords();
        // top-left  corner
        if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
            obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
            obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
        }
        // bot-right corner
        if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height*zoom || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width*zoom){
            obj.top = Math.min(obj.top, obj.canvas.height*zoom-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
            obj.left = Math.min(obj.left, obj.canvas.width*zoom-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
        }
});

canvas.on('selection:created', function (e) {
  const activeSelection = e.target
  activeSelection.set({hasRotatingPoint: false})
})

// fired e.g. when you select one object first,
// then add another via shift+click
canvas.on('selection:updated', function (e) {
  const activeSelection = e.target
  if (activeSelection.hasRotatingPoint) {
    activeSelection.set({hasRotatingPoint: false})
  }
})

            canvas.on('mouse:wheel', function(opt) {

              if(!opt.e.shiftKey) return;
                
              var delta = opt.e.deltaY;
              var zoom = canvas.getZoom();
              zoom = zoom + delta/200;
              if (zoom > 5) zoom = 5;
              if (zoom < 0.05) zoom = 0.05;
              canvas.setZoom(zoom);
              canvas.setWidth(theImage.width* zoom);
              canvas.setHeight(theImage.height* zoom);
             // canvas.renderAll();
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
                  lockRotation: true,
                  angle: 0,
                  fill: 'rgba(255,0,0,0.4)',
                  transparentCorners: false,
                  hasRotatingPoint: false
              });
              canvas.add(rect);
          });

          canvas.on('mouse:move', function(o){
              if (!isDown) return;
              var pointer = canvas.getPointer(o.e);

              if(origX>pointer.x){
                  rect.set({ left: Math.abs(pointer.x) });
              }
              if(origY>pointer.y){
                  rect.set({ top: Math.abs(pointer.y) });
              }

              rect.set({ width: Math.abs(origX - pointer.x) });
              rect.set({ height: Math.abs(origY - pointer.y) });

              canvas.renderAll();
              refreshBoxData();
          });

          canvas.on('mouse:up', function(o){
              if (isDown) {
                var pointer = canvas.getPointer(o.e);
                if((pointer.x-origX) * (pointer.y-origY) < 200){
                  canvas.remove(rect);
                }
                else{
                  rect.setCoords();
                }
                isDown = false;
              }
            refreshBoxData();
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


function getJSONAnnots()
{
  var annotation = {
    filename : theImage.path,
    path : theImage.path,
    object : []
  };
  var objs = canvas.getObjects();
  for(var i = 0; i < objs.length; i++){
    var o = objs[i];
    var objObj = {
      name : "",
      pose : undefined,
      truncated: 1,
      difficult: 0,
      bndbox:{
        xmin: o.left,
        ymin: o.top,
        xmax: o.left + o.width,
        ymax: o.top + o.height
      }
    }
    annotation.object.push(objObj);
  }

  return {annotation:annotation};
}

function getXMLAnnots()
{
  var x2js = new X2JS();
  var jsonObj = getJSONAnnots();
  return  x2js.json2xml_str( jsonObj );
}



function setBoxHTML()
{
  var objs = canvas.getObjects();
  var markup = "";
  if(objs.length == 0){
    document.getElementById("boxesList").innerHTML = "<h4>No boxes yet</h4>";
   return; 
  }
  for(var i = 0; i < objs.length; i++){
    var o = objs[i];
    
    var cn = "box" + i + new Date().getTime();
    markup += "<div id='aBox' class='"+ cn +"' data-cn='"+ cn +"' data-id='"+i+"'> "+
    "<input id ='test'  class='name col8' onchange='updateName(event)' ondblclick= 'boxSelect(event)'>" +
    "<button onclick='deleteBox(event)'>Delete</button>"+
    "</div>";
    $("." + cn+ " .name").val(o.name || "Untitled")
    $("." + cn+ " .label").val(o.label || "no label")





  }


  document.getElementById("boxesList").innerHTML = markup;
}


function refreshBoxData()
{
  $(".ccpta.base64Clip").val(getXMLAnnots())
  $(".ccpta.cssClip").val(JSON.stringify(getJSONAnnots()));
  setBoxHTML();
  $(".collapsible").collapsible("open", 1);
}

function deleteBox(e)
{
  var boxid = e.target.parentElement.dataset.id;
  var cn = e.target.parentElement.dataset.cn;
  
  canvas.remove(canvas.getObjects()[boxid])
  $(".ccpta.base64Clip").val(getXMLAnnots())
  $(".ccpta.cssClip").val(JSON.stringify(getJSONAnnots()));
  $("#boxesList ." + cn).remove();
  if (canvas.getObjects().length == 0) refreshBoxData();
  
}

//document.getElementById("imageWrapper").tabIndex = 1000;

function boxSelect(e)
{
  var boxid = e.target.parentElement.dataset.id;
  var cn = e.target.parentElement.dataset.cn;
  console.log(boxid);
  //var text1= getElementById("test");
  //var sub= text1.innerHTML;
 
  
  canvas.setActiveObject(canvas.getObjects()[boxid]);
  canvas.renderAll();
  
  
  refreshBoxData();
  
  return;


  
  

}
 
