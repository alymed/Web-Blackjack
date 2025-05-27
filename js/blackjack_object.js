//Blackjack object

const MAX_POINTS = 21;

class BlackJack {
    constructor() {
        this.dealer_cards = [];
        this.player_cards = [];
        this.dealerTurn = false;

        this.state = {
            'gameEnded': false,
            'dealerWon': false,
            'playerBusted': false,
            'dealerBusted': false,
            'playerWon': false,
            'draw': false,
        };

        this.new_deck = function () {
            let values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
            let types = ["clubs", "diamonds", "hearts", "spades"];
            const deck = [];
            for (let i = 0; i < types.length; i++) {
                for (let j = 0; j < values.length; j++) {
                    deck.push(values[j] + "_of_" + types[i]);
                }
            }
            console.log('deck: ', deck)
            return deck;
        }

        this.shuffle = function (deck) {
            const shuffleDeck = [];
            for (let i = 0; i < 52; i++) {
                const randomIndex = Math.floor(Math.random() * deck.length);
                shuffleDeck.push(deck[randomIndex]);
                deck.splice(randomIndex, 1);
            }
            console.log('Shuffled Deck', shuffleDeck);
            return shuffleDeck
        };
        this.deck = this.shuffle(this.new_deck());
    }

    get_dealer_cards() { return this.dealer_cards; }

    get_player_cards() { return this.player_cards; }

    setDealerTurn(val) { this.dealerTurn = val; }

    get_cards_value(cards) {
        let points = 0;
        let aceCount = 0;
        for (let card = 0; card < cards.length; card++) {
            let value = cards[card].split("_")[0];
            if (isNaN(value)) { // A J Q K
                if (value === "ace") {
                    aceCount++;
                    points += 11;
                } else {
                    points += 10;
                }
            } else { points += parseInt(value); }
        }
        while (aceCount > 0 && points > 11) {
            points -= 10;
            aceCount--;
        }
        return points;
    }

    dealer_1st_move() {
        let card = this.deck.pop();
        this.dealer_cards.push(card);
        return this.get_game_state();
    }

    dealer_move() {
        let card = this.deck.pop();
        this.dealer_cards.push(card);
        let cardImg = document.createElement("img");
        cardImg.src = "img/png/" + card + ".png";
        document.getElementById("dealer-cards").append(cardImg);
        return this.get_game_state();
    }

    player_move() {
        let card = this.deck.pop();
        this.player_cards.push(card);
        let cardImg = document.createElement("img");
        cardImg.src = "img/png/" + card + ".png";
        document.getElementById("player-cards").append(cardImg);
        return this.get_game_state();
    }

    get_game_state() {
        const playlerPoints = this.get_cards_value(this.get_player_cards());
        const dealerPoints = this.get_cards_value(this.get_dealer_cards());

        const playerBusted = playlerPoints > MAX_POINTS;
        const dealerWon = this.dealerTurn && dealerPoints > playlerPoints && dealerPoints <= MAX_POINTS || playerBusted;
        const dealerBusted = this.dealerTurn && dealerPoints > MAX_POINTS ;
        const playerWon =  playlerPoints == MAX_POINTS || dealerBusted;
  
        this.state.gameEnded = playerWon || playerBusted || dealerWon || dealerBusted;
        this.state.dealerWon = dealerWon;
        this.state.playerWon = playerWon;
        this.state.playerBusted = playerBusted;
        this.state.dealerBusted = dealerBusted;
        this.state.draw = dealerPoints == playlerPoints;
        
        return this.state;
    }
}