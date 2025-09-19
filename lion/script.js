
//THREEJS RELATED VARIABLES 

var scene, 
    camera,
    controls,
    fieldOfView,
  	aspectRatio,
  	nearPlane,
  	farPlane,
    shadowLight, 
    backLight,
    light, 
    renderer,
		container;

var clock = new THREE.Clock();
var time = 0;
var deltaTime = 0;

//SCENE
var floor, lion, fan,
    isBlowing = false;

//SCREEN VARIABLES

var HEIGHT,
  	WIDTH,
    windowHalfX,
  	windowHalfY,
    mousePos = {x:0,y:0};
    dist = 0;

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function init(){
  scene = new THREE.Scene();
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 2000; 
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane);
  camera.position.z = 800;  
  camera.position.y = 0;
  camera.lookAt(new THREE.Vector3(0,0,0));    
  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMapEnabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('mousedown', handleMouseDown, false);
  document.addEventListener('mouseup', handleMouseUp, false);
  document.addEventListener('touchstart', handleTouchStart, false);
	document.addEventListener('touchend', handleTouchEnd, false);
	document.addEventListener('touchmove',handleTouchMove, false);
  /*
  controls = new THREE.OrbitControls( camera, renderer.domElement);
  //*/
}

function onWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
  mousePos = {x:event.clientX, y:event.clientY};
}

function handleMouseDown(event) {
  isBlowing = true;
}
function handleMouseUp(event) {
  isBlowing = false;
}

function handleTouchStart(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
		mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
    isBlowing = true;
  }
}

function handleTouchEnd(event) {
    //mousePos = {x:windowHalfX, y:windowHalfY};
    isBlowing = false;
}

function handleTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
		mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
    isBlowing = true;
  }
}

function createLights() {
  light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)
  
  shadowLight = new THREE.DirectionalLight(0xffffff, .8);
  shadowLight.position.set(200, 200, 200);
  shadowLight.castShadow = true;
  shadowLight.shadowDarkness = .2;
 	
  backLight = new THREE.DirectionalLight(0xffffff, .4);
  backLight.position.set(-100, 200, 50);
  backLight.shadowDarkness = .1;
  backLight.castShadow = true;
 	
  scene.add(backLight);
  scene.add(light);
  scene.add(shadowLight);
}

function createFloor(){ 
  floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,500), new THREE.MeshBasicMaterial({color: 0xebe5e7}));
  floor.rotation.x = -Math.PI/2;
  floor.position.y = -100;
  floor.receiveShadow = true;
  scene.add(floor);
}

function createLion(){
  lion = new Lion();
  scene.add(lion.threegroup);
}

function createFan(){
  fan = new Fan();
  fan.threegroup.position.z = 350;
  scene.add(fan.threegroup);
}

Fan = function(){
  this.isBlowing = false;
  this.speed = 0;
  this.acc =0;
  this.redMat = new THREE.MeshLambertMaterial ({
    color: 0xad3525, 
    shading:THREE.FlatShading
  });
  this.greyMat = new THREE.MeshLambertMaterial ({
    color: 0x653f4c, 
    shading:THREE.FlatShading
  });
  
  this.yellowMat = new THREE.MeshLambertMaterial ({
    color: 0xfdd276, 
    shading:THREE.FlatShading
  });
  
  var coreGeom = new THREE.BoxGeometry(10,10,20);
  var sphereGeom = new THREE.BoxGeometry(10, 10, 3);
  var propGeom = new THREE.BoxGeometry(10,30,2);
  propGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 0,25,0) );
  
  this.core = new THREE.Mesh(coreGeom,this.greyMat);
  
  // propellers
  var prop1 = new THREE.Mesh(propGeom, this.redMat);
  prop1.position.z = 15;
  var prop2 = prop1.clone();
  prop2.rotation.z = Math.PI/2;
  var prop3 = prop1.clone();
  prop3.rotation.z = Math.PI;
  var prop4 = prop1.clone();
  prop4.rotation.z = -Math.PI/2;
  
  this.sphere = new THREE.Mesh(sphereGeom, this.yellowMat);
  this.sphere.position.z = 15;
  
  this.propeller = new THREE.Group();
  this.propeller.add(prop1);
  this.propeller.add(prop2);
  this.propeller.add(prop3);
  this.propeller.add(prop4);
  
  this.threegroup = new THREE.Group();
  this.threegroup.add(this.core);
  this.threegroup.add(this.propeller);
  this.threegroup.add(this.sphere);
}

