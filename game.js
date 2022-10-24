var myGameArea;
var myScore;
var myGamePiece;
var myObstacles = [];

function restartGame() {
document.getElementById("myfilter").style.display ="none";
document.getElementById("comment").style.display ="block";
document.getElementById("myrestartbutton").style.display ="none";
document.getElementById("controlbutton").style.display ="block";
myGameArea.stop();
myGameArea.clear();
myGameArea = {};
myGamePiece = {};
myObstacles = [];
myScore = {};
document.getElementById("canvascontainer").innerHTML ="";
startGame();
}

function startGame() {
    myGameArea = new gamearea();
    myScore = new component("30px", "consolas", "black", 280, 40, "text");
    myGamePiece = new component(30, 30, "mongshu1.gif", 10, 120, "image");
    myGameArea.start();

}

function gamearea() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 480;
    this.canvas.height = 270;

    document.getElementById("canvascontainer").prepend(this.canvas);
    this.context = this.canvas.getContext("2d");
    this.pause = false;
    this.frameNo = 0;
    this.start = function() {
      this.interval = setInterval(updateGameArea, 20);
    }
      this.stop = function() {
        clearInterval(this.interval);
        this.pause = true;
      }
    this.clear = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 ==0) {return true;}
  return false;
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image"){
      this.image = new Image();
      this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.bounce = 0.6;
    this.update = function() {
      ctx = myGameArea.context;
      if (this.type == "text") {
        ctx.font = this.width+" "+this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
      } else {
        if (type == "image"){
          ctx.drawImage(this.image,
          this.x,
          this.y,
          this.width, this.height);
        } else{
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    }
  }
  this.newPos= function() {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY +this.gravitySpeed;
    this.hitBottom();
    this.hitTop();
  }
  this.hitBottom =function() {
    var rockbottom = myGameArea.canvas.height -this.height;
    if (this.y > rockbottom){
      this.y = rockbottom;
      this.gravitySpeed = -(this.gravitySpeed*this.bounce);
    }
  }
  this.hitTop =function() {
    var rocktop = 0;
    if (this.y < rocktop){
      this.y = rocktop;
      this.gravitySpeed = -(this.gravitySpeed*this.bounce);
    }
  }

  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) ||
        (myleft > otherright)) {
          crash = false;
        }
        return crash;
  }
}

function updateGameArea() {
  var x, y, height, gap, minHeight, maxHeight, minGap, maxGap;
  for (i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      myGameArea.stop();
      document.getElementById("comment").style.display ="block";
      document.getElementById("controlbutton").style.display ="block";
      document.getElementById("myfilter").style.display ="block";
      document.getElementById("myrestartbutton").style.display ="block";
      return;
    }
  }
  if (myGameArea.pause ==false){
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if (myGameArea.frameNo == 1 || everyinterval(150)) {
    x = myGameArea.canvas.width;
    y = myGameArea.canvas.height;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
    minGap = 35;
    maxGap = 200;
    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    myObstacles.push(new component(10, height, "green", x, 0));
    myObstacles.push(new component(10, y - height - gap , "green", x, height + gap));
  }
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }
  myScore.text = "SCORE: " + myGameArea.frameNo;
  myScore.update();
  myGamePiece.newPos();
  myGamePiece.update();
}
}

function moveleft() {
  myGamePiece.speedX -= 1;
}
function moveright() {
  myGamePiece.speedX += 1;
}
function moveup() {
  myGamePiece.speedY -= 1;
}
function movedown() {
  myGamePiece.speedY += 1;
}
function clearmove() {
  myGamePiece.image.src = "mongshu1.gif"
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
}

function accelerate(n) {
  myGamePiece.gravity = n;
}

//터치스크린용
document.addEventListener("touchstart", e => {
    accelerate(-0.2);
})
document.addEventListener("touchend", e => {
  accelerate(0.05);
})
//터치스크린용 끝
startGame();
