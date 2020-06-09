var othello = {
    othello: null,
    score: null,
    turno: null,
    ai: 0,
    round: 0,
    x: 8,
    y: 8,
    griglia: [],
    //creo un array "stati" per i vari oggetti
    states: {
        'blank': { 'id': 0, 'color': 'white' },
        'white': { 'id': 1, 'color': 'white' },
        'black': { 'id': 2, 'color': 'black' }
    },

    //inizializzazione
    init: function (selector) {
        //this.popUp();

        this.othello = document.getElementById(selector);
        this.othello.className = (this.othello.className ? this.othello.className + ' ' : '') + 'othello';
        this.creaGriglia();
        this.initGame();
    },

    popUp: function () {

            var person = prompt("Ciao, benvenuto in Othello!\nScrivi 2p se vuoi giocare con un tuo amico,\noppure bot se vuoi giocare contro il computer.", "");
            if (person == "bot")
              this.ai=1;
          },

    //preparo la griglia di gioco e il primo player
    //
    initGame: function () {
        this.score.black.elem.innerHTML = '&nbsp;2&nbsp;';
        this.score.white.elem.innerHTML = '&nbsp;2&nbsp;';
        this.score.round.elem.innerHTML = '&nbsp;ROUND 0&nbsp;';
        this.setTurno(this.states.white);

        this.setStato(4, 4, this.states.white);
        this.setStato(4, 5, this.states.black);
        this.setStato(5, 4, this.states.black);
        this.setStato(5, 5, this.states.white);
    },

    // controlla di chi è il prossimo turno e chiama setTurno per cambiarlo
    checkTurno: function () {

        var coloreTurno = (this.turno.id === this.states.black.id) ? this.states.white : this.states.black;

        this.setTurno(coloreTurno);
    },

    //cambia il turno 
    setTurno: function (colore) {

        this.turno = colore;

        var isBlack = (colore.id === this.states.black.id);

        this.score.black.elem.style.textDecoration = isBlack ? 'underline' : '';
        this.score.white.elem.style.textDecoration = isBlack ? '' : 'underline';
    },

    //inizializzo lo stato
    initState: function (elem) {

        return {
            'state': this.states.blank,
            'elem': elem
        };
    },

    //controllo se le coordinate date sono dentro la griglia
    isValidPosition: function (x, y) {

        return (x >= 1 && x <= this.x) && (y >= 1 && y <= this.y);
    },

    // setta lo stato delle pedine 
    setStato: function (x, y, state) {

        if (!this.isValidPosition(x, y)) {

            return;
        }

        this.griglia[x][y].state = state;
        this.griglia[x][y].elem.style.visibility = this.isVisible(state) ? 'visible' : 'hidden';
        this.griglia[x][y].elem.style.backgroundColor = state.color;
    },

    //controllo se la posizione è occupata
    isOccupato: function (x, y) {

        return this.isVisible(this.griglia[x][y].state);
    },

    isVisible: function (state) {

        return (state.id === this.states.white.id || state.id === this.states.black.id);
    },


    //creo la tabella
    creaGriglia: function () {

        var table = document.createElement('table');

        for (var i = 1; i <= this.x; i++) {

            var tr = document.createElement('tr');

            table.appendChild(tr);

            this.griglia[i] = [];

            for (var j = 1; j <= this.y; j++) {

                var td = document.createElement('td');

                tr.appendChild(td);

                //setto che cliccando aziona per mettere la pedina
                this.bindMove(td, i, j);

                // salviamo gli oggetti per usarli dopo
                this.griglia[i][j] = this.initState(td.appendChild(document.createElement('span')));
            }
        }

        //creo la tabella del punteggio
        var scoreBar = document.createElement('div'),
            roundCounter = document.createElement('span');
        scoreBlack = document.createElement('span'),
            scoreWhite = document.createElement('span');

        roundCounter.className = 'round-counter';
        scoreBlack.className = 'score-node-black score-white';
        scoreWhite.className = 'score-node-white score-black';

        scoreBar.appendChild(scoreBlack);
        scoreBar.appendChild(scoreWhite);
        
        this.score = {
            'round': {
                'elem': roundCounter,
                'state': 0
            }, 'black': {
                'elem': scoreBlack,
                'state': 0
            },
            'white': {
                'elem': scoreWhite,
                'state': 0
            },
            
        }
        
        this.othello.appendChild(roundCounter);
        this.othello.appendChild(table);
        this.othello.appendChild(scoreBar);
        
    },

    //calcola il punteggio contando le pedine controllandone il colore
    calcolaScore: function () {
        this.round = this.round + 1;
        var scoreWhite = 0,
            scoreBlack = 0;

        for (var i = 1; i <= this.x; i++) {

            for (var j = 1; j <= this.y; j++) {

                if (this.isValidPosition(i, j) && this.isOccupato(i, j)) {

                    if (this.griglia[i][j].state.id === this.states.black.id) {

                        scoreBlack++;
                    } else {

                        scoreWhite++;
                    }
                }
            }
        }

        this.setScore(scoreBlack, scoreWhite, this.round);
    },

    //riceve i 2 punteggi e li stampa nel tabellone del punteggio
    setScore: function (scoreBlack, scoreWhite, round) {

        this.score.black.state = scoreBlack;
        this.score.round.state = round;
        this.score.white.state = scoreWhite;

        this.score.black.elem.innerHTML = '&nbsp;' + scoreBlack + '&nbsp;';
        this.score.round.elem.innerHTML = '&nbsp;ROUND ' + round + '&nbsp;';
        this.score.white.elem.innerHTML = '&nbsp;' + scoreWhite + '&nbsp;';
    },

    //controlla le direzioni per vedere se la mossa è valida
    checkValido: function (x, y) {

        var current = this.turno,
            xCheck,
            yCheck,
            toCheck = (current.id === this.states.black.id) ? this.states.white : this.states.black;

        if (!this.isValidPosition(x, y) || this.isOccupato(x, y)) {

            return false;
        }

        for (var xDir = -1; xDir <= 1; xDir++) {

            for (var yDir = -1; yDir <= 1; yDir++) {

                if (xDir === 0 && yDir === 0) {

                    continue;
                }

                xCheck = x + xDir;
                yCheck = y + yDir;
                var itemFound = false;

                // cerco per degli oggetti 
                while (this.isValidPosition(xCheck, yCheck) && this.isOccupato(xCheck, yCheck) && this.griglia[xCheck][yCheck].state.id === toCheck.id) {

                    xCheck += xDir;
                    yCheck += yDir;

                    itemFound = true;
                }

                if (itemFound) {

                    //controllo di chi è l'oggetto trovato
                    if (this.isValidPosition(xCheck, yCheck) && this.isOccupato(xCheck, yCheck) && this.griglia[xCheck][yCheck].state.id === current.id) {

                        return true;
                    }
                }
            }
        }

        return false;
    },

    //controlla la griglia
    checkMossa: function () {

        for (var i = 1; i <= this.x; i++) {

            for (var j = 1; j <= this.y; j++) {

                if (this.checkValido(i, j)) {

                    return true;
                }
            }
        }

        return false;
    },

    aiController: function(){
        alert("function ai");
        var x=3
        var y=2

        this.gameController(x,y)
    },



    //ricevo l'imput dal player
    bindMove: function (elem, x, y) {

        var self = this;

        elem.onclick = function (event) {

            if (self.checkMossa()) {

                //controllo se è valida, se no passo il turno all'altro giocatore
                if (self.checkValido(x, y)) {

                    self.mossa(x, y);

                    if (!self.checkMossa()) {

                        self.checkTurno();

                        if (!self.checkMossa()) {

                            self.endGame();
                        }
                    }

                    // nel caso che la griglia è piena, finisco il gioco
                    if (self.checkEnd()) {

                        self.endGame();
                    }
                }
            }
            if (self.ai==1){
                alert("boooot");
                self.aiController();
            }
        };
    },



    gameController: function(x,y){
        alert("controller");
        var self = this;
        if (self.checkMossa()) {

            //controllo se è valida, se no passo il turno all'altro giocatore
            if (self.checkValido(x, y)) {

                self.mossa(x, y);

                if (!self.checkMossa()) {

                    self.checkTurno();

                    if (!self.checkMossa()) {

                        self.endGame();
                    }
                }

                // nel caso che la griglia è piena, finisco il gioco
                if (self.checkEnd()) {

                    self.endGame();
                }
            }
        }
    },



    checkMossa: function () {

        for (var i = 1; i <= this.x; i++) {

            for (var j = 1; j <= this.y; j++) {

                if (this.checkValido(i, j)) {

                    return true;
                }
            }
        }

        return false;
    },

    //controllo le direzioni per cercare degli oggetti per poi controllare di che colore sono e aggiungerli alla lista di oggetti possibili
    mossa: function (x, y) {

        var finalItems = [],
            current = this.turno,
            xCheck,
            yCheck,
            toCheck = (current.id === this.states.black.id) ? this.states.white : this.states.black;

        // controllo le direzioni
        for (var xDir = -1; xDir <= 1; xDir++) {

            for (var yDir = -1; yDir <= 1; yDir++) {

                if (xDir === 0 && yDir === 0) {

                    continue;
                }

                xCheck = x + xDir;
                yCheck = y + yDir;
                var possibleItems = [];

                //cerco per degli oggetti
                while (this.isValidPosition(xCheck, yCheck) && this.isOccupato(xCheck, yCheck) && this.griglia[xCheck][yCheck].state.id === toCheck.id) {

                    possibleItems.push([xCheck, yCheck]);
                    xCheck += xDir;
                    yCheck += yDir;
                }

                if (possibleItems.length) {

                    //controllo di chi è l'oggetto trovato
                    if (this.isValidPosition(xCheck, yCheck) && this.isOccupato(xCheck, yCheck) && this.griglia[xCheck][yCheck].state.id === current.id) {

                        finalItems.push([x, y]);

                        for (var item in possibleItems) {

                            finalItems.push(possibleItems[item]);
                        }
                    }
                }
            }
        }

        // cerco per oggetti da controllare
        if (finalItems.length) {

            for (var item in finalItems) {

                this.setStato(finalItems[item][0], finalItems[item][1], current);
            }
        }

        this.setTurno(toCheck);
        this.calcolaScore();
    },

    //controlla se la griglia è piena
    checkEnd: function (lastMove) {

        for (var i = 1; i <= this.x; i++) {

            for (var j = 1; j <= this.y; j++) {

                if (this.isValidPosition(i, j) && !this.isOccupato(i, j)) {

                    return false;
                }
            }
        }

        return true;
    },

    //se la griglia è piena, finisce il gioco e resetta la griglia
    endGame: function () {

        var result = (this.score.black.state > this.score.white.state)
            ?
            1
            : (
                (this.score.white.state > this.score.black.state) ? -1 : 0
            ), message;

        switch (result) {

            case 1: { message = 'Nero vince.'; } break;
            case -1: { message = 'Bianco vince.'; } break;
            case 0: { message = 'pareggio.'; } break;
        }

        alert(message);
        this.reset();
    },

    reset: function () {
        this.clear();
        this.initGame();
    },

    //svuoto la griglia
    clear: function () {

        for (var i = 1; i <= this.x; i++) {

            for (var j = 1; j <= this.y; j++) {

                this.setStato(i, j, this.states.blank);
            }
        }
        round=0;
    },


};
