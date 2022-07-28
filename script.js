const gameContainer = document.getElementById("game");
const score = document.getElementById("score")
document.body.style.backgroundColor = 'rgb(15, 93, 45)';
const cardBack = 'back-of-card.jpg'

const cards = [
  {src: "https://deckofcardsapi.com/static/img/AC.png",
  id: 'AC'}, 
  {src: "https://deckofcardsapi.com/static/img/KD.png",
  id: 'KD'}, 
  {src: "https://deckofcardsapi.com/static/img/AH.png",
  id: 'AH'}, 
  {src: "https://deckofcardsapi.com/static/img/KS.png",
  id: 'KS'}, 
  {src: "https://deckofcardsapi.com/static/img/QC.png",
  id: 'QC'}, 
  {src: "https://deckofcardsapi.com/static/img/QD.png",
  id: 'QD'}, 
  {src: "https://deckofcardsapi.com/static/img/JH.png",
  id: 'JH'}, 
  {src: "https://deckofcardsapi.com/static/img/JS.png",
  id: 'JS'}, 
  {src: "https://deckofcardsapi.com/static/img/0C.png",
  id: '0C'}, 
  {src: "https://deckofcardsapi.com/static/img/0D.png",
  id: '0D'}, 
  {src: "https://deckofcardsapi.com/static/img/9S.png",
  id: '9S'},
  {src: "https://deckofcardsapi.com/static/img/9C.png",
  id: '9C'}, 
]

// let cardVals = ['A','K','Q','J','2','3','4','5','6','7','8','9','0']
// let suits = ['C','H','D','S']

// loopedCards = []

// let suitIndex = 0
// for (let i = 0; i < 13; i++){
//   suitIndex++
//   suitIndex = i % 4 === 0 ? 0 : suitIndex
//   loopedCards.push({
//     src: `https://deckofcardsapi.com/static/img/${cardVals[i]}${suits[suitIndex]}.png`,
//     id:  `${cardVals[i]}${suits[suitIndex]}`
//   })
// }

let clickedCards = []
let matchCount = 0
let cardFlips = 0
let cardsPlayed = 0


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
    cardOne.addEventListener("click", handleCardClick);
    cardTwo.src = cardBack
    cardTwo.addEventListener("click", handleCardClick);
  }
  clickedCards = []
  if (matchCount === cardsPlayed / 2){
    alert('Congrats! You matched all the cards!')
  }
}
function updateScore(){
  cardFlips++
  score.innerText = `Cards flipped: ${cardFlips}`

}

function handleCardClick(event) {
  console.log('clicked')
  if (clickedCards.length === 2){
    return
  }
  else {
    const found = cards.find(element => element.id === event.target.id);
    event.target.src = found.src
    event.target.removeEventListener("click", handleCardClick);
    clickedCards.push(event.target)
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

function newGame(num){
  const oldCards = document.getElementsByClassName("cards");
  if (oldCards.length !== 0){
    matchCount = 0
    cardFlips = 0
    score.innerText = "Cards flipped: 0"
    removeAllChildNodes(gameContainer)
  }
  cardsPlayed = num
  let arr = cards.slice(0, num)
  let shuffledCards = shuffle(arr);
  createCards(shuffledCards);
}
