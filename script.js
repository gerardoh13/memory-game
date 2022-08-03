const gameContainer = document.getElementById("game");
const scoreDisplay = document.getElementById("score")
const timerDisplay = document.getElementById("timer")
const sixHigh = document.getElementById("sixHigh")
const twelveHigh = document.getElementById("twelveHigh")
const twoSixHigh = document.getElementById("twoSixHigh")
const pScore = document.getElementById("pScore")


document.body.style.backgroundColor = 'rgb(15, 93, 45)';
const cardBack = "back-of-card.jpg"

//generate an array of 26 card objects with img src and id. I used this to avoid having a long array in my js file
const cardVals = ['A','A','K','K','Q','Q','J','J','2','2','3','3','4','4','5','5','6','6','7','7','8','8','9','9','0','0']
const suits = ['C','H','D','S']
let cards = []
let suitIndex = 0
for (let i = 0; i < cardVals.length; i++){
  suitIndex++
  suitIndex = i % 4 === 0 ? 0 : suitIndex
  cards.push({
    src: `https://deckofcardsapi.com/static/img/${cardVals[i]}${suits[suitIndex]}.png`,
    id:  `${cardVals[i]}${suits[suitIndex]}`
  })
}

// THank you to AlexJWayne for an an accurate way to log time without drifting. https://gist.github.com/AlexJWayne/1431195
// Slightly modified to accept 'normal' interval/timeout format (func, time).
window.accurateInterval = function(fn, time) {
  var cancel, nextAt, timeout, wrapper;
  nextAt = new Date().getTime() + time;
  timeout = null;
  wrapper = function() {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return fn();
  };
  cancel = function() {
    return clearTimeout(timeout);
  };
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());
  return {
    cancel: cancel
  };
};

let clickedCards = []
let matchCount = 0
let cardFlips = 0
let cardsPlayed = 0
let timeElapsed = 0
let timer

function startStop() {
  if (!timer){
    timer = accurateInterval(updateTimer, 1000);
  } else {
    timer.cancel()
    timer = ''
  }
}
function updateTimer () {
  timeElapsed++
  let newTime = clockify(timeElapsed)
  timerDisplay.innerText = newTime
}
function clockify (time) {
  let mins = Math.floor(time / 60)
  let secs = time - mins * 60
  mins = mins < 10 ? '0' + mins : mins
  secs = secs < 10 ? '0' + secs: secs
  return `Time: ${mins}:${secs}`
}
function updateScore(){
  cardFlips++
  scoreDisplay.innerText = `Cards flipped: ${cardFlips}`
}
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
function createCards(cardArray) {
  for (let card of cardArray) {
    const newImg = document.createElement("img")
    newImg.setAttribute("src", cardBack);
    newImg.classList.add("cards");
    newImg.id = card.id
    newImg.addEventListener("click", handleCardClick);
    gameContainer.append(newImg);
  }
}
function checkMatches () {
  let cardOne = clickedCards[0]
  let cardTwo = clickedCards[1]
  if (cardOne.id[0] === cardTwo.id[0]){
    matchCount++
  }  else {
    cardOne.src = cardBack
    cardOne.classList.toggle('flip');
    cardOne.addEventListener("click", handleCardClick);
    cardTwo.src = cardBack
    cardTwo.classList.toggle('flip');
    cardTwo.addEventListener("click", handleCardClick);
  }
  clickedCards = []
  if (matchCount === cardsPlayed / 2){
    gameOver()
  }
}
function gameOver () {
  startStop()
  let score = {}
  score.cardsPlayed = cardsPlayed
  score.timeElapsed = timeElapsed
  score.cardFlips = cardFlips
  if (checkHighScore(score)){
    pScore.innerText = `New High Score! Your score was ${score.cardFlips} card flips in ${clockify(score.timeElapsed)}`
  } else {
    pScore.innerText = `Your score was ${score.cardFlips} card flips in ${clockify(score.timeElapsed)}`
  }
  setHighScore(score)
  $("#gameOverModal").modal()
  $("#gameOverModal").on('hide.bs.modal', retrieveScores)
}
function setHighScore (score){
if (checkHighScore(score)){
  let JSONscore = JSON.stringify(score)
  localStorage.setItem(`${cardsPlayed}CardHighScore`, JSONscore)
}
}

function checkHighScore (obj){
  if (!localStorage.getItem(`${obj.cardsPlayed}CardHighScore`)){
    return true
  } else {
    let HighScore = JSON.parse(localStorage.getItem(`${obj.cardsPlayed}CardHighScore`))
    if (HighScore.cardFlips > obj.cardFlips){
      return true
    }
    if (HighScore.cardFlips === obj.cardFlips && HighScore.timeElapsed > obj.timeElapsed){
        return true
    }
  }
  return false
}
function retrieveScores (){
    let sixCardHigh = JSON.parse(localStorage.getItem('6CardHighScore'))
    let twelveCardHigh = JSON.parse(localStorage.getItem('12CardHighScore'))
    let twoSixCardHigh = JSON.parse(localStorage.getItem('26CardHighScore'))
    if (sixCardHigh){
      sixHigh.innerText = `6 Cards - Card Flips: ${sixCardHigh.cardFlips} - ${clockify(sixCardHigh.timeElapsed)}`
    }
    if (twelveCardHigh){
      twelveHigh.innerText = `12 Cards - Card Flips: ${twelveCardHigh.cardFlips} - ${clockify(twelveCardHigh.timeElapsed)}`
    }
    if (twoSixCardHigh){
      twoSixHigh.innerText = `26 Cards - Card Flips: ${twoSixCardHigh.cardFlips} - ${clockify(twoSixCardHigh.timeElapsed)}`
    }
}
function handleCardClick(event) {
  if (clickedCards.length === 2){
    return
  }
  else {
    let card = event.target
    card.classList.toggle('flip');
    const found = cards.find(element => element.id === card.id);
    card.src = found.src
    card.removeEventListener("click", handleCardClick);
    clickedCards.push(card)
    updateScore()
    if (clickedCards.length === 2){
      setTimeout(checkMatches, 1000)  
    }
  }
}
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}
// func newGame stops current game if one exists, or creates a new game with num number of cards.
function newGame(num){
  const oldCards = document.getElementsByClassName("cards");
  if (oldCards.length !== 0){
    if (timer){
      timer.cancel()
      timer = ''
    }
    matchCount = 0
    cardFlips = 0
    timeElapsed = 0
    scoreDisplay.innerText = "Cards flipped: 0"
    timerDisplay.innerText = "Time: 00:00"
    removeAllChildNodes(gameContainer)
  } 
    cardsPlayed = num
    let arr = cards.slice(0, num)
    let shuffledCards = shuffle(arr);
    createCards(shuffledCards);
    startStop()
  }
  //retrieve high scores when page is loaded
  retrieveScores()