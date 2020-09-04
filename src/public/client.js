let store = {
  apod: "",
  rovers: ["Curiosity", "Opportunity", "Spirit"],
  selected: "Curiosity",
  Curiosity: {},
  Opportunity: {},
  Spirit: {},
  // sol: 100,
  // showing: [25, 50, 100, 200],
  // showingSelected: 25,
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
          <div class="option-box">
            ${navbar()}

          </div>
          <div class="gallery">
            ${MarsPhotos(store.selected)}
          </div>
          </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);

  store.rovers.forEach((r) => {
    getMarsPhotos(r);
  });
});

// ------------------------------------------------------  COMPONENTS

const handleClick = (r) => {
  updateStore(store, { selected: r.id });
};

const navbar = () => {
  const { rovers } = store;
  let buttons = "";

  rovers.forEach(
    (r) =>
      (buttons += `
      <li>
        <button id=${r} class="btn ${
        store.selected === r ? "active" : ""
      }" onClick=handleClick(${r}) >${r}</button>
      </li>
    `)
  );

  return `
    <navbar>
      <div class="option-label" >Rover selected</div>
      <ul>
        ${buttons}
      </ul>
    </navbar>
  `;
};

// const handleSolChange = (value) => {
//   updateStore(store, { sol: value });
//   getMarsPhotos(store.selected);
// };

// const handlePhotoNumberChange = (value) => {
//   updateStore(store, { showingSelected: value });
//   getMarsPhotos(store.selected);
// };

// const galleryViewSettings = () => {
//   let numberOfPhotosToShow = "";
//   store.showing.forEach(
//     (number) =>
//       (numberOfPhotosToShow += `
//       <li>
//         <button id=${number} class="small-btn ${store.showingSelected === number ? 'active' : ''}" onClick="handlePhotoNumberChange(${number})" >${number}</button>
//       </li>
//     `)
//   );

//   return `
//     <div class="photo-option">
//       <div class="option-label" >Photos shown</div>
//       <ul>
//         ${numberOfPhotosToShow}
//       </ul>
//     </div>

//     <div class="sol-option">
//       <div class="option-label">Sol (between 1 and 1000):</div>
//       <div class="sol-option-buttons">
//         <input type="number" id="sol" name="quantity" min="1" max="1000" value=${store.sol} >
//         <button class="inline-small-btn" onclick="handleSolChange(document.getElementById('sol').value)" >
//           Update
//         </button>
//       </div>
//     </div>
//   `;
// };

const roverInformation = () => {
  const rover = store[store.selected];

  if (rover) {
    const name = store.selected;

    return `
    <div class="info-box">
      <div class="info-box-max-width">
        <div class="rover">
          <div class="label">
            Rover
          </div>
          <div>
            ${name}
          </div>
        </div>

        <div class="status">
          <div class="label">
            Status
          </div>
          <div>
            ${rover.get("status")}
          </div>
        </div>

        <div class="launch">
          <div class="label">
            Launch Date
          </div>
          <div>
            ${rover.get("launchDate")}
          </div>
        </div>

        <div class="landing">
          <div class="label">
            Landing Date
          </div>
          <div>
            ${rover.get("landingDate")}
          </div>
        </div>
      </div>
      

    </div>
    `;
  }

  return ``;
};

const MarsPhotos = (rover) => {
  const photoArray = store[rover].get("photos");
  if (!photoArray) {
    return ``;
  } else {
    return displayMarsPhotos(photoArray);
  }
};

const displayMarsPhotos = (photoArray) => {
  let display = "";

  photoArray.slice(0, store.showingSelected).forEach((p) => {
    display += `
        <div class="image">
          <img src="${p.img_src}" height="350px" />
          <div class="img-date" >${p.earth_date}</div>
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
    .then((data) => {
      // console.log(data)
      updateStore(store, {
        [rover]: Immutable.Map({
          photos: data,
          landingDate: data[0].landing_date,
          launchDate: data[0].launch_date,
          status: data[0].status,
        }),
      });
    });
};
