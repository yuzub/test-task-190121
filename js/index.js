(function () {
  "use strict";
  let cellsInRow = 10,
    range = cellsInRow * cellsInRow,
    timems = 0,
    scores = resetScores();

  // generate cells for game
  generateGameGrid(cellsInRow);

  // control elements
  const startBtn = document.querySelector("#start");
  const spanScores = document.querySelector("#scores");
  const cells = document.querySelectorAll(".cell");
  //  modal window elements
  const modal = document.querySelector("#modalWindow");
  const span = document.querySelector(".close");

  displayScores(spanScores);

  // polyfill for Number.isInteger()
  Number.isInteger =
    Number.isInteger ||
    function (value) {
      return (
        typeof value === "number" && Number.isFinite(value) && !(value % 1)
      );
    };

  startBtn.addEventListener("click", function (e) {
    //  reset game
    scores = resetScores();
    displayScores(spanScores);
    resetCells();
    //  check input data
    timems = Number(document.querySelector("#time").value);
    if (timems <= 0 || !Number.isInteger(timems)) {
      displayModal(`Wrong input:`, `time = ${timems}`);
    } else {
      startBtn.setAttribute("disabled", "disabled");
      //  run game
      runPlay();
    }
  });

  // -----------  runPlay()  ---------------
  function runPlay() {
    let curCell,
      timerId,
      usedCells = [];

    nextStep();

    // -----------  one step of game  ------------------
    function nextStep() {
      //  index of random cell
      let index;

      //  check for repeating of random cells
      while (true) {
        index = getRandomInt(range);
        if (usedCells.indexOf(index) === -1) {
          usedCells.push(index);
          break;
        }
      }
      curCell = cells[index];
      curCell.classList.add("cur-cell");

      timerId = setTimeout(function go() {
        changeScore("comp");
      }, timems);
      curCell.addEventListener("click", handleClick);
    }

    // -----------  handle player click on cell  ------------------
    function handleClick(e) {
      clearTimeout(timerId);
      changeScore("player");
    }

    // -----------  change score of comp or player  ------------------
    function changeScore(winner) {
      curCell.classList.add(`${winner}-win`);
      scores[winner] += 1;
      displayScores(spanScores);
      curCell.removeEventListener("click", handleClick);

      if (scores.player < 10 && scores.comp < 10) {
        nextStep();
      } else {
        const modalMsg =
          winner === "comp" ? "Computer win!" : "You are WINNER!";
        displayModal("Game over!", modalMsg);
        startBtn.removeAttribute("disabled");
      }
    }
  }
  // -----------  end runPlay()  ---------------

  //  reset game
  function resetCells() {
    cells.forEach(cell => {
      cell.classList.remove("player-win", "comp-win", "cur-cell");
    });
  }

  function resetScores() {
    return {
      player: 0,
      comp: 0
    };
  }

  // get random integer in range [0, range)
  function getRandomInt(range) {
    return Math.floor(Math.random() * range);
  }

  //  display scores
  function displayScores(element) {
    element.innerHTML = scores.player + " / " + scores.comp;
  }

  // display modal window
  function displayModal(header, message) {
    const modalHeader = document.querySelector(".modal-header h2");
    modalHeader.innerHTML = header;
    const modalBody = document.querySelector(".modal-body p");
    modalBody.innerHTML = message;
    modal.style.display = "block";
  }

  // for close modal window
  span.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // When the user clicks anywhere outside of the modal, close it
  // window.onclick = function(event) {
  //   if (event.target == modal) {
  //     modal.style.display = 'none';
  //   }
  // }

  // generate game grid
  function generateGameGrid(divInRow) {
    const gridWrap = document.querySelector(".grid-wrapper");
    for (let j = 0; j < divInRow; j++) {
      const flexContainer = document.createElement("div");
      flexContainer.className = "flex-container";

      for (let i = 0; i < divInRow; i++) {
        const div = document.createElement("div");
        div.className = "cell";
        flexContainer.appendChild(div);
      }
      gridWrap.appendChild(flexContainer);
    }
  }
})();