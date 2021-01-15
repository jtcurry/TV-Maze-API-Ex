// REQUEST SHOW LIST BASED OFF OF USER INPUT FROM TVMAZE API
async function searchShows(query) {
  const response = await axios.get("http://api.tvmaze.com/search/shows", {
    params: {
      q: query,
    },
  });
  missingImgUrl = "https://tinyurl.com/tv-missing";
  let showArray = [];
  for (eachShow of response.data) {
    let showObject = {
      id: eachShow.show.id,
      name: eachShow.show.name,
      summary: eachShow.show.summary,
      image: eachShow.show.image ? eachShow.show.image.medium : missingImgUrl,
    };
    showArray.push(showObject);
  }
  return showArray;
}

//ADD A LIST OF SHOWS TO DOM
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show my-2" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src= ${show.image}>
             <p class="card-text">${show.summary}</p>
           </div>
           <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#episodeModal">Episodes</button>
         </div>
       </div>
      `
    );
    $showsList.append($item);
  }
}

//EVENT HANDLER FOR FORM SUBMISSION
$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();
  let query = $("#search-query").val();
  if (!query) return;
  $("#episodes-area").hide();
  let shows = await searchShows(query);
  populateShows(shows);
});

// EVENT HANDLER FOR EPISODE BUTTON CLICK
document
  .getElementById("shows-list")
  .addEventListener("click", async function (event) {
    if (event.target.tagName === "BUTTON") {
      let showId = event.target.parentElement.dataset.showId;
      let episodeArray = await getEpisodes(showId);
      populateEpisodes(episodeArray);
    }
  });

// REQUEST AN EPISODE LIST GIVEN A SHOW ID NUMBER
async function getEpisodes(id) {
  const response = await axios.get(
    `http://api.tvmaze.com/shows/${id}/episodes`
  );
  let episodeArray = [];
  for (let eachEpisode of response.data) {
    let episodeObject = {
      id: eachEpisode.id,
      name: eachEpisode.name,
      season: eachEpisode.season,
      number: eachEpisode.number,
    };
    episodeArray.push(episodeObject);
  }
  return episodeArray;
}

//ADDS AN ARRAY OF EPISODES TO THE DOM
function populateEpisodes(episodes) {
  const $episodeList = $("#episodes-list");
  $episodeList.empty();
  for (let episode of episodes) {
    let $item = $(
      `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`
    );
    $episodeList.append($item);
    $("#episodes-area").show();
  }
}
