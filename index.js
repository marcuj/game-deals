/*
 * Name: Marcus Jundt
 * Date: 4/24/2024
 * Section: CSE 154 AE
 *
 * This is the JS which 
 */

"use strict";
(function() {
  const CHEAP_SHARK_URL = "";

  window.addEventListener("load", init);

  /** Initializes h fhjvjdfbjh */
  function init() {
    
    let searchBtn = id("search-btn");
    searchBtn.addEventListenter("click", searchTitles);

    let seeAllBtn = id("btn-see-all");
    seeAllBtn.addEventListener("click", displayAllDeals);

  }

  function searchTitles(evt) {
    let barEl = evt.target.parentNode.firstElementChild; // ? :D
    let query = barEl.value;

  }

  function displayAllDeals() {

  }

  function createBoard() {
    let board = id("board");
    let boardSize = STAN_SIZE;
    let isEasy = isEasyDiff();
    if (isEasy) {
      boardSize = EASY_SIZE;
    }
    for (let i = 0; i < boardSize; i++) {
      let card = generateUniqueCard(isEasy);
      board.appendChild(card);
    }
  }

  /** Deletes the board by removing the innerHTML of the board DOM element */
  function deleteBoard() {
    let board = id("board");
    board.innerHTML = "";
  }

  function generateUniqueCard(isEasy) {
    let attributes;
    let cardID;
    let imgFile;

    let count = attributes[attributes.length - 1];
    let cardElement = gen("div");
    let imgElement = gen("img");
    cardElement.classList.add("card");
    cardElement.id = cardID;
    imgElement.src = imgFile;
    imgElement.alt = cardID;
    for (let i = 0; i < count; i++) {
      cardElement.appendChild(imgElement.cloneNode(true));
    }
    cardElement.addEventListener("click", cardSelected);
    return cardElement;
  }

  /**
   * Create element from given tag name - took from CSE 154 Lecture 07 slides
   * @param {String} tagName - name of HTML element created
   * @return {Element} - HTML element with given name
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Get element from id shortcut - took from CSE 154 Lecture 07 slides
   * @param {String} id - id of HTML element
   * @return {Element} - HTML element with given id
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Query selector shortcut - adapted from CSE 154 Lecture 07 slides
   * @param {Element} node - HTML element to start query from
   * @param {String} selector - class name to get HTML element
   * @return {Element} - HTML element with given selector under given node
   */
  function qs(node = document, selector) {
    return node.querySelector(selector);
  }

  /**
   * Query selector all shortcut - took from CSE 154 Lecture 07 slides
   * @param {String} selector - class name of HTML element
   * @return {NodeList<Element>} - list of HTML elements with given class name
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }
})();