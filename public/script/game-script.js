class Player {
  constructor() {
    this.rock = document.querySelectorAll(".options-rock");
    this.paper = document.querySelectorAll(".options-paper");
    this.scissors = document.querySelectorAll(".options-scissors");
  }
}

class HumanPlayer extends Player {
  constructor() {
    super();
    this.#getPlayerOptions();
  }
  #getPlayerOptions() {
    this.options = [this.rock[0], this.paper[0], this.scissors[0]];
    this.rock = this.rock[0];
    this.paper = this.paper[0];
    this.scissors = this.scissors[0];
  }
}

class ComputerPlayer extends Player {
  constructor() {
    super();
    this.#getComputerOptions();
  }
  #getComputerOptions() {
    this.options = [this.rock[1], this.paper[1], this.scissors[1]];
    this.rock = this.rock[1];
    this.paper = this.paper[1];
    this.scissors = this.scissors[1];
  }
}

class App {
  constructor() {
    this.player = new HumanPlayer();
    this.computer = new ComputerPlayer();
    this.result = document.querySelector(".result-game");
    this.resetButton = document.querySelector(".reset-button");
    this.startListener();
  }
  getComputerChoice() {
    this.computerChoice = this.computer.options[Math.floor(Math.random() * 3)];
  }
  getGameResult(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
      this.result.innerHTML = "DRAW";
    } else if (playerChoice === "rock" && computerChoice === "scissors") {
      this.result.innerHTML = "Player 1 WIN!";
    } else if (playerChoice === "paper" && computerChoice === "rock") {
      this.result.innerHTML = "Player 1 WIN!";
    } else if (playerChoice === "scissors" && computerChoice === "paper") {
      this.result.innerHTML = "Player 1 WIN!";
    } else {
      this.result.innerHTML = "Computer WIN!";
    }
  }
  startingState() {
    this.player.options.forEach(function (option) {
      option.classList.remove("selected-border");
      option.disabled = false;
      option.classList.add("hover-prop");
    });
    this.computer.options.forEach(function (option) {
      option.classList.remove("selected-border");
    });
    this.result.innerHTML = "VS";
    this.result.parentElement.classList = "result-div d-flex flex-column justify-content-center";
  }
  endingState() {
    this.playerChoice.classList.add("selected-border");
    this.computerChoice.classList.add("selected-border");

    this.player.options.forEach(function (option) {
      option.disabled = true;
      option.classList.remove("hover-prop");
      option.onclick = () => {
        return false;
      };
    });
  }
  renderResult() {
    if (this.result.innerHTML === "Player 1 WIN!") {
      this.result.parentElement.classList.add("player-win");
    } else if (this.result.innerHTML === "Computer WIN!") {
      this.result.parentElement.classList.add("computer-win");
    } else {
      this.result.parentElement.classList.add("draw-result");
    }
  }
  logger() {
    console.group("SUUUUUUIT!!!");
    console.log(`Player 1 memilih ${this.playerChoice.title}`);
    console.log(`Computer memilih ${this.computerChoice.title}`);
    console.log("......");
    console.log(`Hasil pertandingan ini adalah ${this.result.innerHTML}`);
    console.groupEnd();
  }
  startListener() {
    this.startingState();
    console.log("Silahkan memilih antara rock, paper, atau scissors sebagai suitmu.");

    this.player.rock.onclick = () => {
      this.playerChoice = this.player.rock;
      this.getComputerChoice();
      this.getGameResult(this.playerChoice.title, this.computerChoice.title);
      this.renderResult();
      this.logger();
      this.endingState();
    };
    this.player.paper.onclick = () => {
      this.playerChoice = this.player.paper;
      this.getComputerChoice();
      this.getGameResult(this.playerChoice.title, this.computerChoice.title);
      this.renderResult();
      this.logger();
      this.endingState();
    };
    this.player.scissors.onclick = () => {
      this.playerChoice = this.player.scissors;
      this.getComputerChoice();
      this.getGameResult(this.playerChoice.title, this.computerChoice.title);
      this.renderResult();
      this.logger();
      this.endingState();
    };
    this.resetButton.onclick = () => {
      this.startListener();
    };
  }
}

const game = new App();
