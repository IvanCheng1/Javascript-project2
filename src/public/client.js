let store = {
  apod: "",
  rovers: ["Curiosity", "Opportunity", "Spirit"],
  selected: "Curiosity",
  Curiosity: {},
  Opportunity: {},
  Spirit: {},
  sol: 100,
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
          ${roverInformation()}
          ${navbar()}
          ${galleryViewSettings()}
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

const handleClick = (r) => {
  // console.log(r.id)
  updateStore(store, { selected: r.id });
};

const navbar = () => {
  const { rovers } = store;
  let buttons = "";

  rovers.forEach(
    (r) =>
      (buttons += `
      <li>
        <button id=${r} onClick=handleClick(${r}) >${r}</button>
      </li>
    `)
  );

  return `
    <navbar>
      <ul>
        ${buttons}
      </ul>
    </navbar>
  `;
};

const handleSolChange = (value) => {
  console.log(value);
};

const handlePhotoNumberChange = (value) => {
  console.log(value);
};

const galleryViewSettings = () => {
  let numberOfPhotosToShow = "";
  store.showing.forEach(
    (number) =>
      (numberOfPhotosToShow += `
      <li>
        <button id=${number} onClick="handlePhotoNumberChange(${number})" >${number}</button>
      </li>
    `)
  );

  return `
    <ul>
      ${numberOfPhotosToShow}
    </ul>

    <label for="sol">Sol (between 1 and 1000):</label>
    <input type="number" id="sol" name="quantity" min="1" max="1000">
    <input type="submit" onclick="handleSolChange(document.getElementById('sol').value)" >
  `;
};

const roverInformation = () => {
  const rover = store[store.selected];

  if (rover.landingDate) {
    const name = store.selected;
    const landingDate = rover.landingDate;
    const launchDate = rover.launchDate;
    const status = rover.status;

    return `
      <h3>${name}</h3>
      <h3>Sol: ${store.sol}</h3>
      <h3>Landing Date: ${landingDate}</h3>
      <h3>Launch Date: ${launchDate}</h3>
      <h3>Status: ${status}</h3>
    `;
  }

  return ``;
};

const MarsPhotos = (rover) => {
  // console.log(store);
  const photoArray = store[rover].photos;
  if (!photoArray) {
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
  const photoArray = store[store.selected].photos;
  let display = "";

  // display all
  // console.log(photoArray);
  photoArray.slice(0, store.showingSelected).forEach((p) => {
    display += `
        <div>
          <img src="${p.img_src}" height="350px" />
       
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
      sol: store.sol,
    }),
  })
    .then((res) => res.json())
    .then((data) =>
      updateStore(store, {
        [rover]: {
          photos: data.photos,
          landingDate: data.photos[0].rover.landing_date,
          launchDate: data.photos[0].rover.launch_date,
          status: data.photos[0].rover.status,
        },
      })
    )

    .then(() => console.log(store));
};
