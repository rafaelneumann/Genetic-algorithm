// The Vehicle class

function Vehicle(x, y, dna) {
  // VARIABLES
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 6;
  this.maxspeed = 5;
  this.maxforce = 0.5;
  this.dna = [];
  this.health = 1;
      
  if (dna === undefined) {
    this.dna[0] = random(-4, 4); // food behavior
    this.dna[1] = random(-4, 4); // poison behavior
    this.dna[2] = random(10, 100); // food perception
    this.dna[3] = random(10, 100); // poison perception
    this.health = 1;
  } else {
    this.dna[0] = dna[0] + random(-1, 1);
    this.dna[1] = dna[1] + random(-1, 1);
    this.dna[2] = dna[2] + random(-10, 10);
    this.dna[3] = dna[3] + random(-10, 10);
    
    //this.dna[2] = this.dna[2] > 100 ? 100 : this.dna[2]
    this.dna[2] = this.dna[2] < 10 ? 10 : this.dna[2];
    //this.dna[3] = this.dna[3] > 100 ? 100 : this.dna[3];
    this.dna[3] = this.dna[3] < 10 ? 10 : this.dna[3]; 
  }
  // METHODS
  
  // Apply a force
  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // Apply the behaviors to the creature
  this.behavior = function(good, bad) {
    let steerG = this.eat(good, 0.2);
    let steerB = this.eat(bad, -0.5);
    
    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);
    
    this.applyForce(steerG);
    this.applyForce(steerB);
  }

  // Create boundaries so the creature stay in the canvas world
  this.boundaries = function() {
  
    let d = 25;
    let desired = null;
    
    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    }
    
    else if (this.position.x > width -d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height-d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  };
  
  // Clone or reproduce this creature sometimes;
  this.clone_me = function() {
    if (random() < 0.001) {
      return new Vehicle(this.position.x, this.position.y, this.dna.slice());
    } else {
      return null;
    }
  }
  
  // Is the creature alive?
  this.dead = function() {
    return (this.health <= 0);
  }
  
  // Draw a triangle rotated in the direction of velocity
  this.display = function() {
    var theta = this.velocity.heading() + PI/2;
    
    let green = color(0, 255, 0);
    let red   = color(255, 0, 0);
    let col   = lerpColor(red, green, this.health);
    fill(col);
    
    stroke(200);
    strokeWeight(1);
    push();
    translate(this.position.x,this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r*2);
    vertex(-this.r, this.r*2);
    vertex(this.r, this.r*2);
    endShape(CLOSE);
    
    noFill();
    strokeWeight(2);
    
    // Food stuff
    stroke(0, 255, 0);
    line(0, 0, 0, -this.dna[0] * 20);
    ellipse(0, 0, this.dna[2] * 2);
    
    // Poison stuff
    stroke(255, 0, 0);
    line(0, 0, 0, -this.dna[1] * 20);
    ellipse(0, 0, this.dna[3] * 2);
    
    pop();
  }
  
  // Eats an element in the list (food or poison)
  this.eat = function(list, nutritional_value) {
    let record = Infinity;
    let closest_index = -1;
    let vision = (nutritional_value > 0 ? 2 : 3);
    
    for (let i = 0; i < list.length; i++) {
      let distance = this.position.dist(list[i]);
      if (distance < record && distance <= this.dna[vision]) {
        record = distance;
        closest_index = i;
      }
    }
    
    if (record < 10) {
      list.splice(closest_index, 1);
      this.health += nutritional_value;
      return createVector(0, 0);
    } else if (closest_index > -1) {
      return this.seek(list[closest_index]);
    }
    
    return createVector(0, 0);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function(target) {

    let desired = p5.Vector.sub(target, this.position);  // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force

    //this.applyForce(steer);
    return steer;
  }

  // Method to update location
  this.update = function() {
    // Decrease health
    this.health -= 0.003;
    
    // Update velocity
    this.velocity.add(this.acceleration);
    
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }
}
