// --------------------------------------------------
// SCENES
// --------------------------------------------------

let currentScene = "backyard";

const scenes = {
  backyard: {
    title: "Location: Backyard",
    character: "Interviewee: Grandma",
    text: "Well, what I remember happening is that Fiona and Mr. McCulloch were arguing out here, the neighbor mentioned hearing yelling, and the dog ran around really quickly before barking at something in the grass.",
    choices: [
      {
        text: "Chase after the dog toward the side gate (+10 Stress)",
        action: function () {
          updateHealth(10);
        },
        cluerevealed: "The dog was barking at freshly dug dirt near the fence—McCulloch rushed out this way.",
        nextScene: "entrance"
      },
      {
        text: "Ask about the neighbor",
        cluerevealed: "The neighbor saw McCulloch's car parked across the street two hours before the fight.",
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

  secretFiles: {
    title: "Location: Decrypted Phone Logs",
    character: "System: Access Granted",
    text: "The encryption key worked! You bypassed the security and found a hidden audio recording from the night Fiona disappeared. McCulloch can be heard arguing about a secret property.",
    choices: [
      {
        text: "Go back to the phone logs",
        nextScene: "phone"
      },
      {
        text: "Go back to the hallway",
        nextScene: "hallway"
      }
    ]
  },

  interrogation: {
    title: "Location: Interrogation Room",
    character: "Interviewee: Anna Smith",
    text: "Anna fidgets with her hands, looking down. 'Well... what I remember doesn't make much sense. Fiona was terrified, but she didn't want to involve the police.'",
    choices: [
      {
        text: "Take a gentle approach: Can you tell me why Ms. Jones ended her relationship with Mr. McCulloch?",
        action: function () {
          pickUpItem("encryption key");
        },
        nextScene: "phone"
      },
      {
        text: "Press harder: I know this is hard, but we need to know why Fiona left him. What changed?",
        cluerevealed: "McCulloch was tracking Fiona's phone location",
        nextScene: "phone"
      },
      {
        text: "Focus on the facts: Can you tell me exactly why Ms. Jones ended her relationship with Mr. McCulloch?",
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
        text: "Try the locked door",
        nextScene: "lockedDoor"
      },
      {
        text: "Go back to the backyard",
        nextScene: "backyard"
      },
      {
        text: "Go to the interrogation room",
        nextScene: "interrogation"
      }
    ]
  },

  entrance: {
    title: "Location: Entrance",
    text: "You reach the entrance and can return outside or head into the house.",
    choices: [
      {
        text: "Return to the backyard",
        nextScene: "backyard"
      },
      {
        text: "Go to the hallway",
        nextScene: "hallway"
      }
    ]
  },

  lockedDoor: {
    title: "Location: Locked Door",
    text: "The door is locked. The brass key may open it.",
    choices: [
      {
        text: "Use the brass key",
        action: unlockDoor
      },
      {
        text: "Return to the hallway",
        nextScene: "hallway"
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
      {
        text: "Use encryption key to decrypt hidden files",
        action: decryptPhone
      },
      {
        text: "Return to the hallway",
        nextScene: "hallway"
      }
    ]
  },

  solution: {
    title: "The Final Verdict",
    character: "Case Review",
    text: "You unlocked the evidence room and reviewed the case files. Based on what you uncovered, what is McCulloch guilty of?",
    choices: [
      {
        text: "First-Degree Murder (Premeditated)",
        nextScene: "murderVerdict"
      },
      {
        text: "Manslaughter (Unplanned / Diminished Impulse Control)",
        nextScene: "manslaughterVerdict"
      },
      {
        text: "Go back to investigate more first",
        nextScene: "hallway"
      }
    ]
  },

  murderVerdict: {
    title: "Verdict: First-Degree Murder",
    text: "You determined that tracking Fiona's location, searching for isolated properties, and arguing over a secret property prove McCulloch planned the crime.",
    choices: []
  },

  manslaughterVerdict: {
    title: "Verdict: Manslaughter",
    text: "You determined that McCulloch's recent brain tumor and a sudden heated argument in the backyard show a lack of premeditation.",
    choices: []
  }
};

// --------------------------------------------------
// UPDATE SCENES
// --------------------------------------------------

const sceneTitle = document.getElementById("scene-title");
const sceneText = document.getElementById("scene-text");
const choicesContainer = document.getElementById("choices-container");
const characterName = document.getElementById("character-name");

function updateScene(sceneName) {
  const scene = scenes[sceneName];
  if (!scene || !sceneText || !choicesContainer) {
    console.error(`Cannot display scene: ${sceneName}`);
    return;
  }

  currentScene = sceneName;
  if (sceneTitle) {
    sceneTitle.textContent = scene.title || "";
  }
  sceneText.textContent = scene.text || "";

  if (characterName) {
    characterName.textContent = scene.character || "";
  }

  choicesContainer.innerHTML = "";
  (scene.choices || []).forEach(function (choice) {
    const button = document.createElement("button");
    button.textContent = choice.text;

    button.addEventListener("click", function () {
      if (choice.action) {
        choice.action();
      }

      if (choice.cluerevealed && messageDisplay) {
        messageDisplay.textContent = "Clue revealed: " + choice.cluerevealed;
      }

      if (choice.nextScene) {
        updateScene(choice.nextScene);
      }
    });

    choicesContainer.appendChild(button);
  });
}

// --------------------------------------------------
// HEALTH / STRESS
// --------------------------------------------------

let stress = 0;
const stressDisplay = document.getElementById("stress-display");

function updateHealth(amount) {
  stress += amount;
  if (stressDisplay) {
    stressDisplay.textContent = stress;
  }
}

updateHealth(0);

// --------------------------------------------------
// INVENTORY
// --------------------------------------------------

let inventory = [];
const inventoryDisplay = document.querySelector("#inventory-display");
const messageDisplay = document.getElementById("message-display");

function pickUpItem(itemName) {
  if (!inventory.includes(itemName)) {
    inventory.push(itemName);
    if (inventoryDisplay) {
      inventoryDisplay.textContent = inventory.join(", ");
    }
  }
}

// --------------------------------------------------
// CONDITIONAL & LOG FUNCTIONS
// --------------------------------------------------

function unlockDoor() {
  if (inventory.includes("brass key")) {
    updateScene("solution");
  } else if (messageDisplay) {
    messageDisplay.textContent = "The door is locked.";
  }
}

function decryptPhone() {
  if (inventory.includes("encryption key")) {
    updateScene("secretFiles");
  } else if (messageDisplay) {
    messageDisplay.textContent = "Files are encrypted. You need an encryption key.";
  }
}

function check_tumor() {
  if (messageDisplay) {
    messageDisplay.textContent = "Medical Log: MRI from 3 months ago shows a tumor affecting impulse control.";
  }
}

function check_key() {
  if (messageDisplay) {
    messageDisplay.textContent = "Location Data: Spyware tracked Fiona's GPS for 3 weeks prior.";
  }
}

function check_search() {
  if (messageDisplay) {
    messageDisplay.textContent = "Router History: Searches at 18:30 for 'isolated properties' and 'how to erase logs'.";
  }
}

if (sceneText && choicesContainer) {
  updateScene(currentScene);
}
