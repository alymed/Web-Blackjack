let game = null;
const audio = document.getElementById('audio');
let audioPaused = false;
const jsConfetti = new JSConfetti();

function debug(an_object) {
    document.getElementById("debug").innerHTML = JSON.stringify(an_object);
}

function buttons_initialization() {
    document.getElementById("card").disabled = false;
    document.getElementById("stand").disabled = false;
    document.getElementById("new_game").disabled = true;
}

function finalize_buttons() {
    document.getElementById("card").disabled = true;
    document.getElementById("stand").disabled = true;
    document.getElementById("new_game").disabled = false;
}

function pauseAudio() {
    audio.pause();
    audioPaused = true;
    document.getElementById('pause-audio').disabled = true;
    document.getElementById('replay-audio').disabled = false;
}

function replayAudio() {
    audio.play();
    audioPaused = false;
    document.getElementById('pause-audio').disabled = false;
    document.getElementById('replay-audio').disabled = true;
}

function new_game() {
    if (!audioPaused) {
        audio.play();
    }
    clearTable();
    game = new BlackJack();
    dealer_1st_card();
    dealer_new_card();
    player_new_card();
    player_new_card();
    buttons_initialization();
    debug(game);
}

function update_dealer(state) {
    state = game.get_game_state();
    if (state.gameEnded){
        const playerScore = game.get_cards_value(game.get_player_cards());
        document.getElementById("player-points").textContent = `: ${playerScore}`;
        const dealerScore = game.get_cards_value(game.get_dealer_cards());
        document.getElementById("dealer-points").textContent = `: ${dealerScore}`;
        //document.getElementById("dealer-info").textContent=game.get_dealer_cards() + " ";
        if(state.dealerWon){
            document.getElementById("dealer-info").textContent += "--Dealer Won!--";
            document.getElementById("player-info").textContent += "--Player Lost!--";
        } if (state.draw){
            document.getElementById("dealer-info").textContent += "--Draw!--"; 
            document.getElementById("player-info").textContent += "--Draw!--"; 
        }if (state.dealerBusted){
            document.getElementById("dealer-info").textContent += "--Dealer Busted!--";
        }
        finalize_buttons();
    }
    update_player(state)
}

function update_player(state) {
    state = game.get_game_state();
    if (state.gameEnded){
        const playerScore = game.get_cards_value(game.get_player_cards());
        document.getElementById("player-points").textContent = `: ${playerScore}`;
        const dealerScore = game.get_cards_value(game.get_dealer_cards());
        document.getElementById("dealer-points").textContent = `: ${dealerScore}`;
        //document.getElementById("player-info").textContent=game.get_player_cards() + " "; 
        if(state.playerBusted){
            let hiddenCard = game.dealer_cards[0];
            document.getElementById("hidden-card").src = "img/png/" + hiddenCard + ".png";
            document.getElementById("player-info").textContent += "--Player Busted!--";
            document.getElementById("dealer-info").textContent += "--Dealer Won!--";
        }if(state.playerWon){
            document.getElementById("player-info").textContent += "--Player Won!--";
            document.getElementById("dealer-info").textContent += "--Dealer Lost!--";   

            jsConfetti.addConfetti({
                emojis: ['♠️', '♥️', '♦️', '♣️'],
            }).then(() => jsConfetti.addConfetti())
        }
        finalize_buttons();
    }
}

function dealer_1st_card() {
    game.dealer_1st_move();
    update_dealer(game.dealer_move);
    return this.state;
}

function dealer_new_card() {
    game.dealer_move();
    update_dealer(game.dealer_move);
    return this.state;
}

function player_new_card() {
    game.player_move();
    update_player(game.player_move);
    return this.state;
}

function dealer_finish() {
    let hiddenCard = game.dealer_cards[0];
    document.getElementById("hidden-card").src = "img/png/" + hiddenCard + ".png";
    game.setDealerTurn(true);
    let state = game.get_game_state();
    update_dealer(state);
    while (!state.gameEnded) {
        dealer_new_card();
    }
}

function clearTable() {
    const dealerCardsDiv = document.getElementById("dealer-cards");
    while (dealerCardsDiv.firstChild) {
        dealerCardsDiv.removeChild(dealerCardsDiv.firstChild);
    }
    const playerCardsDiv = document.getElementById("player-cards");
    while (playerCardsDiv.firstChild) {
        playerCardsDiv.removeChild(playerCardsDiv.firstChild);
    }
    document.getElementById("dealer-info").textContent = "";
    document.getElementById("player-info").textContent = "";
    document.getElementById("dealer-points").textContent = "";
    document.getElementById("player-points").textContent = ""; 

    let hiddenCard = document.createElement("img");
    hiddenCard.src = "img/png/card_back.png";
    hiddenCard.id = "hidden-card";
    document.getElementById("dealer-cards").append(hiddenCard);
}