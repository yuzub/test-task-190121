// 10 x 10 cells - dynamically
// modal window body ???
// refactor code - some duplicate presents
let cellsInRow = 10,
  range = cellsInRow * cellsInRow,
  // range = 20,
  timems = 0,
  scores = resetScores();

const startBtn = document.querySelector('#start');

const spanScores = document.querySelector('#scores');
displayScores(spanScores);

const cells = document.querySelectorAll('.cell');
// cells.forEach((cell, ind) => {
//   cell.innerHTML = ind + 1;
// });

startBtn.addEventListener('click', function(e) {
  scores = resetScores();
  resetCells();

  timems = Number(document.querySelector('#time').value);
  if (timems <= 0 || !Number.isInteger(timems)) {
    displayModal(`wrong input: time = ${timems}`);
  } else {
    startBtn.setAttribute('disabled', 'disabled');
    runPlay();
  }

});

function runPlay() {
  let curCell,
    timerId,
    usedCells = [];
  
  nextStep();
  
  function nextStep() {
    let index;
    
    while (true) {
      index = getRandomInt(range);
      if (usedCells.indexOf(index) === -1) {
        usedCells.push(index);
        break;
      }
    }
    curCell = cells[index];
    curCell.classList.add('cur-cell');
  
    timerId = setTimeout(function go() {
      
      curCell.classList.add('comp-win');
      scores.comp += 1;
      displayScores(spanScores);
      curCell.removeEventListener('click', handleClick);
      
      if (scores.player < 10 && scores.comp < 10) {
        nextStep();
      } else {
        displayModal('game over! comp win!');
        startBtn.removeAttribute('disabled');
      }
    }, timems);
    curCell.addEventListener('click', handleClick);    
  }
  
  function handleClick(e) {
    clearTimeout(timerId);
    
    curCell.classList.add('player-win');
    scores.player += 1;
    displayScores(spanScores);
    curCell.removeEventListener('click', handleClick);

    if (scores.player < 10 && scores.comp < 10) {
      nextStep();
    } else {
      displayModal('game over! player win!');
      startBtn.removeAttribute('disabled');
    }
  }
  
}

function resetCells() {
  cells.forEach(cell => {
    cell.classList.remove('player-win', 'comp-win', 'cur-cell');
  });
}

function resetScores() {
  return {
    player: 0,
    comp: 0
  }
}

function displayScores(element) {
  element.innerHTML = scores.player + ' / ' + scores.comp;
}

function getRandomInt(range) {
  return Math.floor(Math.random() * range);
}

Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number'
         && Number.isFinite(value)
         && !(value % 1);
};

// modal window
const modal = document.querySelector('#modalWindow');
const span = document.querySelector('.close');

function displayModal(message) {
  const modalHeader = document.querySelector('.modal-header h2');
  modalHeader.innerHTML = message;
  modal.style.display = 'block';
}

span.addEventListener('click', function() {
  modal.style.display = 'none';
});

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = 'none';
//   }
// }