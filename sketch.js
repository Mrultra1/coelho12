const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var plank;
var ground;
var higherground;
var con;
var con2;
var rope;
var rope2;
var bubble, bubble_img;
var fruit;
var button, button2;
var bunny;
var blink, eat, sad;
var food, rabbit, bg_img, star_img;
var hasEaten = false; // Flag para controlar o estado de "comer"
var isFruitFree = false; // Flag para verificar se a melancia está solta

function preload() {
  bubble_img = loadImage("bubble.png");
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');
  
  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
  star_img = loadImage('star.png');
  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false; 
}

function setup() {
  createCanvas(500, 800);
  frameRate(80);
  engine = Engine.create();
  world = engine.world;

  var fruit_options = {
    restitution: 0.8
  };

  ground = new Ground(250, height - 10, width, 20);
  fruit = Bodies.circle(100, 400, 15, fruit_options);
  World.add(world, fruit);

  bubble = createSprite(290, 460, 20, 20);
  bubble.addImage(bubble_img);
  bubble.scale = 0.1;

  blink.frameDelay = 20;
  eat.frameDelay = 10; // Ajuste a velocidade do frame, se necessário
  bunny = createSprite(270, 100, 100, 100);
  bunny.addImage(rabbit);
  bunny.scale = 0.2;
  higherground = new Ground(300, 170, 100, 10);

  bunny.addAnimation('blinking', blink);
  bunny.addAnimation('eating', eat);
  bunny.addAnimation('crying', sad);
  bunny.changeAnimation('blinking');

  rope = new Rope(4, {x: 230, y: 330});
  rope2 = new Rope(4, {x: 50, y: 450});
  con = new Link(rope, fruit);
  con2 = new Link(rope2, fruit);

  button = createImg('cut_btn.png');
  button.position(200, 320);
  button.size(50, 50);
  button.mouseClicked(remove_rope);

  button2 = createImg('cut_btn.png');
  button2.position(30, 420);
  button2.size(50, 50);
  button2.mouseClicked(drop);

  ellipseMode(RADIUS);
}

function draw() {
  background(51);
  image(bg_img, 0, 0, width, height);
  Engine.update(engine);
  
  push();
  imageMode(CENTER);
  if (fruit != null) {
    image(food, fruit.position.x, fruit.position.y, 70, 70);
  }
  pop();

  ground.show();
  higherground.show();
  rope.show();
  rope2.show();

  // Verifica se a melancia tocou o coelho e está solta
  if (collide(fruit, bunny, 80) && isFruitFree && !hasEaten) {
    bunny.changeAnimation('eating');
    bunny.animation.playing = true; // Reproduzir a animação de comer
    hasEaten = true; // Marca que a animação já começou
    bubble.visible = false; // Remove a bolha
    World.remove(engine.world, fruit); // Remove a melancia do mundo
    fruit = null; // Define a melancia como null para que não seja desenhada
  }

  if (collide(fruit, bubble, 40)) {
    engine.world.gravity.y = -1;
    bubble.position.x = fruit.position.x;
    bubble.position.y = fruit.position.y;
  }

  drawSprites();
}

function drop() {
  rope2.break();
  con2.dettach();
  con2 = null;
  isFruitFree = true; // Marca que a melancia está solta
}

function remove_rope() {
  rope.break();
  con.dettach();
  con = null;
  isFruitFree = true; // Marca que a melancia está solta
}

function collide(body, sprite, x) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    return d <= x;
  }
  return false;
}
