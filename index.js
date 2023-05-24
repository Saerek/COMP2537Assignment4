const setup = () => {
    let firstCard = undefined;
    let secondCard = undefined;
    let pairsMatched = 0;
    const totalPairs = $(".card").length / 2; // Assuming each card has a pair
    let numClicks = 0;
    let numPairsLeft = totalPairs;
    let numPairsMatched = 0;
    let timerInterval; // Timer interval ID
    let startTime; // Starting time of the timer
    let gameStarted = false; // Game status
    let flippedCardsCount = 0; // Number of flipped cards
    let flipBackTimeout; // Timeout ID for flipping back mismatched cards
  
    const flipCard = function () {
      if (!gameStarted) {
        return; // Ignore if the game has not started yet
      }
  
      if (
        $(this).hasClass("flip") ||
        $(this).hasClass("matched") ||
        firstCard === this ||
        secondCard === this
      ) {
        return; // Ignore if already flipped, matched, or clicked again
      }
  
      $(this).toggleClass("flip");
  
      numClicks++;
      $("#numClicks").text(`Number of Clicks: ${numClicks}`);
  
      if (!firstCard) {
        firstCard = this;
      } else if (!secondCard) {
        secondCard = this;
        console.log(firstCard, secondCard);
  
        const firstCardImageSrc = $(firstCard).find(".front_face").attr("src");
        const secondCardImageSrc = $(secondCard).find(".front_face").attr("src");
  
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
          }
  
          // Reset selected cards
          firstCard = undefined;
          secondCard = undefined;
        } else {
          console.log("no match");
          clearTimeout(flipBackTimeout); // Clear previous timeout if exists
  
          // Flip back mismatched cards after a delay
          flipBackTimeout = setTimeout(() => {
            $(firstCard).removeClass("flip");
            $(secondCard).removeClass("flip");
  
            // Reset selected cards
            firstCard = undefined;
            secondCard = undefined;
          }, 1000);
  
          // Reset flipped cards count
          flippedCardsCount = 0;
        }
  
        // Increment flipped cards count
        flippedCardsCount += 2;
  
        // Check if additional cards have been flipped during the delay
        if (flippedCardsCount > 2) {
          clearTimeout(flipBackTimeout); // Clear previous timeout
          $(".card.flip:not(.matched)").removeClass("flip"); // Flip back all flipped cards
          flippedCardsCount = 0; // Reset flipped cards count
          firstCard = undefined;
          secondCard = undefined;
        }
      }
  
      $("#numPairsLeft").text(`Pairs Left: ${numPairsLeft}`);
      $("#numPairsMatched").text(`Pairs Matched: ${numPairsMatched}`);
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
  
    $(".card").on("click", flipCard);
  
    $("#startButton").on("click", function () {
      if (gameStarted) {
        return; // Ignore if the game is already started
      }
  
      $(".card").on("click", flipCard);
      startTimer();
      gameStarted = true; // Set game status to started
    });
  
    $("#resetButton").on("click", function () {
      clearTimeout(flipBackTimeout); // Clear flip back timeout if exists
      $(".card").removeClass("flip matched");
      $(".card").on("click", flipCard);
      firstCard = undefined;
      secondCard = undefined;
      pairsMatched = 0;
      numClicks = 0;
      numPairsLeft = totalPairs;
      numPairsMatched = 0;
      flippedCardsCount = 0; // Reset flipped cards count
      $("#numClicks").text(`Number of Clicks: ${numClicks}`);
      $("#numPairsLeft").text(`Pairs Left: ${numPairsLeft}`);
      $("#numPairsMatched").text(`Pairs Matched: ${numPairsMatched}`);
      $("#winningMessage").text("");
      $("#winMsg").hide();
      stopTimer();
      gameStarted = false; // Set game status to not started
    });
  }
$(document).ready(setup)