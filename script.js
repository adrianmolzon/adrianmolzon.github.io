/* ---- particles.js config ---- */

particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 70,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#630330"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#630330"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 2,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 10,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 400,
        "color": "#630330",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "repulse"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 200,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 125,
          "duration": 0.8
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });


  /* ---- stats.js config ---- */

  var count_particles, stats, update;
  stats = new Stats;
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);
  count_particles = document.querySelector('.js-count-particles');
  update = function() {
    stats.begin();
    stats.end();
    if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
      count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
    }
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);

document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const gameState = {
        letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], // Example letters
        centerLetter: 'A',
        currentWord: '',
        foundWords: [],
        score: 0
    };

    // DOM elements
    const hexagons = document.querySelectorAll('.hex');
    const currentWordDisplay = document.querySelector('.current-word');
    const deleteBtn = document.getElementById('delete-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const enterBtn = document.getElementById('enter-btn');
    const wordList = document.querySelector('.word-list');

    // Initialize the game
    function initGame() {
        // Set the center letter
        const centerHex = document.querySelector('.center-hex .letter');
        if (centerHex) {
            centerHex.textContent = gameState.centerLetter;
        }

        // Set the outer letters
        const outerLetters = gameState.letters.filter(letter => letter !== gameState.centerLetter);
        const outerHexLetters = document.querySelectorAll('.outer-hex .letter');

        outerHexLetters.forEach((hexLetter, index) => {
            if (index < outerLetters.length) {
                hexLetter.textContent = outerLetters[index];
            }
        });

        // Add event listeners
        hexagons.forEach(hex => {
            hex.addEventListener('click', handleHexClick);
        });

        deleteBtn.addEventListener('click', handleDelete);
        shuffleBtn.addEventListener('click', handleShuffle);
        enterBtn.addEventListener('click', handleEnter);

        // Add keyboard support
        document.addEventListener('keydown', handleKeydown);

        // Load saved game if available
        loadGame();
    }

    // Handle clicking on a hexagon
    function handleHexClick(event) {
        const letter = event.currentTarget.querySelector('.letter').textContent;
        addLetterToWord(letter);
    }

    // Add a letter to the current word
    function addLetterToWord(letter) {
        gameState.currentWord += letter;
        updateCurrentWordDisplay();
    }

    // Update the current word display
    function updateCurrentWordDisplay() {
        currentWordDisplay.textContent = gameState.currentWord;
    }

    // Handle delete button
    function handleDelete() {
        if (gameState.currentWord.length > 0) {
            gameState.currentWord = gameState.currentWord.slice(0, -1);
            updateCurrentWordDisplay();
        }
    }

    // Handle shuffle button
    function handleShuffle() {
        const outerLetters = gameState.letters.filter(letter => letter !== gameState.centerLetter);
        shuffleArray(outerLetters);

        const outerHexLetters = document.querySelectorAll('.outer-hex .letter');
        outerHexLetters.forEach((hexLetter, index) => {
            if (index < outerLetters.length) {
                hexLetter.textContent = outerLetters[index];
            }
        });
    }

    // Shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Handle enter button
    function handleEnter() {
        const word = gameState.currentWord.toLowerCase();

        // Basic validation (will need to be expanded)
        if (word.length < 4) {
            alert('Words must be at least 4 letters long');
            return;
        }

        if (!word.includes(gameState.centerLetter.toLowerCase())) {
            alert('Words must include the center letter');
            return;
        }

        if (gameState.foundWords.includes(word)) {
            alert('You already found this word');
            return;
        }

        // In a real implementation, you would check against a dictionary here
        // For now, we'll just accept the word
        gameState.foundWords.push(word);
        updateWordList();
        updateScore(word);

        // Clear the current word
        gameState.currentWord = '';
        updateCurrentWordDisplay();

        // Save game state
        saveGame();
    }

    // Update the word list display
    function updateWordList() {
        wordList.innerHTML = '';
        gameState.foundWords.sort().forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            wordList.appendChild(li);
        });
    }

    // Update the score
    function updateScore(word) {
        let points = 0;

        if (word.length === 4) {
            points = 1;
        } else {
            points = word.length;
        }

        // Check if it's a pangram (uses all letters)
        const uniqueLetters = new Set(word.split(''));
        if (uniqueLetters.size === gameState.letters.length) {
            points += 7; // Bonus for pangram
        }

        gameState.score += points;
        // Update score display (to be implemented)
    }

    // Handle keyboard input
    function handleKeydown(event) {
        const key = event.key.toUpperCase();

        // Check if the key is a letter in our game
        if (gameState.letters.includes(key)) {
            addLetterToWord(key);
        } else if (event.key === 'Backspace' || event.key === 'Delete') {
            handleDelete();
        } else if (event.key === 'Enter') {
            handleEnter();
        }
    }

    // Save game state to localStorage
    function saveGame() {
        localStorage.setItem('spellingBeeGame', JSON.stringify({
            foundWords: gameState.foundWords,
            score: gameState.score
        }));
    }

    // Load game state from localStorage
    function loadGame() {
        const savedGame = localStorage.getItem('spellingBeeGame');
        if (savedGame) {
            const parsedGame = JSON.parse(savedGame);
            gameState.foundWords = parsedGame.foundWords || [];
            gameState.score = parsedGame.score || 0;
            updateWordList();
        }
    }

    // Initialize the game
    initGame();
});
