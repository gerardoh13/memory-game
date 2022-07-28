const gameContainer = document.getElementById("game");

const cardBack = 'back-of-card.jpg'

const cards = [
  {src: "https://deckofcardsapi.com/static/img/AC.png",
  id: 'AC'}, 
  {src: "https://deckofcardsapi.com/static/img/KD.png",
  id: 'KD'}, 
  {src: "https://deckofcardsapi.com/static/img/AD.png",
  id: 'AD'}, 
  {src: "https://deckofcardsapi.com/static/img/KS.png",
  id: 'KS'}, 
]

let clickedCards = []
let matchCount = 0

//Get a new deck of 20 cards
// fetch('http://deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,AC,KS,KC,QH,QD,JH,JD,0S,0C,9S,9C,8H,8D,7H,7D,6S,6C,5H,5D')
//     .then(response => response.json())
//     .then(data => apiResponse = data);

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledCards = shuffle(cards);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createCards(cardArray) {
  for (let card of cardArray) {
    // create a new div
    // const newDiv = document.createElement("div");
    const newImg = document.createElement("img")
    newImg.setAttribute("src", cardBack);
    // give it a class attribute for the value we are looping over
    newImg.classList.add("card");
    newImg.id = card.id

    // call a function handleCardClick when a div is clicked on
    newImg.addEventListener("click", handleCardClick);
    // newDiv.append(newImg)
    // append the div to the element with an id of game
    gameContainer.append(newImg);
  }
}
function checkMatches () {
  let cardOne = clickedCards[0]
  let cardTwo = clickedCards[1]
  console.log(cardOne)
  console.log(cardTwo)
  if (cardOne.id[0] === cardTwo.id[0]){
    matchCount++
    alert(`You have ${matchCount} matches`)
  }  else {
    cardOne.src = cardBack
    cardOne.addEventListener("click", handleCardClick);
    cardTwo.src = cardBack
    cardTwo.addEventListener("click", handleCardClick);
  }
  clickedCards = []

}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  if (clickedCards.length === 2){
    console.log('too many')
  }
  else {
    const found = cards.find(element => element.id === event.target.id);
    event.target.src = found.src
    event.target.removeEventListener("click", handleCardClick);
    clickedCards.push(event.target)
    if (clickedCards.length === 2){
      setTimeout(checkMatches, 1000)  
    }
  }

}

// when the DOM loads
createCards(shuffledCards);

/* */