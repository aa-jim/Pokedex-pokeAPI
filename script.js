const typeColors = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

// The latest Pokémon currently available through PokeAPI.
const LAST_POKEMON_ID = 1025;
let currentPokemonId = null;

const tabPanels = [
  { id: "pokeStats", label: "BASE STATS" },
  { id: "pokeAbilities", label: "ABILITIES" },
  { id: "pokeMoves", label: "MOVES" }
];
let activeTabIndex = 0;

// Register controls after the page is ready.
document.addEventListener("DOMContentLoaded", () => {
  const quickBtns = document.querySelectorAll(".quick-btn");
  quickBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("searchInput").value = btn.value.toLowerCase();
      fetchData();
    });
  });

  document.getElementById("previous-pokemon").addEventListener("click", () => {
    if (currentPokemonId > 1) {
      fetchData(currentPokemonId - 1);
    }
  });

  document.getElementById("next-pokemon").addEventListener("click", () => {
    if (currentPokemonId < LAST_POKEMON_ID) {
      fetchData(currentPokemonId + 1);
    }
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    toggleTab(-1);
  });
  
  document.getElementById("next-btn").addEventListener("click", () => {
    toggleTab(1);
  });

  document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  });

  fetchData();
});

// Cycle through the stats, abilities, and moves panels.
function toggleTab(direction = 1) {
  const tabLabel = document.querySelector(".tab-label");

  activeTabIndex =
    (activeTabIndex + direction + tabPanels.length) % tabPanels.length;

  tabPanels.forEach((tab, index) => {
    const panel = document.getElementById(tab.id);
    panel.classList.toggle("hidden", index !== activeTabIndex);
  });

  tabLabel.textContent = tabPanels[activeTabIndex].label;
}

// Keep navigation buttons in sync with the current Pokémon ID.
function updateNavigationButtons() {
  const previousButton = document.getElementById("previous-pokemon");
  const nextButton = document.getElementById("next-pokemon");

  if (!previousButton || !nextButton) return;

  previousButton.disabled = currentPokemonId === null || currentPokemonId <= 1;
  nextButton.disabled = currentPokemonId === null || currentPokemonId >= LAST_POKEMON_ID;
}

