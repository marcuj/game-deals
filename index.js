/*
 * Name: Marcus Jundt
 * Date: 4/24/2024
 * Section: CSE 154 AE
 *
 * This is the JS file which gives functionality for searching videogame deals. Makes requests to
 * Cheap Shark API to get info on games and the deals associated with them from different stores.
 * Uses what is typed in the search query or can show the 20 current best rated deals. Creates
 * HTML elements that show info for requested games.
 */

"use strict";
(function() {

  const CHEAP_SHARK_URL = "https://www.cheapshark.com/api/1.0/";
  const BEST_DEALS = "deals?sortBy=DealRating&storeID=1&pageSize=20&pageNumber=";
  const STORES = ["Steam", "GamersGate", "GreenManGaming", "Amazon", "GameStop", "Direct2Drive",
  "GOG", "Origin", "Get Games", "Shiny Loot", "Humble Store", "Desura", "IndieGameStand",
  "Fanatical", "Gamesrocket", "Games Republic", "SilaGames", "Playfield", "ImperialGames",
  "WinGameStore", "FunStockDigital", "GameBillet", "Voidu", "Epic Games Store", "Razer Game Store",
  "Gamesplanet", "Gamesload", "2Game", "IndieGala", "Blizzard Shop", "AllYouPlay", "DLGamer",
  "Noctre", "DreamGame"];

  window.addEventListener("load", init);

  /** 
   * Initializes the buttons for seeing the best deals, and for initiating search based on given
   * query in the search box.
   */
  function init() {
    let searchBtn = id("btn-search");
    searchBtn.addEventListener("click", (evt) => fetchGames(false, 0, evt)); 

    let seeAllBtn = id("btn-see-all");
    seeAllBtn.addEventListener("click", () => fetchGames(true, 0));
  }

  /**
   * Makes an API requrest to Cheap Shark API to get a list of games based on given query. The query
   * comes from the value entered in the search bar, or gets the 20 best steam deals (all is true).
   * Then requests more specific info for each game and displays important info of each game in its
   * own row HTML element placed in results container. Includes thumbnail, title,
   * percent of positive ratings, store which the deal exists, discount percentage, retail price,
   * and sale price.
   * @param {Boolean} all - true then function shows 20 best deals, false uses search query
   * @param {Number} page - the page number wanted for the request from Cheap Shark API
   * @param {Event} evt - the event object from click event (deafult null)
   */
  async function fetchGames(all, page, evt = null) {
    try {
      id("results").classList.remove("hidden");
      id("results").innerHTML = "";
      let gameList;
      let url = CHEAP_SHARK_URL;
      if (all) {
        url += BEST_DEALS + page;
      } else {
        let query = evt.target.parentNode.firstElementChild.value;
        url += "games?title=" + query;
      }
      let response = await fetch(url);
      await statusCheck(response);
      gameList = await response.json();
      for (let i = 0; i < gameList.length; i++) {
        let id;
        if (all) {
          id = gameList[i].dealID;
        } else {
          id = gameList[i].cheapestDealID;
        }
        let gameJson = await fetchGameInfo(id);
        addResultRow(gameJson);
      }
    } catch (err) {
      displayError();
    }
  }

  /**
   * Makes an API requrest to Cheap Shark API to get the game info of the game associated with the
   * given deal ID.
   * @param {String} dealID - Cheap Shark API deal ID
   * @return {Object} - JSON object giving important info for the game associated with given deal ID
   */
  async function fetchGameInfo(dealID) {
    // try {
    let response = await fetch(CHEAP_SHARK_URL + "deals?id=" + dealID);
    await statusCheck(response);
    let gameJson = await response.json();
    return gameJson;
    // } catch (err) {
    //   displayError();
    // }
  }

  /**
   * Creates an HTML element that contains all the details about the given game and adds
   * it to the results container. Includes thumbnal, title, percent of positive ratings,
   * store which the deal exists, discount percentage, retail price, and sale price.
   * @param {Object} gameInfo - JSON object of game info from Cheap Shark API
   */
  function addResultRow(gameJson) {
    let gameInfo = gameJson.gameInfo;

    let rowEl = gen("article");
    rowEl.classList.add("row");
    let imgEl = createImgEl(gameInfo);
    let infoEl = createInfoEl(gameInfo);
    let discountEl = createDiscountEl(gameInfo);
    let priceEl = createPriceEl(gameInfo);

    rowEl.appendChild(imgEl);
    rowEl.appendChild(infoEl);
    rowEl.appendChild(discountEl);
    rowEl.appendChild(priceEl);
    id("results").appendChild(rowEl);
  }

  /**
   * Creates an HTML element shows thumbnail for the given game
   * @param {Object} gameInfo - JSON object of game info from Cheap Shark API
   * @return {Element} - image element that shows the thumbnail of the given game
   */
  function createImgEl(gameInfo) {
    let imgEl = gen("img");
    imgEl.src = gameInfo.thumb;
    imgEl.alt = gameInfo.name;
    return imgEl;
  }

  /**
   * Creates an HTML element shows info for the given game,
   * includes title, percentage of positive ratings on steam, and what store the best deal is from.
   * @param {Object} gameInfo - JSON object of game info from Cheap Shark API
   * @return {Element} - info element that shows title, percent of positive ratingm, and store
   */
  function createInfoEl(gameInfo) {
    let ratingEl = createRatingEl(gameInfo);
    let infoEl = gen("div");
    infoEl.classList.add("info");
    let titleEl = gen("h2");
    titleEl.textContent = gameInfo.name;
    let storeEl = gen("div");
    storeEl.classList.add("store-info");
    let greyText = gen("p");
    greyText.classList.add("grey-text");
    greyText.textContent = "Best deal on ";
    let storeName = gen("p");
    storeName.textContent = STORES[Number(gameInfo.storeID) - 1];

    storeEl.appendChild(greyText);
    storeEl.appendChild(storeName);
    infoEl.appendChild(titleEl);
    infoEl.appendChild(ratingEl);
    infoEl.appendChild(storeEl);
    return infoEl;
  }

  /**
   * Creates an HTML element shows percent of positive steam ratings for the given game,
   * colored green if above 75%, yellow if above 55% and below 75%, red if below 55%.
   * @param {Object} gameInfo - JSON object of game info from Cheap Shark API
   * @return {Element} - rating element that shows the percent of positive steam ratings
   */
  function createRatingEl(gameInfo) {
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
    return ratingEl;
  }

  /**
   * Creates an HTML element shows percent discounted from the best deal from given game
   * @param {Object} gameInfo - JSON object of game info from Cheap Shark API
   * @return {Element} - discount element that percent off from the best deal
   */
  function createDiscountEl(gameInfo) {
    let retailPrice = Number(gameInfo.retailPrice);
    let salePrice = Number(gameInfo.salePrice);
    let discountEl = gen("p");
    let percent = 100 - Math.round((salePrice / retailPrice) * 100);
    discountEl.textContent = "- " + percent + "%";
    discountEl.classList.add("discount-text");
    return discountEl;
  }

  /**
   * Creates an HTML element shows retail price crossed out and sale price in green from given game
   * @param {Object} gameInfo - JSON object of game info from Cheap Shark API
   * @return {Element} - price element that shows retail price and sale price
   */
  function createPriceEl(gameInfo) {
    let retailPrice = Number(gameInfo.retailPrice);
    let salePrice = Number(gameInfo.salePrice);
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
    return priceEl;
  }

  /** Displays red text error message (called when an error is caught) */
  function displayError() {
    let errorEl = gen("p");
    errorEl.textContent = "Error, couldn't load title.";
    errorEl.classList.add("error");
    id("results").appendChild(errorEl);
  }
  
  /** 
   * Checks if the given API reponse's status is OK.
   * Throws error if not OK and doesn't return the response - took from Lecture 14 slides 
   * @param {Promise} response - API response (if response is ok)
   */
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

})();