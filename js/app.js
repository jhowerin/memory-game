/*
 * Create a list that holds all of your cards
 */
let theCardList = ['fa-anchor', 'fa-anchor', 'fa-bicycle', 'fa-bicycle', 
				'fa-bolt', 'fa-bolt', 'fa-bomb', 'fa-bomb', 'fa-cube', 
				'fa-cube', 'fa-diamond', 'fa-diamond', 'fa-leaf', 
				'fa-leaf', 'fa-paper-plane-o', 'fa-paper-plane-o' ];
					
// List of variables
let openCardList = [];	
let openCard0 = '';
let openCard1 = '';	

// counter variables	
let matchCounter = 0;	
let movesCounter = 0;

// holds the number of stars for the game play
let userStars=0;

// DOM holders
let cards = document.querySelectorAll('.card');
let stars = document.querySelector('.stars');
let starList = stars.querySelectorAll('.fa-star');
let restart = document.querySelector('.restart');
let gameTime = document.querySelector('.gameTime');
var modal = document.getElementById('myModal');

//Game Clock variables
let timerFlag = false;
let clock = 0;
let timer = 0;

// Kick of the game and start it!
startGame();
// Game has started 

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function startGame(){
	//setup game play
	gameSetup();
	// shuffle the cards
	let shuffledCardList = shuffle(theCardList);
	// Inside the class deck is where we will build the HTML for the cards
	let deck = document.querySelector('.deck');
	//Build the HTML using deck.innerHTML
	deck.innerHTML='';
	for(card of shuffledCardList){
		deck.innerHTML+='<li class="card"><i class="fa '+ card +'"></i></li>';
	}
	
	cards = document.querySelectorAll('.card');
	
	//This will leave the cards face down for two seconds before showing
	setTimeout (function() {
		for(card of cards){
			card.classList.add('open','show')
		}
	},2000);
	//This will leave the cards face up -open and show- for 8 seconds
	setTimeout(function() {
		for(card of cards){
			card.classList.remove('open','show')
		}
	},8000);

	//This timer basically doesn't allow clicks on cards during this
	//period
	setTimeout(function() {
		//card listener for clicks
		for ( card of cards ) {
			card.addEventListener('click', function() {
			displayCard(this);
			});
		}
	},8000);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
	console.log("shuffle");
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function displayCard(currentCard) {
	// start timer on first card click
	if(timerFlag==false){
		timerFlag = true;
		timer = window.setInterval(displayTimer, 1000);
	}
	// Only allow 2 cards to be revealed at any one time.
	if (openCardList.length >= 2 ) {
		console.log("Two card are open already");
		return;
	}
	// reveal selected card
	currentCard.classList.add('open', 'show');
	//call function to add currentCard to the openCardList
	cardList(currentCard);
}

//This function pushes the currentCard onto the openCardList
function cardList(currentCard) {
  console.log("in cardMatch");
  openCardList.push(currentCard);
  if(openCardList.length < 2){
	  //we added the currentCard to the openCardList, so let's
	  //update the movesCounter by calling the movesUpdate function. 
	  movesUpdate();
  }
  //If the openCardList list has two cards in it, we do comparisons
  if (openCardList.length >= 2) {
	  openCard0 = openCardList[0].querySelector('i').classList[1];
	    console.log(openCard0);//see console.log for debug if needed
	  openCard1 = openCardList[1].querySelector('i').classList[1];
		console.log(openCard1);
		console.log("two cards");//this let's us know that the openCardList list has
		//two cards already.
    // Let's check for a match with if-else
	if (openCard0 == openCard1){
		//with a match, call cardLock to have the cards remain open
		cardLock();
	} else {
		// with no match, cards are to return to face down. 
		cardRelease();
	}
	//The end of the game occurs when the cards are all matched.
	//Meaning, the matchCounter should be half of the length of the theCardList
	if(matchCounter >= (theCardList.length)/2){
		//call end of game function endGame()
		endGame();
	}
  }
}

//This function will "lock" the cards into place
//The cards will be placed into the match class and 
//removed from the open/show classes
function cardLock(){
	console.log("We have a match !");
	matchCounter++;
	//To lock, remove the open,show classes and add the match class
	openCardList[0].classList.add('match');
	openCardList[0].classList.remove('open', 'show');
	openCardList[1].classList.add('match');
	openCardList[1].classList.remove('open', 'show');
	//empty the openCardList 
	openCardList = [];
	movesUpdate();
}
//This function will release the cards so that go face down again
//and removed from the open/show classes
function cardRelease(){
	setTimeout( function() {
		openCardList[0].classList.remove('open', 'show');
		openCardList[1].classList.remove('open', 'show');
		openCardList = [];
	}, 1000 );
	 movesUpdate();
}

//movesUpdate function that increments the moves counter
//and assess gold star status
function movesUpdate(){
	movesCounter = movesCounter + 1;
	document.querySelector('.moves').textContent = movesCounter;
	let starList = stars.querySelectorAll('.fa-star');
	if(movesCounter>50){
		let changeStar = starList[0];
		changeStar.style.color='black';
		//userStars = 0;
	}
	else if(movesCounter>40){
		let changeStar = starList[1];
		changeStar.style.color='silver';
		userStars = 1;
	}
	else if(movesCounter>25){
		let changeStar = starList[2];
		changeStar.style.color='silver';
		userStars = 2;
		
	}
	else{}
}
//endGame function.  Print out console messages and modal message
function endGame() {
	//note reminder - template strings delimited with backticks `
	console.log(`Game is over. With ${theCardList.length} cards, you made ${matchCounter} matches`);
	document.querySelector('.moves').textContent = movesCounter;
	if ( timerFlag = true ) {
		window.clearInterval(timer);
	}
	
	//modal message
	//https://www.w3schools.com/howto/howto_css_modals.asp
	modal.style.display = "block";
	document.querySelector('.modal-content').textContent = "Game Over";
	document.querySelector('.modal-content').innerHTML = `<h1> Game Over </h1>`
	document.querySelector('.modal-content').innerHTML = 
		`<span>
			<h3>It took you ${clock} seconds</h3>
			<h3>and a total of ${movesCounter} moves</h3>
			<h3>You get ${userStars} stars out of 3!</h3>
			<button class="playAgain">Play Again?</button>
		</span>`
	let playAgain = document.querySelector('.playAgain');
	playAgain.addEventListener('click',function(){
		modal.style.display = "none";
		startGame();
	});

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
	//end modal stuff
}

// restart listener
restart.addEventListener("click", function() {
	if ( timerFlag = true ) {
		window.clearInterval(timer);
	}
	startGame();
});

// This function sets and resets values to start the game
// or if a user is repeating the game
function gameSetup(){
	timerFlag = false;
	clock = 0;
	timer = 0;
	openCardList = [];	
	openCard0 = '';
	openCard1 = '';		
	matchCounter = 0;	
	movesCounter = 0;
	userStars = 3;
	gameTime.textContent = clock;
	document.querySelector('.moves').textContent = movesCounter;
	starList[0].style.color='gold';
	starList[1].style.color='gold';
	starList[2].style.color='gold';
}

//display timer function
function displayTimer() {
  clock++;
  gameTime.textContent = clock;
}






