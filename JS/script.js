let navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(function (navLink) {
  navLink.addEventListener("click", function () {
    navLinks.forEach(function (navLink) {
      navLink.classList.remove("active");
    });
    this.classList.add("active");
    let link = this.innerText.toLowerCase();
    let games = new Games();
    games.getGames(link);
  });
});

class Games {
  async getGames(category) {
    let loading = document.getElementById("loading");
    loading.classList.remove("d-none");

    const url = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "872e161411msh071d74e28119b46p140d41jsn32df310bae7e",
        "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
      },
    };
    const gameResponse = await fetch(url, options);
    let data = await gameResponse.json();
    loading.classList.add("d-none");

    let displayContent = new Display(data);
    displayContent.display(data);

    let cards = document.querySelectorAll(".card");
    cards.forEach(function (card, index) {
      card.addEventListener("click", function () {
        let id = data[index].id;
        let games = new Games();
        games.getDetails(id);
      });
    });
  }

  async getDetails(idGame) {
    let loading = document.getElementById("loading");
    loading.classList.remove("d-none");

    const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${idGame}`;

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "872e161411msh071d74e28119b46p140d41jsn32df310bae7e",
        "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
      },
    };
    const detailsResponse = await fetch(url, options);
    const cardData = await detailsResponse.json();
    loading.classList.add("d-none");

    let displayContent = new Display(cardData);
    displayContent.displayDetails(cardData);

    let btnClose = document.getElementById("btnClose");
    btnClose.addEventListener("click", function () {
      document.getElementById("details").classList.add("d-none");
      document.getElementById("games").classList.remove("d-none");
    });
  }
}

class Display {
  display(data) {
    let content = "";
    for (let i = 0; i < data.length; i++) {
      content += `
      <div class="col-lg-3">
        <div class="card rounded-3 h-100 bg-transparent">
          <div
            class="card-body px-3"
          >
            <div class="box-image">
              <img class="w-100" src="${data[i].thumbnail}" alt="" />
            </div>
            <div class="title d-flex align-items-center justify-content-between mt-3">
              <h5 class="text-white m-0">${data[i].title}</h5>
              <span class="btn btn-info text-white">Free</span>
            </div>
            <h6 class="text-center text-white opacity-50 my-3">
              ${data[i].short_description.split(" ", 8)}
            </h6>
          </div>
          <div class="card-footer p-3">
            <div class="d-flex align-items-center justify-content-between">
              <p class="text-white text-uppercase bg-black px-2 rounded-2 m-0">
                ${data[i].genre}
              </p>
              <p class="text-white text-uppercase bg-black px-2 rounded-2 m-0">
                ${data[i].platform}
              </p>
            </div>
          </div>
        </div>
      </div>
  `;
    }
    document.getElementById("row").innerHTML = content;
  }

  displayDetails(game) {
    document.getElementById("details").classList.remove("d-none");
    document.getElementById("games").classList.add("d-none");
    let content = `
    <div class="col-md-4">
      <img class="w-100" src="${game.thumbnail}" alt="" />
    </div>
    <div class="col-md-8">
      <h3 class="text-capitalize">Title : ${game.title}</h3>
      <p>
        Category:
        <span
          class="text-uppercase bg-info text-black px-2 d-inline-block rounded"
          >${game.genre}</span
        >
      </p>
      <p>
        Platform:
        <span
          class="text-capitalize bg-info text-black px-2 d-inline-block rounded"
          >${game.platform}</span
        >
      </p>
      <p>
        Status:
        <span
          class="text-capitalize bg-info text-black px-2 d-inline-block rounded"
          >${game.status}</span
        >
      </p>
      <p class="description">
        ${game.description}
      </p>
      <a
        class="btn btn-outline-warning text-white"
        target="_blank"
        id="gameURL"
        href="${game.game_url}"
        >Show Game</a
      >
    </div>
    `;
    document.getElementById("detailsContent").innerHTML = content;
  }
}

let games = new Games();
games.getGames("mmorpg");
