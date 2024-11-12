const playButton = document.getElementById("playButton");
const audio = document.getElementById("audio");
const pictures = document.querySelectorAll('.Picture');
let movementActive = false; // Track if movement is active
const movementDuration = 5000; // Duration of movement in milliseconds (5 seconds)
let movementTimeout; // Timeout to stop movement after the duration

// Ensure a value is within a min and max range
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Get the screen dimensions to set boundaries
const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;

// Initialize each picture's position within viewport bounds
function initializePictures() {
  pictures.forEach(picture => {
    const range = 100;
    const randomX = Math.random() * (range * 2) - range;
    const randomY = Math.random() * (range * 2) - range;
    const randomRotate = Math.random() * (range / 2) - range / 4;

    // Calculate initial positions and clamp them within bounds
    const initialX = viewportWidth / 2 + randomX;
    const initialY = viewportHeight / 2 + randomY;
    const clampedX = clamp(initialX, 50, viewportWidth - 50);
    const clampedY = clamp(initialY, 50, viewportHeight - 50);

    // Set the position and rotation
    picture.style.top = `${clampedY}px`;
    picture.style.left = `${clampedX}px`;
    picture.style.transform = `translate(-50%, -50%) rotate(${randomRotate}deg)`;

    // Event listener for drag functionality
    picture.addEventListener("mousedown", (event) => startDrag(picture, event));
    picture.addEventListener("touchstart", (event) => startDrag(picture, event));
  });
}

// Function to update element position based on mouse or touch movement
function updateElementPosition(element, event) {
  let movementX, movementY;

  if (event.type === 'touchmove') {
    const touch = event.touches[0];
    movementX = previousTouch ? touch.clientX - previousTouch.clientX : 0;
    movementY = previousTouch ? touch.clientY - previousTouch.clientY : 0;
    previousTouch = touch;
  } else {
    movementX = event.movementX;
    movementY = event.movementY;
  }

  const elementY = parseInt(element.style.top || 0) + movementY;
  const elementX = parseInt(element.style.left || 0) + movementX;

  element.style.top = elementY + "px";
  element.style.left = elementX + "px";
}

function startDrag(element, event) {
  const updateFunction = (event) => updateElementPosition(element, event);
  const stopFunction = () => stopDrag({ update: updateFunction, stop: stopFunction });
  document.addEventListener("mousemove", updateFunction);
  document.addEventListener("touchmove", updateFunction);
  document.addEventListener("mouseup", stopFunction);
  document.addEventListener("touchend", stopFunction);
}

function stopDrag(functions) {
  previousTouch = undefined;
  document.removeEventListener("mousemove", functions.update);
  document.removeEventListener("touchmove", functions.update);
  document.removeEventListener("mouseup", functions.stop);
  document.removeEventListener("touchend", functions.stop);
}

// Function to start random movement of pictures
function startRandomMovement() {
  movementActive = true;
  pictures.forEach(picture => {
    const interval = setInterval(() => {
      if (!movementActive) {
        clearInterval(interval); // Stop movement when time is up
        return;
      }
      const randomX = Math.random() * 10 - 5; // Random small movement
      const randomY = Math.random() * 10 - 5;

      const newX = clamp(parseInt(picture.style.left || 0) + randomX, 0, viewportWidth - picture.clientWidth);
      const newY = clamp(parseInt(picture.style.top || 0) + randomY, 0, viewportHeight - picture.clientHeight);

      picture.style.left = `${newX}px`;
      picture.style.top = `${newY}px`;
    }, 100); // Update position every 100 ms
  });
}

// Start and stop movement based on time limit
function toggleMovement() {
  if (movementActive) {
    movementActive = false;
    clearTimeout(movementTimeout);
  } else {
    startRandomMovement();
    movementTimeout = setTimeout(() => {
      movementActive = false;
    }, movementDuration); // Stop movement after defined duration
  }
}

// Play audio and toggle movement when playButton is clicked
playButton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playButton.textContent = "Pause";
  } else {
    audio.pause();
    playButton.textContent = "Play";
  }
  toggleMovement(); // Start or stop movement on button click
});

// Initialize picture positions
initializePictures();
