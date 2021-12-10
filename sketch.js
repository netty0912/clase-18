//variables del estado del juego.
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//creación de variables de los elementos del juego.
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var rand;
var cloud, cloudImage, cloudsGroup;
var obstacle1, obstacle2, obstable3, obstacle4, obstacle5, obstacle6, obstaclesGroup;
var score;
var gameOver, restart;
var jumpSound, diedSound, checkPointSound;

function preload(){
  //Animación del Trex
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  //Animación del suelo
  groundImage = loadImage("ground2.png");
  
  //animación de las nubes
  cloudImage = loadImage("cloud.png");
  
  //animación de los obstáculos.
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  //imagenes de game over y restart.
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png")
  
  //cargar los sonidos del tRex
  jumpSound = loadSound("jump.mp3");
  diedSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
}

function setup() {
  //creación del lienzo.
  createCanvas(windowWidth, windowHeight);

  //Sprite del Trex
  trex = createSprite(50,height-75,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 0.5;
  
  //sprite del suelo.
  ground = createSprite(width/2,height-68,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //sprite del suelo invisible
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
    
  //crea grupos de obstáculos y nubes
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //creación de los sprites de game over y restart
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.75;
  gameOver.visible = false;
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale =0.5;
  restart.visible = false;
     
  //activar el radio de colisión.
  trex.setCollider("rectangle", 0,0,trex.width,trex.height);
  trex.debug = false;
  
  //mostrar el score.
  score = 0;
  
  
  
}

function draw() {
  //fondo del lienzo.
  background("#7972ee");
  
    
  //posicionar el score dentro del juego.
  fill("white");
  text("Score: "+ score, 30,50);
  
  //Mostrar el estado del juego en la consola.
  console.log("Estado del juego ", gameState);
    
  //Estado del juego modo PLAY.
  if (gameState === PLAY) {
    
    //la veloicidad del suelo
    ground.velocityX = -(4 + 3 * score / 100);
    
    //Mostrar la puntuación del juego
     score = score + Math.round(frameRate()/60);
    
    //Cargar sonido a nuestra puntuación.
    if (score > 0 && score % 100 === 0){
      checkPointSound.play();
    }
    
    //suelo infinito
    if (ground.x < 0){
         ground.x = ground.width/2;
       }
    
    //salta el tRex cuando precionamos la barra espaciadora
     if((touches.length >0 || keyDown("space")) && trex.y >= height-120) {
      trex.velocityY = -13;
      jumpSound.play();
       touches = [];
       
       }
    
    //Gravedad del trex
    trex.velocityY = trex.velocityY + 0.8
  
    //Funciones de nubes y obstáculos
      spawnClouds();
      spawnObstacles();
  
    //Cuando chocan los obstáculos con el trex.
    if (obstaclesGroup.isTouching(trex)){
      gameState = END;
      diedSound.play();
      //trex.velocityY = -13;
      //jumpSound.play();
      }
  }
  
  //Estado del juego modo END.
  else if (gameState === END){
      
    //Velocidad del suelo.
    ground.velocityX = 0;
      
    //velocidad del Trex.
    trex.velocityY = 0;
       
    //cambia la animacion del trex
    trex.changeAnimation("collided",trex_collided);
    
    //ciclo de vida a los objetos para que no se destruyan
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //Resetea la velocidad de los grupos de obstáculos y nubes.
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //Mostrar en el estado del juego END
    gameOver.visible = true;
    restart.visible = true;
      
    //dar click al sprite de restart.
    if(mousePressedOver(restart)) {
    reset();
  }
    
}
  
  //El Trex toca el suelo.
  trex.collide(invisibleGround);
 
  
    
  drawSprites();
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   
   //crear el sprite de los obstáculos.
   obstacle = createSprite (600,height-87,20,30);
    
   //velocidad de los obstáculos.
   obstacle.velocityX = -(6 + score / 100);
  
    //genera obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asigna escala y ciclo de vida a los obstáculos           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //añade cada obstáculo al grupo
   obstaclesGroup.add(obstacle);
   
 }
}

function spawnClouds() {
  
  //escribe aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
    
    
  }
  
}

function reset(){
 gameState = PLAY; 
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
}