Fan.prototype.update = function(xTarget, yTarget, deltaTime){
  this.threegroup.lookAt(new THREE.Vector3(0,80,60));
  this.tPosX = rule3(xTarget, -200, 200, -250, 250);
  this.tPosY = rule3(yTarget, -200, 200, 250, -250);

  this.threegroup.position.x += (this.tPosX - this.threegroup.position.x) * deltaTime * 4;
  this.threegroup.position.y += (this.tPosY - this.threegroup.position.y) * deltaTime * 4;
  
  this.targetSpeed = (this.isBlowing) ? 15 * deltaTime: 5 * deltaTime;
  if (this.isBlowing && this.speed < this.targetSpeed){
    this.acc += .01 * deltaTime;
    this.speed += this.acc;
  }else if (!this.isBlowing){
    this.acc = 0;
    this.speed *= Math.pow(.4, deltaTime);
  }
  this.propeller.rotation.z += this.speed ; 
}

Lion = function(){
  this.windTime = 0;
  this.bodyInitPositions = [];
  this.maneParts = [];
  this.threegroup = new THREE.Group();
  this.yellowMat = new THREE.MeshLambertMaterial ({
    color: 0xfdd276, 
    shading:THREE.FlatShading
  });
  this.redMat = new THREE.MeshLambertMaterial ({
    color: 0xad3525, 
    shading:THREE.FlatShading
  });
  
  this.pinkMat = new THREE.MeshLambertMaterial ({
    color: 0xe55d2b, 
    shading:THREE.FlatShading
  });
  
  this.whiteMat = new THREE.MeshLambertMaterial ({
    color: 0xffffff, 
    shading:THREE.FlatShading
  });
  
  this.purpleMat = new THREE.MeshLambertMaterial ({
    color: 0x451954, 
    shading:THREE.FlatShading
  });
  
  this.greyMat = new THREE.MeshLambertMaterial ({
    color: 0x653f4c, 
    shading:THREE.FlatShading
  });
  
  this.blackMat = new THREE.MeshLambertMaterial ({
    color: 0x302925, 
    shading:THREE.FlatShading
  });
  
  
  var bodyGeom = new THREE.CylinderGeometry(30,80, 140, 4);
  var maneGeom = new THREE.BoxGeometry(40,40,15);
  var faceGeom = new THREE.BoxGeometry(80,80,80);
  var spotGeom = new THREE.BoxGeometry(4,4,4);
  var mustacheGeom = new THREE.BoxGeometry(30,2,1);
  mustacheGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 15, 0, 0 ) );
  
  var earGeom = new THREE.BoxGeometry(20,20,20);
  var noseGeom = new THREE.BoxGeometry(40,40,20);
  var eyeGeom = new THREE.BoxGeometry(5,30,30);
  var irisGeom = new THREE.BoxGeometry(4,10,10);
  var mouthGeom = new THREE.BoxGeometry(20,20,10);
  var smileGeom = new THREE.TorusGeometry( 12, 4, 2, 10, Math.PI );
  var lipsGeom = new THREE.BoxGeometry(40,15,20);
  var kneeGeom = new THREE.BoxGeometry(25, 80, 80);
  kneeGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 50, 0 ) );
  var footGeom = new THREE.BoxGeometry(40, 20, 20);
  
  // body
  this.body = new THREE.Mesh(bodyGeom, this.yellowMat);
  this.body.position.z = -60;
  this.body.position.y = -30;
  this.bodyVertices = [0,1,2,3,4,10];
  
  for (var i=0;i<this.bodyVertices.length; i++){
    var tv = this.body.geometry.vertices[this.bodyVertices[i]];
    tv.z =70;
    //tv.x = 0;
    this.bodyInitPositions.push({x:tv.x, y:tv.y, z:tv.z});
  }
  
  // knee
  this.leftKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
  this.leftKnee.position.x = 65;
  this.leftKnee.position.z = -20;
  this.leftKnee.position.y = -110;
  this.leftKnee.rotation.z = -.3;
  
  this.rightKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
  this.rightKnee.position.x = -65;
  this.rightKnee.position.z = -20;
  this.rightKnee.position.y = -110;
  this.rightKnee.rotation.z = .3;
  
  // feet
  this.backLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
  this.backLeftFoot.position.z = 30;
  this.backLeftFoot.position.x = 75;
  this.backLeftFoot.position.y = -90;
  
  this.backRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
  this.backRightFoot.position.z = 30;
  this.backRightFoot.position.x = -75;
  this.backRightFoot.position.y = -90;
  
  this.frontRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
  this.frontRightFoot.position.z = 40;
  this.frontRightFoot.position.x = -22;
  this.frontRightFoot.position.y = -90;
  
  this.frontLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
  this.frontLeftFoot.position.z = 40;
  this.frontLeftFoot.position.x = 22;
  this.frontLeftFoot.position.y = -90;
  
  // mane
  
  this.mane = new THREE.Group();
  
  for (var j=0; j<4; j++){
    for (var k=0; k<4; k++){
      var manePart = new THREE.Mesh(maneGeom, this.redMat);
      manePart.position.x = (j*40)-60;
      manePart.position.y = (k*40)-60;
      
      var amp;
      var zOffset;
      var periodOffset = Math.random()*Math.PI*2;     
      var angleOffsetY, angleOffsetX;
      var angleAmpY, angleAmpX;
      var xInit, yInit;
      
      
      if ((j==0 && k==0) || (j==0 && k==3) || (j==3 && k==0) || (j==3 && k==3)){
        amp = -10-Math.floor(Math.random()*5);
        zOffset = -5;
      }else if (j==0 || k ==0 || j==3 || k==3){
        amp = -5-Math.floor(Math.random()*5);
        zOffset = 0;
      }else{
        amp = 0;
        zOffset = 0;
      }
      
      this.maneParts.push({mesh:manePart, amp:amp, zOffset:zOffset, periodOffset:periodOffset, xInit:manePart.position.x, yInit:manePart.position.y});
      this.mane.add(manePart);
    }
  }
  
  this.mane.position.y = -10;
  this.mane.position.z = 80;
  //this.mane.rotation.z = Math.PI/4;
  
  // face
  this.face = new THREE.Mesh(faceGeom, this.yellowMat);
  this.face.position.z = 135;
  
  // Mustaches
  
  this.mustaches = [];
  
  this.mustache1 = new THREE.Mesh(mustacheGeom, this.greyMat);
  this.mustache1.position.x = 30;
  this.mustache1.position.y = -5;
  this.mustache1.position.z = 175; 
  this.mustache2 = this.mustache1.clone();
  this.mustache2.position.x = 35;
  this.mustache2.position.y = -12;
  this.mustache3 = this.mustache1.clone();
  this.mustache3.position.y = -19;
  this.mustache3.position.x = 30;  
  this.mustache4 = this.mustache1.clone();
  this.mustache4.rotation.z = Math.PI;
  this.mustache4.position.x = -30;
  this.mustache5 = new THREE.Mesh(mustacheGeom, this.blackMat);
  this.mustache5 = this.mustache2.clone();
  this.mustache5.rotation.z = Math.PI;
  this.mustache5.position.x = -35;
  this.mustache6 = new THREE.Mesh(mustacheGeom, this.blackMat);
  this.mustache6 = this.mustache3.clone();
  this.mustache6.rotation.z = Math.PI;
  this.mustache6.position.x = -30;
  
  this.mustaches.push(this.mustache1);
  this.mustaches.push(this.mustache2);
  this.mustaches.push(this.mustache3);
  this.mustaches.push(this.mustache4);
  this.mustaches.push(this.mustache5);
  this.mustaches.push(this.mustache6);
    
  // spots
  this.spot1 = new THREE.Mesh(spotGeom, this.redMat);
  this.spot1.position.x = 39;
  this.spot1.position.z = 150;
  
  this.spot2 = this.spot1.clone();
  this.spot2.position.z = 160;
  this.spot2.position.y = -10;
  
  this.spot3 = this.spot1.clone();
  this.spot3.position.z = 140;
  this.spot3.position.y = -15;
  
  this.spot4 = this.spot1.clone();
  this.spot4.position.z = 150;
  this.spot4.position.y = -20;
  
  this.spot5 = this.spot1.clone();
  this.spot5.position.x = -39;
  this.spot6 = this.spot2.clone();
  this.spot6.position.x = -39;
  this.spot7 = this.spot3.clone();
  this.spot7.position.x = -39;
  this.spot8 = this.spot4.clone();
  this.spot8.position.x = -39;
    
  // eyes
  this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMat);
  this.leftEye.position.x = 40;
  this.leftEye.position.z = 120;
  this.leftEye.position.y = 25;
  
  this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMat);
  this.rightEye.position.x = -40;
  this.rightEye.position.z = 120;
  this.rightEye.position.y = 25;
  
  // iris
  this.leftIris = new THREE.Mesh(irisGeom, this.purpleMat);
  this.leftIris.position.x = 42;
  this.leftIris.position.z = 120;
  this.leftIris.position.y = 25;
  
  this.rightIris = new THREE.Mesh(irisGeom, this.purpleMat);
  this.rightIris.position.x = -42;
  this.rightIris.position.z = 120;
  this.rightIris.position.y = 25;
  
  // mouth
  this.mouth = new THREE.Mesh(mouthGeom, this.blackMat);
  this.mouth.position.z = 171;
  this.mouth.position.y = -30;
  this.mouth.scale.set(.5,.5,1);
  
  // smile
  this.smile = new THREE.Mesh(smileGeom, this.greyMat);
  this.smile.position.z = 173;  
  this.smile.position.y = -15;
  this.smile.rotation.z = -Math.PI;
  
  // lips
  this.lips = new THREE.Mesh(lipsGeom, this.yellowMat);
  this.lips.position.z = 165;
  this.lips.position.y = -45;
  
   
  // ear
  this.rightEar = new THREE.Mesh(earGeom, this.yellowMat);
  this.rightEar.position.x = -50;
  this.ri