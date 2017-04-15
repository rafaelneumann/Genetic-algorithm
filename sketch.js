// Written by Daniel Shiffman live on YouTube
// Adjusted by Rafael Neumann

var vehicles = [];
var food = [];
var poison = [];
var my_canvas;
var number_of_food_elements = 50;
var number_of_poison_elements = 10;
var population_size = 20;
var max_poison_elements = 100;

// Setup for p5.js
function setup() {
  my_canvas = createCanvas(windowWidth, windowHeight);

  // Create vehicles
  for (let i = 0; i < population_size; i++) {
    let x = random(width);
    let y = random(height);
    vehicles.push(new Vehicle(x, y));
  }
  
  // Create food elements
  for (let i = 0; i < number_of_food_elements; i++) {
    add_food();
  }
  
  // Create poison elements
  for (let i = 0; i < number_of_poison_elements; i++) {
    add_poison();
  }

}

// Draw for p5.js
function draw() {
  background(51);

  let mouse = createVector(mouseX, mouseY);

  // Draw an ellipse at the mouse position
  fill(70);
  stroke(200);
  strokeWeight(2);
  ellipse(mouse.x, mouse.y, 48, 48);
  
  // Draw the food elements
  for (let i = 0; i < food.length; i++) {
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 8);
  }

  // Draw the poison elements
  for (let i = 0; i < poison.length; i++) {
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 8);
  }

  // Call the appropriate behavior for our agents
  for (let i = 0; i < vehicles.length; i++) {
    vehicles[i].behavior(food, poison);
    vehicles[i].boundaries();
    vehicles[i].update();
    vehicles[i].display();
    
    // Clones the creature with a probability built into the class Vehicle
    let child = vehicles[i].clone_me();
    if (child !== null) {
      vehicles.push(child);
    }
    
    // Did it die?
    if (vehicles[i].dead()) {
      vehicles.splice(i, 1);
      i--;
    }
  }

  // Game over
  if (vehicles.length === 0) {
    textAlign(CENTER, CENTER);
    stroke(255);
    textSize(80);
    text("LIFE IS OVER", width/2, height/2);
    //noLoop();  
  } else {
    // Need more food? ;)
    if (random() < 0.15) {
      add_food();
    }
  
    // More poison?
    if (random() < 0.05 && poison.length < max_poison_elements) {
      add_poison();
    }
  }
}

// Other functions

// Add a food element in the canvas
function add_food() {
  let x = random(width);
  let y = random(height);
  food.push(createVector(x, y));
}

// Add a poison element in the canvas
function add_poison() {
  let x = random(width);
  let y = random(height);
  poison.push(createVector(x, y));
}
