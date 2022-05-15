import { next, parse } from "./src/engine.js";

const renderAppContainer = () => {
  const appEl = document.createElement("div");
  appEl.id = "app";
  return appEl;
};

(function (window, document) {
  // Render app container
  document.body.appendChild(renderAppContainer());

  // Fetch Lexicon data
  window
    .fetch("./src/lexicon.json")
    .then((res) => res.json())
    .then((lexiconData) => {
      console.info("LEXICON DATA AVAILABLE");

      // Init Automaton
      initAutomaton(lexiconData, document);
    })
    .catch((err) => console.log(err));
})(window, document);

const initAutomaton = (lexiconData, document) => {
  const scale = 4;
  const worldWidth = 480;
  const worldHeight = 240;
  const data = [...lexiconData];
  const intervalPeriod = 100;
  let intervalId;

  const canvas = document.querySelector("canvas");
  const app = document.getElementById("app");

  canvas.width = worldWidth * scale;
  canvas.height = worldHeight * scale;
  const ctx = canvas.getContext("2d");

  const render = (world) => {
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, worldWidth * scale, worldHeight * scale);
    ctx.fillStyle = "green";
    world.forEach((row, y) =>
      row.forEach(
        (alive, x) =>
          alive && ctx.fillRect(x * scale, y * scale, scale - 1, scale - 1)
      )
    );
  };

  const renderDropdown = () => {
    const dropDownEl = document.createElement("select");
    dropDownEl.id = "dropdown";
    dropDownEl.add(new Option("Please select", ""));
    data.forEach((d) => dropDownEl.add(new Option(d.name, d.pattern)));
    dropDownEl.addEventListener("change", selectPattern);
    return dropDownEl;
  };

  const renderDescription = () => {
    const paragraphEl = document.createElement("p");
    paragraphEl.id = "description";
    return paragraphEl;
  };

  const renderStartButton = () => {
    const buttonEl = document.createElement("button");
    buttonEl.id = "startBtn";
    buttonEl.disabled = document.getElementById("dropdown").value
      ? false
      : true;
    buttonEl.innerHTML = "<span>START</span>";
    buttonEl.addEventListener("click", handleClick);
    return buttonEl;
  };

  const selectPattern = (e) => {
    const {
      target: { value },
    } = e;
    const btn = document.getElementById("startBtn");
    const selectedPattern = document.getElementById("dropdown").value;

    if (!selectedPattern) {
      btn.setAttribute("disabled", true);
    } else {
      btn.removeAttribute("disabled");
    }

    const selectedDescription = data.find(
      ({ pattern }) => pattern === value
    )?.description;

    // Set Description
    const paragraph = document.getElementById("description");
    paragraph.innerHTML = selectedDescription || "";

    // Clear World
    const clearWorld = Array(worldHeight).fill(Array(worldWidth).fill(false));
    render(next(clearWorld));

    // Clear Interval
    clearInterval(intervalId);
  };

  const augmentPattern = (pattern) => {
    let augmentedPattern = [];

    const emptyRowNumber = worldHeight - pattern.length;
    const emptyColumnNumber = worldWidth - pattern[0].length;

    const emptyLeftColumns = Array(Math.round(emptyColumnNumber / 2)).fill(
      false
    );
    const emptyRightColumns = Array(
      emptyColumnNumber - emptyLeftColumns.length
    ).fill(false);

    augmentedPattern = pattern.map((row) => {
      return [...emptyLeftColumns, ...row, ...emptyRightColumns];
    });
    const emptyTopRows = Array(Math.round(emptyRowNumber / 2)).fill(
      Array(worldWidth).fill(false)
    );

    const emptyBottomRows = Array(emptyRowNumber - emptyTopRows.length).fill(
      Array(worldWidth).fill(false)
    );

    augmentedPattern = [
      ...emptyTopRows,
      ...augmentedPattern,
      ...emptyBottomRows,
    ];

    return augmentedPattern;
  };

  const handleClick = () => {
    const selectedPattern = document.getElementById("dropdown").value;
    let agumentedWorld = augmentPattern(parse(selectedPattern));
    intervalId = setInterval(() => {
      agumentedWorld = next(agumentedWorld);
      render(agumentedWorld);
    }, intervalPeriod);
  };

  // code below demonstrates how to advance the world to the next state and render it
  // correct logic that reads initial state from lexicon and calculates the next state given current state needs to be implemented
  const exampleWorld = Array(worldHeight).fill(Array(worldWidth).fill(true));
  app.appendChild(renderDropdown());
  app.appendChild(renderDescription());
  app.appendChild(renderStartButton());
  render(exampleWorld);
};
