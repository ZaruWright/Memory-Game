/*
* Samuel García Segador
*/

var MemoryGame;

StatesCards = {
		back:0 ,
		flopCard:1 ,
		found:2
};

/*
* Constructora de Memory Game
*/
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

/*
* Métodos de de la clase Memory Game
*/
MemoryGame.prototype = {

	/*
	* Inicializa el Juego creando las cartas, desordenandolas y llamando al bucle
	* principal del juego.
	*/
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

	/*
	* Indica si el juego ha acabado o no, es decir, cuando todas las parejas estén levantadas.
	*/
	finishGame: function(){
		return this.stateGame.pairs == 0;
	},

	/*
	* Dibuja las cartas en el tablero dependiendo del estado en el que se encuentre la carta y
	* Comprobamos si el juego ha acabado.
	*/
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

	/*
	* Llamamos cada 16 ms (60 FPS) a la funcion draw para que dibuje las cartas en el tablero.
	*/
	loop: function(){
		var that = this;
		this.stateGame.refreshIntervalId = setInterval(function () {that.draw.call(that)}, 16);
	},

	clickOnCard: function(CardId){
		return CardId >= 0 && CardId != null;
	},

	/*
	* Comprobamos si las dos cartas levantadas son la misma o no.
	*/
	onClick: function(CardId){
		if ( this.clickOnCard(CardId) && this.stateGame.cardsOnTheTable[CardId].stateCard != StatesCards.found && !this.stateGame.busy){
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

/*
* Constructor de Card
*/
MemoryGame.Card = function(sprite){
	this.spriteName = sprite;
	this.stateCard = StatesCards.back;
}

/*
* Métodos de la clase Card.
*/
MemoryGame.Card.prototype = {

	/*
	* Voltear la carta de boca abajo a boca arriba y viceversa
	*/
	flip: function(){
		if (this.stateCard == StatesCards.back){
			this.stateCard = StatesCards.flopCard;
		}
		else if (this.stateCard == StatesCards.flopCard){
			this.stateCard = StatesCards.back;
		}
	},

	/*
	* Pone la carta como encontrada.
	*/
	found: function(){
		this.stateCard = StatesCards.found;
	},

	/*
	* Compara si los sprites de las cartas son iguales.
	*/
	compareTo: function(otherCard){
		return this.spriteName == otherCard.spriteName;
	},

	/*
	* Dibuja una carta en el tablero.
	*/
	draw: function(gs, pos){
		if (this.stateCard == StatesCards.back){
			gs.draw("back", pos);
		}
		else{
			gs.draw(this.spriteName, pos);
		}
	}
}