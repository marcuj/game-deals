/*
 * Name: Marcus Jundt
 * Date: 4/24/2024
 * Section: CSE 154 AE
 *
 * This is the JS which 
 */

"use strict";
(function() {
  const CHEAP_SHARK_URL = "https://www.cheapshark.com/api/1.0/";

  const STORES = ["Steam", "GamersGate", "GreenManGaming", "Amazon", "GameStop", "Direct2Drive",
  "GOG", "Origin", "Get Games", "Shiny Loot", "Humble Store", "Desura", "IndieGameStand",
  "Fanatical", "Gamesrocket", "Games Republic", "SilaGames", "Playfield", "ImperialGames",
  "WinGameStore", "FunStockDigital", "GameBillet", "Voidu", "Epic Games Store", "Razer Game Store",
  "Gamesplanet", "Gamesload", "2Game", "IndieGala", "Blizzard Shop", "AllYouPlay", "DLGamer",
  "Noctre", "DreamGame"];

  const JSON = {"gameInfo":{"storeID":"21","gameID":"93503","name":"BioShock Infinite",
  "steamAppID":"8870","salePrice":"5.99","retailPrice":"29.99","steamRatingText":"Very Positive",
  "steamRatingPercent":"93","steamRatingCount":"101749","metacriticScore":"94",
  "metacriticLink":"\/game\/bioshock-infinite\/","releaseDate":1364169600,"publisher":"N\/A",
  "steamworks":"1","thumb":"https:\/\/cdn.cloudflare.steamstatic.com\/steam\/apps\/8870\/capsule_sm_120.jpg?t=1602794480"},
  "cheaperStores":[],"cheapestPrice":{"price":"3.79","date":1703265375}};

  window.addEventListener("load", init);

  /** Initializes h fhjvjdfbjh */
  function init() {
    
    let searchBtn = id("btn-search");
    searchBtn.addEventListener("click", fetchGames); 

    let seeAllBtn = id("btn-see-all");
    seeAllBtn.addEventListener("click", fetchAllDeals); // () => addResultRow(JSON) TEMP TEST CAHNGE TO fetchAllDeals

  }

  async function fetchGames(evt) {
    try {
      id("results").classList.remove("hidden");
      id("results").innerHTML = "";

      let barEl = evt.target.parentNode.firstElementChild; // ? :D
      let query = barEl.value;

      let response = await fetch(CHEAP_SHARK_URL + "games?title=" + query);
      await statusCheck(response);
      let gameList = await response.json();

      for (let i = 0; i < gameList.length; i++) {
        let gameJson = await fetchGameInfo(gameList[i].cheapestDealID);
        addResultRow(gameJson);
      }
    } catch (err) {
      displayError();
    }
  }

  async function fetchGameInfo(dealID) {
    try {
      let response = await fetch(CHEAP_SHARK_URL + "deals?id=" + dealID);
      await statusCheck(response);
      let gameJson = await response.json();
      return gameJson;
    } catch (err) {
      displayError();
    }
  }

  function addResultRow(gameJson) {
    //TEMP REMOVE THESE!!!!!!!!!!!!!
    // id("results").classList.remove("hidden");
    // id("results").innerHTML = "";
    let gameInfo = gameJson.gameInfo;

    let rowEl = gen("article");
    rowEl.classList.add("row");

    let imgEl = gen("img");
    imgEl.src = gameInfo.thumb;
    imgEl.alt = gameInfo.name;

    let infoEl = gen("div");
    infoEl.classList.add("info");
    
    let titleEl = gen("h2");
    titleEl.textContent = gameInfo.name; // + "yoyoo what is gong on you guys"; // LOLGE remove

    let ratingEl = gen("p");
    let ratingValue = Number(gameInfo.steamRatingPercent);
    if (ratingValue === 0) {
      ratingEl.textContent = "No rating data";
      ratingEl.classList.add("grey-text");
    } else {
      ratingEl.textContent = ratingValue + "% positive ratings";
      if (ratingValue >= 75) {
        ratingEl.classList.add("blue-text");
      } else if (ratingValue >= 55) {
        ratingEl.classList.add("yellow-text");
      } else {
        ratingEl.classList.add("red-text");
      }
    }

    let storeEl = gen("div");
    storeEl.classList.add("store-info");
    let greyText = gen("p");
    greyText.classList.add("grey-text");
    greyText.textContent = "Best deal on ";
    let storeName = gen("p");
    storeName.textContent = STORES[Number(gameInfo.storeID) - 1];

    let retailPrice = Number(gameInfo.retailPrice);
    let salePrice = Number(gameInfo.salePrice);

    let discountEl = gen("p");
    let percent = 100 - Math.round((salePrice / retailPrice) * 100);
    discountEl.textContent = "- " + percent + "%";
    discountEl.classList.add("discount-text");

    let priceEl = gen("div");
    priceEl.classList.add("price-container");
    let oldPrice = gen("p");
    let newPrice = gen("p");
    oldPrice.textContent = "$" + retailPrice;
    newPrice.textContent = "$" + salePrice;
    oldPrice.classList.add("old-price");
    newPrice.classList.add("new-price");
    
    priceEl.appendChild(oldPrice);
    priceEl.appendChild(newPrice);

    storeEl.appendChild(greyText);
    storeEl.appendChild(storeName);

    infoEl.appendChild(titleEl);
    infoEl.appendChild(ratingEl);
    infoEl.appendChild(storeEl);

    rowEl.appendChild(imgEl);
    rowEl.appendChild(infoEl);
    rowEl.appendChild(discountEl);
    rowEl.appendChild(priceEl);
    id("results").appendChild(rowEl);
  }

  function fetchAllDeals() {

  }

  function displayError() {
    let errorEl = gen("p");
    errorEl.textContent = "Error, couldn't load title.";
    errorEl.classList.add("red-text");
    id("results").appendChild(errorEl);
  }
  

  /** from Lecture 14 */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
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