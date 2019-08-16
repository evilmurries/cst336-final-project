
USE heroku_d27a5db666d1cf0;

SET @@auto_increment_increment=1;


-- Drop Tables
DROP TABLE IF EXISTS administration;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS adopted_pets;
DROP TABLE IF EXISTS animals;

-- Create Tables
-- Types of pets for adoption
CREATE TABLE animals (
	id INT  AUTO_INCREMENT,
    animal VARCHAR(100),
    PRIMARY KEY (id)
);

-- Pets available for adoption
CREATE TABLE pets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pet_name VARCHAR(50),
  animal_type INT,
  adoption_fee DECIMAL(8, 2),
  location VARCHAR(250),
  image VARCHAR(200),
  description VARCHAR(500),
);

-- Admin users
CREATE TABLE administration (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(50) NOT NULL,
  user_password VARCHAR(100) NOT NULL,
  real_name VARCHAR(25) NOT NULL
);

-- Pets successfully adopted
CREATE TABLE adopted_pets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pet_name VARCHAR(50),
  animal_type INT,
  adoption_fee DECIMAL(8, 2),
  location VARCHAR(250),
  image VARCHAR(200),
  description VARCHAR(500),
  CONSTRAINT adopted_animal_type_fk FOREIGN KEY (animal_type) REFERENCES animals(id)
);

-- Insert Data | Everyone update your admin values here
-- 4 admin users
INSERT INTO administration (user_name, user_password, real_name) VALUES ("cpiwarski", "$2a$10$egYVqF6xWNkZACKApWpY0eVZzFIfHcdHym6153TlNEyKegZ6oLpsa", "Chris");
INSERT INTO administration (user_name, user_password, real_name) VALUES ("mmariscal", "$2a$10$URJWRSUvCCL5g8CGsbtl0uAUrMSIeOu3rFVt9w9S9NRlsLVdkAFEm", "Mark");
INSERT INTO administration (user_name, user_password, real_name) VALUES ("warobleh", "$2a$10$fi6CMTE4D3Qa/H./SNT78Os5y.mwgHM0kOGkmOa/Ttl2.s7F2SYBa", "Wais");
INSERT INTO administration (user_name, user_password, real_name) VALUES ("jseals", "$2a$10$HwtCch2kloYVmOd6fjLdwOkwdsjNIBkpMQaGsX0267Ez6yWt6uGOK", "John");
 
 -- 7 animals
INSERT INTO animals (animal) VALUES ("dog");
INSERT INTO animals (animal) VALUES ("cat");
INSERT INTO animals (animal) VALUES ("horse");
INSERT INTO animals (animal) VALUES ("guinea pig");
INSERT INTO animals (animal) VALUES ("rabbit");
INSERT INTO animals (animal) VALUES ("alligator");
INSERT INTO animals (animal) VALUES ("otter");
 
 -- 5 Dogs
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Charles", 1, 50.00, "Union City", "img/adoptions/charles.jpg", "Lovable little pup!");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Louis", 1, 75.00, "Santa Clara", "img/adoptions/louis.jpg", "Big fuzzy pal");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Toshi", 1, 25.00, "Los Angeles", "img/adoptions/toshi.jpg", "Small guy with a big attitude.");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Reginald", 1, 50.00, "Oakland", "img/adoptions/reginald.jpg", "Noble and loyal pal!");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Marcus", 1, 200.00, "Santa Clara", "img/adoptions/marcus.jpg", "Highly intelligent and precocious.");

-- 8 Cats
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Donut", 2, 25.00, "San Jose", "img/adoptions/donut.jpg", "Small guy with a big attitude.");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Woody", 2, 50.00, "San Francisco", "img/adoptions/woody.jpg", "Snuggle Buddy.");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Mittens", 2, 200.00, "Santa Clara", "img/adoptions/mittens.jpg", "Cute troublemaker!");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Francis", 2, 100.00, "Portland", "img/adoptions/francis.jpg", "Always sleepy!");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Jerry", 2, 25.00, "San Jose", "img/adoptions/jerry.jpg", "Favorite food is jalapeno poppers.");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Prudence", 2, 50.00, "San Francisco", "img/adoptions/prudence.jpg", "Snuggle Buddy.");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Spots", 2, 25.00, "San Jose", "img/adoptions/spots.jpg", "Very large.");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Tracy", 2, 50.00, "San Francisco", "img/adoptions/tracy.jpg", "Big Jay Z fan.");

-- 2 Horses
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Annie", 3, 50.00, "Menlo Park", "img/adoptions/annie.jpg", "Loves carrots.");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Herbert", 3, 200.00, "Atherton", "img/adoptions/herbert.jpg", "Noble steed.");

-- 1 Guinea Pigs
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Mr. Wiggles", 4, 200.00, "Orange County", "img/adoptions/wiggles.jpg", "Wealthy newspaper magnate and Rhodes Scholar.");

-- 3 Rabbits
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Hops", 5, 50.00, "Union City", "img/adoptions/hops.jpg", "Loves Basketball.");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Sandy", 5, 75.00, "Santa Clara", "img/adoptions/sandy.jpg", "Fluffy and colorful.");
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Harold", 5, 25.00, "Los Angeles", "img/adoptions/harold.jpg", "Contemplative philosopher");

-- 1 Gator
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Gator", 6, 5000.00, "San Francisco", "img/adoptions/gator.jpg", "Tough looking dude!");

-- 1 Otter
INSERT into pets (pet_name, animal_type, adoption_fee, location, image, description) VALUES ("Monte", 7, 9001.00, "Monterey Bay", "img/adoptions/monte.jpg", "A personal favorite");


