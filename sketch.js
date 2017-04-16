// Written by Daniel Shiffman live on YouTube
// Adjusted by Rafael Neumann

var vehicles = [];
var food = [];
var poison = [];
var my_canvas;
var number_of_food_elements = 50;
var number_of_poison_elements = 10;
var initial_population_size = 50;
var max_poison_allowed = 100;
var max_food_allowed = 100;
var total_fights = 0;

// Setup for p5.js
function setup() {
  my_canvas = createCanvas(windowWidth - 10, windowHeight - 100);
  my_canvas.parent('main_canvas');
  // Create vehicles
  for (let i = 0; i < initial_population_size; i++) {
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

  let total_health = 0;
  
  // Call the appropriate behavior for our agents
  for (let i = 0; i < vehicles.length; i++) {
    total_health += vehicles[i].health;
    vehicles[i].behavior(food, poison);
    vehicles[i].boundaries();
    vehicles[i].update();
    vehicles[i].display();
	vehicles[i].fight(vehicles, i);
	
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
    let prob = float(document.getElementById("food_prob").value);
	max_food_allowed = int(document.getElementById("max_food").value);
	
	if (random() < prob && food.length < max_food_allowed) {
      add_food();
    }
  
    // More poison?
	prob = float(document.getElementById("poison_prob").value);
	max_poison_allowed = int(document.getElementById("max_poison").value);
	if (random() < prob && poison.length < max_poison_allowed) {
      add_poison();
    }
  }
  
  // Population info
  stroke(255);
  fill(255);
  textSize(22);
  text("Population: " + vehicles.length, 1, 20);
  text("Total health: " + nf(total_health, 0, 2), 1, 40);
  text("Total food: " + food.length, 1, 60);
  text("Total poison: " + poison.length, 1, 80);
  text("Total fights: " + total_fights, 1, 100);
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