async function fetchData(pokemonId = null) {

  // PokeAPI uses hyphens in multi-word names.
  const searchInput = document.getElementById("searchInput");
  const rawInput = searchInput.value.trim().toLowerCase();
  const pokemonName = rawInput.replace(/\s+/g, "-");
  const identifier = pokemonId ?? pokemonName;
  const requestLabel = pokemonId === null ? pokemonName : `#${pokemonId}`;
  const loadingState = document.getElementById("loadingState");
  const pokeImg = document.getElementById("pokeimg");
  const errorState = document.getElementById("errorState");
  const errorText = errorState.querySelector(".error-text");

  document.getElementById("previous-pokemon").disabled = true;
  document.getElementById("next-pokemon").disabled = true;

  // Hide stale card data while the next request runs.
  loadingState.classList.remove("hidden");
  pokeImg.alt = "";
  pokeImg.onload = null;
  pokeImg.setAttribute("aria-hidden", "true");
  pokeImg.classList.add("hidden");
  errorState.classList.add("hidden");

  // Reset the card when a new request or error occurs.
  function clearPokemonData() {
    const image = document.getElementById("pokeimg");

    image.removeAttribute("src");
    image.alt = "";
    image.onload = null;
    image.setAttribute("aria-hidden", "true");
    image.classList.add("hidden");

    document.getElementById("pokeId").textContent = "---";
    document.getElementById("pokeName").textContent = "---";
    document.getElementById("pokeHeight").textContent = "--";
    document.getElementById("pokeWeight").textContent = "--";
    document.getElementById("pokeType").innerHTML = "";
    document.getElementById("pokeStats").innerHTML = "";
    document.getElementById("pokeAbilities").innerHTML = "";
    document.getElementById("movesCount").textContent = "";
    document.getElementById("pokeMovesList").innerHTML = "";
  }

  if (pokemonId === null && !pokemonName) {
    clearPokemonData();
    loadingState.classList.add("hidden");
    errorText.textContent = "Enter a Pokémon name, such as Pikachu or Aipom.";
    errorState.classList.remove("hidden");
    updateNavigationButtons();
    return;
  }

  // Fetch the selected Pokémon and handle API failures.
  let response;
  try {
    response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(identifier)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          `We couldn't find "${requestLabel}". Check the spelling and try again.`
        );
      }

      throw new Error(
        `PokéAPI returned an error (${response.status}). Please try again later.`
      );
    }

    const data = await response.json();

    currentPokemonId = data.id;
    if (pokemonId !== null) {
      searchInput.value = data.name;
    }
    updateNavigationButtons();

    playPokedexAudio(data);

    // Shape nested API data into the values used by the card.
    const pokeData = {
      name: data.name,
      id: `${data.id.toString().padStart(3, '0')}`,
      image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      type: data.types.map(t => t.type.name),
      height: (data.height / 10).toFixed(1),
      weight: (data.weight / 10).toFixed(1),
      stats: data.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
      abilities: data.abilities.map(a => a.ability.name),
      moves: [...new Set(data.moves.map(move => move.move.name))].sort()
    };

    pokeImg.alt = "";
    pokeImg.onload = () => {
      pokeImg.alt = `Official artwork of ${pokeData.name}`;
      pokeImg.removeAttribute("aria-hidden");
    };
    pokeImg.src = pokeData.image;
    pokeImg.style.display = "block";

    const primaryType = pokeData.type[0];
    const accentColor = typeColors[primaryType] || "#7038F8";
    document.documentElement.style.setProperty("--type-accent-color", accentColor);

    document.getElementById("pokeName").textContent = pokeData.name.toUpperCase();
    document.getElementById("pokeId").textContent = pokeData.id;
    document.getElementById("pokeHeight").textContent = `${pokeData.height}m`;
    document.getElementById("pokeWeight").textContent = `${pokeData.weight}kg`;

    // Render types, stats, abilities, and moves dynamically.
    const typeContainer = document.getElementById("pokeType");
    typeContainer.innerHTML = pokeData.type
      .map(t => `<span class="type-pill ${t}">${t.toUpperCase()}</span>`)
      .join("");

    const statsContainer = document.getElementById("pokeStats");
    statsContainer.textContent = "";

    const statNameMap = {
      'hp': 'HP',
      'attack': 'ATTACK',
      'defense': 'DEFENSE',
      'special-attack': 'SP. ATT',
      'special-defense': 'SP. DEF',
      'speed': 'SPEED'
    };

    pokeData.stats.forEach(stat => {
      const row = document.createElement("div");
      row.className = "stat-row";

      const displayName = statNameMap[stat.name] || stat.name.toUpperCase();
      const fillPercentage = Math.min((stat.value / 255) * 100, 100);

      row.innerHTML = `
        <div class="stat-name">${displayName}</div>
        <div class="stat-bar-track">
          <div class="stat-bar-fill" style="width: 0%"></div>
        </div>
        <div class="stat-val">${stat.value}</div>
      `;
      statsContainer.appendChild(row);

      setTimeout(() => {
        row.querySelector(".stat-bar-fill").style.width = `${fillPercentage}%`;
      }, 50);
    });

    const abilitiesContainer = document.getElementById("pokeAbilities");
    abilitiesContainer.textContent = "";

    pokeData.abilities.forEach(ability => {
      const card = document.createElement("div");
      card.className = "ability-card";
      card.textContent = ability.toUpperCase();
      abilitiesContainer.appendChild(card);
    });

    const movesCount = document.getElementById("movesCount");
    const movesContainer = document.getElementById("pokeMovesList");
    movesCount.textContent = `${pokeData.moves.length} MOVES`;
    movesContainer.textContent = "";

    pokeData.moves.forEach(move => {
      const card = document.createElement("div");
      card.className = "move-card";
      card.textContent = move.toUpperCase();
      movesContainer.appendChild(card);
    });

    pokeImg.classList.remove("hidden");
    loadingState.classList.add("hidden");

  // Show a message for failed requests.
  } catch (error) {
    clearPokemonData();
    loadingState.classList.add("hidden");

    let message = error.message || "Something went wrong. Please try again.";

    if (!response && error.name === "TypeError") {
      message =
        "We couldn't connect to PokéAPI. Check your internet connection and try again.";
    } else if (error instanceof SyntaxError) {
      message = "PokéAPI returned an unreadable response. Please try again later.";
    }

    errorText.textContent = message;
    errorState.classList.remove("hidden");
  } finally {
    loadingState.classList.add("hidden");
    updateNavigationButtons();
  }
}