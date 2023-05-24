const setup = () => {
    let firstCard = undefined;
    let secondCard = undefined;
    let pairsMatched = 0;
    let totalPairs = 0;
    let numClicks = 0;
    let numPairsLeft = 0;
    let numPairsMatched = 0;
    let timerInterval;
    let startTime;
    let gameStarted = false;
    let flippedCardsCount = 0;
    let flipBackTimeout;
    let maxTime = 300;
    let powerUpsUsed = 0;
    const powerUpLimit = 3;
  
    // Dark mode and light mode toggle
    $("#darkModeToggle").on("change", function () {
      if ($(this).is(":checked")) {
        $("body").addClass("dark-mode");
        $(".card").addClass("dark-mode");
      } else {
        $("body").removeClass("dark-mode");
        $(".card").removeClass("dark-mode");
      }
    });
  
    // Power-up button event handler
    const usePowerUp = () => {
      if (powerUpsUsed >= powerUpLimit) {
        return; // Power-up limit reached
      }
  
      $(".card:not(.matched)").addClass("flip"); // Flip all unmatched cards
  
      // Wait for a brief duration and then flip back the unmatched cards
      setTimeout(() => {
        $(".card:not(.matched)").removeClass("flip");
      }, 1500);
  
      powerUpsUsed++;
      $("#powerUpCount").text(`Power-Up Count: ${powerUpsUsed}`);
  
      // Disable the power-up button if the limit is reached
      if (powerUpsUsed >= powerUpLimit) {
        $("#powerUpButton").prop("disabled", true);
      }
    };
  
    $("#powerUpButton").on("click", usePowerUp);
  
    // Check the initial state of the dark mode toggle
    $("#darkModeToggle").prop("checked", $("body").hasClass("dark-mode"));
  
    const createGameGrid = (rows, cols) => {
      const totalCards = rows * cols;
      const cardPairs = totalCards / 2;
      const apiUrl =
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
  
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=${cardPairs}`)
        .then((response) => response.json())
        .then((data) => {
          const pokemonUrls = [];
          const promises = data.results.map((pokemon) => {
            const randomId = Math.floor(Math.random() * 898) + 1; // Generate random Pokémon ID from 1 to 898
            const pokemonImage = `${apiUrl}${randomId}.png`;
            pokemonUrls.push(pokemonImage);
          });
  
          Promise.all(promises).then(() => {
            const cardImagesDoubled = pokemonUrls.concat(pokemonUrls);
            const shuffledCardImages = shuffle(cardImagesDoubled);
  
            $("#game_grid").empty().append('<div class="game-grid"></div>');
            const gameGrid = $("#game_grid .game-grid");
  
            for (let i = 0; i < totalCards; i++) {
                const cardImage = shuffledCardImages[i];
                const card = `<div class="card">
                  <img class="front_face" src="${cardImage}" alt="">
                  <img class="back_face" src="back.webp" alt="">
                </div>`;
                $("#game_grid").append(card);
              }
            $("#game_grid").on("click", ".card", flipCard);
          });
        });
    };
  
    // Function to shuffle the array
    const shuffle = (array) => {
      let currentIndex = array.length;
      let temporaryValue;
      let randomIndex;
  
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
  
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
  
      return array;
    };
  
      const flipCard = function () {
        if (!gameStarted) {
          return;
        }
      
        if (
          $(this).hasClass("flip") ||
          $(this).hasClass("matched") ||
          firstCard === this ||
          secondCard === this
        ) {
          return;
        }
      
        $(this).toggleClass("flip");
      
        numClicks++;
        $("#numClicks").text(`Number of Clicks: ${numClicks}`);
      
        if (!firstCard) {
          firstCard = $(this); // Retrieve jQuery representation of the first card
        } else if (!secondCard) {
          secondCard = $(this); // Retrieve jQuery representation of the second card
          console.log(firstCard, secondCard);
      
          const firstCardImageSrc = firstCard.find(".front_face").attr("src"); // Retrieve the image source of the first card
          const secondCardImageSrc = secondCard.find(".front_face").attr("src"); // Retrieve the image source of the second card
  
        if (firstCardImageSrc === secondCardImageSrc) {
          console.log("match");
          $(firstCard).off("click");
          $(secondCard).off("click");
          $(firstCard).addClass("matched");
          $(secondCard).addClass("matched");
  
          pairsMatched++;
          numPairsMatched++;
          numPairsLeft--;
  
          if (pairsMatched === totalPairs) {
            $("#winningMessage").text("Congratulations! You won the game!");
            $("#winMsg").show();
            stopTimer();
            gameStarted = false;
          }
  
          checkGameStatus();
  
          firstCard = undefined;
          secondCard = undefined;
        } else {
          console.log("no match");
          clearTimeout(flipBackTimeout);
          flipBackTimeout = setTimeout(() => {
            $(firstCard).removeClass("flip");
            $(secondCard).removeClass("flip");
            firstCard = undefined;
            secondCard = undefined;
          }, 1000);
  
          flippedCardsCount += 2;
  
          if (flippedCardsCount > 2) {
            clearTimeout(flipBackTimeout);
            $(".card.flip:not(.matched)").removeClass("flip");
            flippedCardsCount = 0;
            firstCard = undefined;
            secondCard = undefined;
          }
        }
  
        $("#numPairsLeft").text(`Pairs Left: ${numPairsLeft}`);
        $("#numPairsMatched").text(`Pairs Matched: ${numPairsMatched}`);
      }
    };
  
   

    const checkGameStatus = () => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  
      if (elapsedTime >= maxTime) {
        $("#winningMessage").text("You failed! Time's up.");
        $("#winMsg").show();
        stopTimer();
        gameStarted = false;
      }
    };
  
    const startTimer = () => {
      startTime = Date.now();
      timerInterval = setInterval(updateTimer, 1000);
    };
  
    const stopTimer = () => {
      clearInterval(timerInterval);
    };
  
    const updateTimer = () => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      $("#timer").text(`Time: ${elapsedTime} seconds`);
    };
  
    const startGame = () => {
      gameStarted = true;
      startTimer();
      checkGameStatus();
    };
  
    const resetGame = () => {
      clearTimeout(flipBackTimeout);
      $(".card").removeClass("flip matched");
      $(".card").off("click");
      firstCard = undefined;
      secondCard = undefined;
      pairsMatched = 0;
      numClicks = 0;
      numPairsLeft = totalPairs;
      numPairsMatched = 0;
      flippedCardsCount = 0;
      $("#numClicks").text(`Number of Clicks: ${numClicks}`);
      $("#numPairsLeft").text(`Pairs Left: ${numPairsLeft}`);
      $("#numPairsMatched").text(`Pairs Matched: ${numPairsMatched}`);
      $("#winningMessage").text("");
      $("#winMsg").hide();
      stopTimer();
      gameStarted = false;
    };
  
    $("#easyButton").on("click", function () {
      if (gameStarted) {
        return;
      }
  
      resetGame();
      createGameGrid(2, 3);
      totalPairs = 3;
      numPairsLeft = totalPairs;
      $("#numPairsLeft").text(`Pairs Left: ${numPairsLeft}`);
    });
  
    $("#normalButton").on("click", function () {
      if (gameStarted) {
        return;
      }
  
      resetGame();
      createGameGrid(3, 4);
      totalPairs = 6;
      numPairsLeft = totalPairs;
      $("#numPairsLeft").text(`Pairs Left: ${numPairsLeft}`);
    });
  
    $("#hardButton").on("click", function () {
      if (gameStarted) {
        return;
      }
  
      resetGame();
      createGameGrid(4, 5);
      totalPairs = 10;
      numPairsLeft = totalPairs;
      $("#numPairsLeft").text(`Pairs Left: ${numPairsLeft}`);
    });
  
    $("#startButton").on("click", function () {
      if (gameStarted) {
        return;
      }
  
      startGame(); // Call startGame function to start the game
    });
  
    $("#resetButton").on("click", function () {
      resetGame();
    });
  };
  
  $(document).ready(setup);
  