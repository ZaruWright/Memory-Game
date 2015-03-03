var MemoryGame;

StatesCards = {
		back:0 ,
		flopCard:1 ,
		found:2
};

MemoryGame = function (gs){
	//Probar a poner var delante
	this.gs = gs;
	this.message = "";
	this.allCards = ['8-ball', 'potato', 'dinosaur', 'kronos', 'rocket', 'unicorn', 'guy', 'zeppelin'];
	// Decide cuando termina el juego
	this.stateGame = {
		cardsOnTheTable: [],
		lastCard: null,
		pairs: 8,
		refreshIntervalId: null,
		busy: false
	}
}


MemoryGame.prototype = {

	initGame: function(){
		for (i = 0, j = 0; i < this.allCards.length;i++, j+=2){
			this.stateGame.cardsOnTheTable[j]   = new MemoryGame.Card(this.allCards[i]);
			this.stateGame.cardsOnTheTable[j+1] = new MemoryGame.Card(this.allCards[i]);
		}
		
		this.stateGame.cardsOnTheTable = this.stateGame.cardsOnTheTable.sort(function (){
																				return Math.random() - 0.5;
																			});

		this.message = "Memory Game";

		this.loop();
	},

	finishGame: function(){
		return this.stateGame.pairs == 0;
	},

	draw: function(){
		if (this.finishGame()){
			this.message = "You win!!"
			clearInterval(this.stateGame.refreshIntervalId);
		}	
		this.gs.drawMessage(this.message);
		for (i = 0; i < this.stateGame.cardsOnTheTable.length; i++){
			this.stateGame.cardsOnTheTable[i].draw(this.gs, i);
		}	
	},

	loop: function(){
		var that = this;
		this.stateGame.refreshIntervalId = setInterval(function () {that.draw.call(that)}, 16); //60fpss
	},

	onClick: function(CardId){
		if (this.stateGame.cardsOnTheTable[CardId].stateCard != StatesCards.found && !this.stateGame.busy){
			if (this.stateGame.lastCard == null){
				this.stateGame.lastCard = this.stateGame.cardsOnTheTable[CardId];
				this.stateGame.cardsOnTheTable[CardId].flip();
			}
			else{ 
				if (this.stateGame.cardsOnTheTable[CardId] != this.stateGame.lastCard && 
					this.stateGame.cardsOnTheTable[CardId].compareTo(this.stateGame.lastCard)){
					this.stateGame.cardsOnTheTable[CardId].flip();
					this.stateGame.cardsOnTheTable[CardId].found();
					this.stateGame.lastCard.found();
					this.stateGame.lastCard = null;
					this.stateGame.pairs--;
					this.message = "Match found!!";
				}
				else{
					var that = this;
					this.stateGame.cardsOnTheTable[CardId].flip();
					this.message = "Try again";
					this.stateGame.busy = true;
					setTimeout(function(){
						that.stateGame.lastCard.flip();
						that.stateGame.cardsOnTheTable[CardId].flip();
						that.stateGame.lastCard = null;
						that.stateGame.busy = false;
					}, 1000);	
				}
			}
		}
	}

}

MemoryGame.Card = function(sprite){
	this.spriteName = sprite;
	this.stateCard = StatesCards.back;
}

MemoryGame.Card.prototype = {

	flip: function(){
		if (this.stateCard == StatesCards.back){
			this.stateCard = StatesCards.flopCard;
		}
		else if (this.stateCard == StatesCards.flopCard){
			this.stateCard = StatesCards.back;
		}
	},

	found: function(){
		this.stateCard = StatesCards.found;
	},

	compareTo: function(otherCard){
		return this.spriteName == otherCard.spriteName;
	},

	draw: function(gs, pos){
		if (this.stateCard == StatesCards.back){
			gs.draw("back", pos);
		}
		else{
			gs.draw(this.spriteName, pos);
		}
	}
}