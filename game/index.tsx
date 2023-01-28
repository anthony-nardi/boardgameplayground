import { initGame } from "./gameLogic";

function startNewGame() {
  document.documentElement.classList.add("hideOverflow");
  document.getElementById("gameMenuDiv").classList.add("hidden");
  document.getElementById("chooseSetup").classList.remove("hidden");
}

function startGameWithRandomSetup() {
  document.getElementById("chooseSetup").classList.add("hidden");
  document.getElementById("gameStateBoardDiv").classList.remove("hidden");
  document.getElementById("gameStateDiv").classList.remove("hidden");
  initGame("RANDOM");
}

function startGameWithSymmetricSetup() {
  document.getElementById("chooseSetup").classList.add("hidden");
  document.getElementById("gameStateBoardDiv").classList.remove("hidden");
  document.getElementById("gameStateDiv").classList.remove("hidden");
  initGame("SYMMETRIC");
}

function backToGameMenu() {
  document.getElementById("gameMenuDiv").classList.remove("hidden");
  document.getElementById("rulesDiv").classList.add("hidden");
}

function showRules() {
  var link = document.createElement('a');
  link.href = 'tzaar_rulebook.pdf';
  link.download = 'tzaar_rulebook.pdf';
  link.dispatchEvent(new MouseEvent('click'));
}

function startApp() {
  document.getElementById("newGameDiv").addEventListener("click", startNewGame);
  document.getElementById("showRulesDiv").addEventListener("click", showRules);
  document
    .getElementById("randomSetup")
    .addEventListener("click", startGameWithRandomSetup);
  document
    .getElementById("symmetricalSetup")
    .addEventListener("click", startGameWithSymmetricSetup);
  document
    .getElementById("backToGameMenuDiv")
    .addEventListener("click", backToGameMenu);
}
window && window.addEventListener("DOMContentLoaded", startApp, false);
