const publicKey = "fd7b32433d5ee40df14b897fc195f81e";
const PRIVATE_KEY = "fff2e4c01da9ecd57b8c99ae3c2d6eaa35a89119";
let timestamp = "1709532638491";
let hashValue = "95a5cfd2115d02ec88b943d6aa70b0de";

const input = document.getElementById("input");
const searchBtn = document.getElementById("btn");
const name = document.getElementById("name");
const searchResult = document.querySelector(".search-result");
const card = document.querySelector(".card");
const favList = document.querySelector(".favList");
const body = document.querySelector("body");
const favHeroPage = document.querySelector(".favHeroPage");
const closeBtn = document.querySelector(".closeBtn");

// Favourite hero page will be open through this toggle.
favHeroPage.addEventListener("click", () => {
  body.classList.toggle("showCard");
});
// Favourite hero page will be closed through this toggle.
closeBtn.addEventListener("click", () => {
  body.classList.toggle("showCard");
});

// Cahracter will be searched here by there name and this name will be passed in the getCharacter Function
searchBtn.addEventListener("click", function () {
  let charName = input.value;
  input.value = "";
  if (charName != "") {
    getCharacter(charName);
  } else {
    alert("Kindly enter the Character name first");
  }
});

// <-- API call
const getCharacter = async (movie) => {
  searchResult.innerHTML = "<h1>Fetching data...</h1>";
  const response = await fetch(
    `https://gateway.marvel.com:443/v1/public/characters?ts=1709532638491&apikey=fd7b32433d5ee40df14b897fc195f81e&hash=95a5cfd2115d02ec88b943d6aa70b0de&nameStartsWith=${movie}`
  );
  const data = await response.json();
  searchResult.innerHTML = ""; // main container is getting empty to load the next character.otherwise will be load below one another.
  const result = data.data.results;
  if (result == "") {
    searchResult.innerHTML =
      "<h2>Your searched Hero is not present in this MARVEL API...</h2>";
  }
  console.log(data);
  showResult(result);
};
// API CALL ends here and the result is passed in following showResult Function  -->

const showResult = (data) => {
  // maping over each array to get all result which is present in array.
  data.map((e) => {
    console.log(e);
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
    <img src="${e.thumbnail.path}.${e.thumbnail.extension}"  alt="image" />
  <div class="description">
    <h3>Name:${e.name}</h3>
    <h5>Comics:${e.comics.available}</h5>
    <h5>Series:${e.series.available}</h5>
    <h4>Description:${
      e.description || "Description not provided by API..."
    }</h4>
    <button id="addToFavBtn" onclick="addToFav('${e.id}','${e.name}','${
      e.thumbnail.path
    }.${e.thumbnail.extension}','${e.comics.available}','${
      e.series.available
    }','${e.description}')">Add to Fav.</button>
  </div>
      `;
    searchResult.appendChild(card);
  });
};

// Add to favourite list function which will be activate when clicked on Add to Fav button.
function addToFav(id, name, img, comics, series) {
  let basket = JSON.parse(localStorage.getItem("favhero")) || [];

  // Check if the hero is already present in the favorites list
  const existingHero = basket.find((hero) => hero.id === id);
  if (existingHero) {
    alert(`Hero with ID:${id} is already in the favourite list`);
    return; // Exit the function if the hero is already in the list
  }

  basket.push({
    id: id,
    name: name,
    img: img,
    comics: comics,
    series: series,
  });
  console.log(id);

  localStorage.setItem("favhero", JSON.stringify(basket));
  alert(`Your hero with ID:${id} is added into the favourite list`);
  displayCartItems();
}

// Remove from favourite list function
const removeFromFavList = (id) => {
  let basket = JSON.parse(localStorage.getItem("favhero"));
  basket = basket.filter((x) => x.id != id);
  localStorage.setItem("favhero", JSON.stringify(basket));
  displayCartItems();
  alert(`Hero with ID:${id} is removed from the favourite list`);
};

function displayCartItems() {
  let basket = JSON.parse(localStorage.getItem("favhero")) || [];

  favList.innerHTML = basket
    .map(
      (f) => `
      <div class="favCard">
        <div class="left">
          <img src="${f.img}" alt="image" />
        </div>
        <div class="right">
          <div class="name-heading">
            <h3>${f.name}</h3>
            <p>Series:${f.series}</p>
            <p>Comics:${f.comics}</p>
          </div>
        </div>
        <div>
          <button id="removeFromFavList" onclick="removeFromFavList(${f.id})">
            Remove
          </button>
        </div>
      </div>
      `
    )
    .join(""); // Joining HTML strings with an empty string
}
// for initial call(when 1st page will load or refresh then whatever present in basket will be displayed on favourite list)
displayCartItems();
