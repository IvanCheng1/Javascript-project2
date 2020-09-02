let store = {
  apod: "",
  rovers: ["Curiosity", "Opportunity", "Spirit"],
  selected: "Curiosity",
  Curiosity: [],
  Opportunity: [],
  Spirit: [],
  showing: [25, 50, 100, 200],
  showingSelected: 25,
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  let { rovers, apod } = state;

  return `
        <header>
          <h1>Mars Dashboard</h1>
        </header>
        <main>
        
          <section>
          <h3>Rover selected ${store.selected}</h3>
            ${MarsPhotos(store.selected)}
               
          </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

const MarsPhotos = (rover) => {
  const photoArray = store[rover];
  if (photoArray.length === 0) {
    // alert("no photos, fetching")
    getMarsPhotos(store.selected);
    return ``;
  } else {
    // alert(`There are ${photoArray.length} number of photos`)

    return displayMarsPhotos();
  }
};

const displayMarsPhotos = () => {
  // const { selected, photos, showingSelected } = store;
  const photoArray = store[store.selected];
  let display = "";

    // display all
    // console.log(photoArray);
    photoArray.slice(0, store.showingSelected).forEach((p) => {
      display += `
        <div>
          <img src="${p.img_src}" height="350px" />
          <div class="photo-info">
            <div>
              Earth Date: ${p.earth_date}
              Earth Date: ${p.earth_date}
            </div>
          </div>
        </div>
      `;
    });
  

  return display;
};

// ------------------------------------------------------  API CALLS

const getMarsPhotos = (rover) => {
  fetch(`http://localhost:3000/photos`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rover: rover,
    }),
  })
    .then((res) => res.json())
    .then((data) => updateStore(store, { [rover]: data.photos }))
    .then(() => console.log(store))
};


