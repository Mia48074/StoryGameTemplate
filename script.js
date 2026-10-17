
// --------------------------------------------------
// SCENES
// Read through the comments below to see what this section does
//
// TO CUSTOMIZE THIS SECTION
// 1) add fields for each scene, as relevant, to match your mockup
// 2) customize the scenes to fit your story
// 3) add any new fields to the function below
// --------------------------------------------------

// First, we create a variable for the current scene being displayed
let currentScene = "backyard";

// Then, we create an object that stores the data for each scene,
const scenes = {
  // See "backyard" for the first example
  backyard: {
    title: "Location: Backyard",
    character: "Interviewee:Grandma",
    text: "Text: well what I remember happening is that Darcie went inside to play with her pretend kitchen, I heard her neighbor mention he was really hungry, and the dog ran around really quickly",
    // you can choose how many choices to include
    // each choice can have text, an action, and/or nextScene
    choices: [
      {
        text: "Chase after the dog (-10 HP)",
        action: function () {
          updateStress(-10);
        },
        nextScene: "entrance"
      },
      {
        text: "Ask about the neighbor",
        nextScene: "hallway"
      },
      {
          text: "Pick up the brass key",
          action: function () {
            pickUpItem("brass key");
          },
          nextScene: "hallway"
      }
    ]
  },

  interrogation: {
    title: "Location: Interrogation Room",
    character: "Interviewee: Anna Smith",
    text: "Anna fidgets with her hands, looking down. 'Well...what I remember doesn't make much sense. Fiona was terrified but she didn't want to involve the police.",
    choices: [
      {
        text: "Take a gentle approach: Can you tell me why Ms. Jones ended her relationship with Mr. McCulloch?",
        cluerevealed: "Fiona found a hidden key in McCulloch's desk",
        nextScene: "hallway"
      },
         {
        text: "Press harder: I know this is hard, but we need to know why Fiona left him. What changed?",
        cluerevealed: "McCulloch was tracking Fiona's phone location",
        nextScene: "phone"
      },
      { 
        text: "Focus on the facts: Can you tell me exactly why Ms.Jones ended her relationship with Mr. McCulloch?",
        cluerevealed: "They had a violent argument in the backyard last Tuesday", 
        nextScene: "hallway"
      }
    ]
  },

  hallway: {
    title: "The Hallway",
    text: "The hallway is dark and silent.",
    choices: [
      {
        text: "backyard",
        nextScene: "lockedDoor"
      }
    ]
  },

   phone: {
    title: "Encrypted Digital Files",
    text: "Select a timestamp from the recovery logs to analyze McCulloch's actions",
    choices: [
      {
        text: "[Log 1] 3 months prior - Medical Event",
        action: check_tumor
      },
      {
        text: "[Log 2] 3 weeks prior - 14:15 - Location Data",
        action: check_key
      },
      {
        text: "[Log 3] Day of Incident - 18:30 - Router History",
        action: check_search
      },
    ]
  },

   solution: {
    title: "The solution",
    text: "You solved the mystery!",
    
  }
};

// --------------------------------------------------
// UPDATE SCENES
// Read through the comments below to see what this section does
//
// TO CUSTOMIZE THIS SECTION
// 1) add a new const variable for each new field you added above
// Make sure to match the ids used in your mock up with the fields 
// 2) set the .textContent of each variable to the corresponding field in the scene object
// Use sceneTitle as a model
// --------------------------------------------------

const sceneTitle = document.getElementById("scene-title");
const sceneText = document.getElementById("scene-text");
const choicesContainer = document.getElementById("choices-container");
const characterName = document.getElementById("character-name"); 


function updateScene(sceneName) {
  currentScene = sceneName;
  const scene = scenes[sceneName];
  const titleValue = scene.title;
  const textValue = scene.text;
  const characterValue = scene.character; 
  sceneTitle.textContent = titleValue;
  sceneText.textContent = textValue;
  
  if (characterValue) {
    characterName.textContent = characterValue;
  } else {
    characterName.textContent = ""; 
  }
  choicesContainer.innerHTML = "";
  scene.choices.forEach(function (choice) {
    const button = document.createElement("button");

    button.textContent = choice.text;

    button.addEventListener("click", function () {
      if (choice.action) {
        choice.action();
      }

      if (choice.nextScene) {
        updateScene(choice.nextScene);
      }
    });

    choicesContainer.appendChild(button);
  });
}

updateScene(currentScene);


// --------------------------------------------------
// HEALTH
// Read through the comments below to see what this section does
//
// TO CUSTOMIZE THIS SECTION
// Either customize the name from health to steps, stress, etc...
// OR
// create a copy of each step for each additional state you want to track throughout the game
// --------------------------------------------------

// Create a variable for stress
let stress = 0;

// Display current health
const stressDisplay = document.getElementById("stress-display");

// Create a function to update health 
function updateHealth(amount) {
  stress += amount;
  stressDisplay.textContent = stress;
}

// This refreshes the health display
updateStress(0);

// --------------------------------------------------
// INVENTORY
// Read through the comments below to see what this section does
//
// For now, you are probably leaving this section as is. 
// --------------------------------------------------

// Create a variable for inventory
let inventory = [];

// Display current inventory
const inventoryDisplay = document.querySelector("#inventory-display");
const messageDisplay = document.getElementById("message-display");

// Create a function to update inventory 
function pickUpItem(itemName) {
    // Add itemName to the inventory array
    // Show the updated inventory on the page
  inventory.push(itemName);
  inventoryDisplay.textContent = inventory.join(", ");
}

// --------------------------------------------------
// CONDITIONAL 
// Depending on how you want to implement the conditional logic, you may 
// simply adjust the names below or you may need to expand upon this section
// --------------------------------------------------

// Create a function that checks if the inventory contains one item and if so shows the win condition scene.
function unlockDoor() {
  if (inventory.includes("brass key")) {
    updateScene("solution");
  } else {
    messageDisplay.textContent = "The door is locked.";
  }
}

