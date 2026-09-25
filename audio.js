let currentCry = null;
let isMuted = false;

// Close to correct pronounciation
const phoneticDictionary = {
  "abomasnow": "uh-bom-uh-snow",
  "aegislash": "ee-jih-slash",
  "alomomola": "uh-low-muh-mo-luh",
  "amoonguss": "uh-moon-gus",
  "arboliva": "ar-bo-lee-vuh",
  "arceus": "ar-see-us",
  "archeops": "ar-kee-ops",
  "articuno": "ar-tih-coo-no",
  "audino": "aw-dee-no",
  "bagon": "bay-gon",
  "bastiodon": "bas-tee-oh-don",
  "blacephalon": "blah-sef-uh-lon",
  "blaziken": "blay-zih-ken",
  "buizel": "bwee-zul",
  "carvanha": "car-vahn-uh",
  "castform": "cast-form",
  "celesteela": "sel-es-tee-luh",
  "chandelure": "shan-duh-loor",
  "chesnaught": "ches-nawt",
  "chi-yu": "chee-yoo",
  "chien-pao": "chee-en-pow",
  "chikorita": "chick-oh-ree-tuh",
  "chimecho": "chime-echo",
  "clefairy": "cluh-fairy",
  "cobalion": "co-bal-ee-on",
  "cofagrigus": "co-fuh-gree-gus",
  "cyndaquil": "sin-duh-quill",
  "dachsbun": "docks-bun",
  "darkrai": "daar-cry",
  "decidueye": "deh-sij-oo-eye",
  "dedenne": "deh-den-nay",
  "deoxys": "dee-ox-is",
  "dhelmise": "del-mize",
  "dialga": "dee-al-guh",
  "diancie": "dee-an-see",
  "doduo": "doh-doo-oh",
  "empoleon": "em-poh-lee-on",
  "eternatus": "ee-ter-nuh-tus",
  "exeggcute": "eggs-egg-cute",
  "exeggutor": "eggs-egg-you-tor",
  "farfetch'd": "far-fetched",
  "flabébé": "flah-bay-bay",
  "gallade": "guh-laid",
  "gardevoir": "gar-duh-vwar",
  "garganacl": "gar-gan-uh-cul",
  "geodude": "jee-oh-dude",
  "gholdengo": "ghoul-den-go",
  "girafarig": "jeh-raff-uh-rig",
  "giratina": "geer-uh-tee-nuh",
  "golisopod": "go-liss-oh-pod",
  "greninja": "greh-nin-juh",
  "groudon": "grow-don",
  "grotle": "growtle",
  "gyarados": "gare-uh-dos",
  "hawlucha": "haw-loo-chuh",
  "ho-oh": "ho-oh",
  "hydreigon": "hy-dry-gon",
  "incineroar": "in-sin-er-or",
  "jirachi": "jih-rah-chee",
  "kangaskhan": "kang-gus-con",
  "kecleon": "kek-lee-on",
  "keldeo": "kel-dee-oh",
  "kommo-o": "ko-mo-oh",
  "koraidon": "ko-rye-don",
  "kyogre": "ky-oh-ger",
  "kyurem": "kyoo-rem",
  "landorus": "lan-dor-us",
  "latias": "lah-tee-as",
  "latios": "lah-teeos",
  "linoone": "lih-noon",
  "lucario": "loo-car-e-oh",
  "lugia": "loo-gee-uh",
  "lunala": "loo-nah-luh",
  "lurantis": "loo-ran-tis",
  "magearna": "muh-geer-nuh",
  "mareanie": "muh-ree-nee",
  "mawile": "maw-wile",
  "meloetta": "mel-oh-et-uh",
  "meowscarada": "mee-ow-scar-ah-duh",
  "meowth": "mee-owth",
  "metagross": "met-uh-gross",
  "mienshao": "meen-show",
  "mimikyu": "mim-ee-kyoo",
  "minccino": "min-chee-no",
  "miraidon": "my-rye-don",
  "necrozma": "neh-kroz-muh",
  "nihilego": "ny-hih-lee-go",
  "obstagoon": "ob-stuh-goon",
  "oshawott": "osh-uh-wot",
  "pachirisu": "pah-chee-ree-soo",
  "palkia": "pal-kee-uh",
  "pecharunt": "pech-uh-runt",
  "pidgeot": "pid-jee-ot",
  "pikachu": "pee-ka-chu",
  "pinsir": "pin-sir",
  "polteageist": "pol-tee-geist",
  "primarina": "pree-muh-ree-nuh",
  "pyukumuku": "pyoo-koo-moo-koo",
  "quaquaval": "kwak-wuh-val",
  "raikou": "rye-koo",
  "ralts": "rawlts",
  "rayquaza": "rayqwayzah",
  "regice": "rej-ee-ice",
  "regirock": "rej-ee-rock",
  "registeel": "rej-ee-steel",
  "relicanth": "rel-ih-canth",
  "reshiram": "resh-ih-ram",
  "reuniclus": "ree-yoo-nih-clus",
  "roserade": "ro-zuh-raid",
  "salamence": "sal-uh-mence",
  "sceptile": "sep-tile",
  "scyther": "scyther",
  "sirfetch'd": "sir-fetched",
  "skeledirge": "skel-eh-durj",
  "snivy": "sny-vee",
  "solgaleo": "sol-guh-lay-oh",
  "stakataka": "stah-kah-tah-kah",
  "suicune": "swee-coon",
  "sylveon": "sil-vee-on",
  "terrakion": "ter-rak-ee-on",
  "thundurus": "thun-dur-us",
  "ting-lu": "ting-loo",
  "togekiss": "toh-guh-kiss",
  "tornadus": "tor-nay-dus",
  "totodile": "toh-toh-dyle",
  "toucannon": "too-can-on",
  "tropius": "tro-pee-us",
  "tsareena": "tsuh-ree-nuh",
  "tyrantrum": "tie-ran-trum",
  "vibrava": "vy-brah-vuh",
  "victini": "vik-tee-nee",
  "vikavolt": "vik-uh-volt",
  "virizion": "vih-riz-ee-on",
  "vivillon": "viv-ee-on",
  "volcarona": "vol-cuh-ro-nuh",
  "weavile": "wee-vile",
  "wo-chien": "wo-chee-en",
  "xerneas": "zur-nee-us",
  "xurkitree": "zur-kih-tree",
  "yveltal": "ee-vell-tall",
  "zacian": "zah-shee-un",
  "zamazenta": "zah-muh-zen-tuh",
  "zapdos": "zap-dos",
  "zekrom": "zek-rom",
  "zeraora": "zair-uh-or-uh",
  "zoroark": "zor-oh-ark",
  "zygarde": "zy-gard"
};

window.speechSynthesis.getVoices();

function setAudioMute(muted) {
  isMuted = muted;
  const audioToggle = document.getElementById("audioToggle");

  if (audioToggle) {
    const audioOnIcon = audioToggle.querySelector(".audio-icon-on");
    const audioOffIcon = audioToggle.querySelector(".audio-icon-off");

    if (audioOnIcon && audioOffIcon) {
      audioOnIcon.classList.toggle("hidden", isMuted);
      audioOffIcon.classList.toggle("hidden", !isMuted);
    }

    audioToggle.setAttribute("aria-pressed", String(isMuted));
    audioToggle.setAttribute("aria-label", isMuted ? "Unmute audio" : "Mute audio");
    audioToggle.title = isMuted ? "Unmute audio" : "Mute audio";
  }

  if (isMuted) {
    if (currentCry) {
      currentCry.pause();
      currentCry.currentTime = 0;
    }

    window.speechSynthesis.cancel();
  }
}

function toggleAudioMute() {
  setAudioMute(!isMuted);
}

document.addEventListener("DOMContentLoaded", () => {
  const audioToggle = document.getElementById("audioToggle");

  if (audioToggle) {
    audioToggle.addEventListener("click", toggleAudioMute);
  }
});

async function playPokedexAudio(pokemonData) {
  if (isMuted) return;

  if (currentCry) {
    currentCry.pause();
    currentCry.currentTime = 0;
  }
  window.speechSynthesis.cancel();

  try {
    const speciesResponse = await fetch(pokemonData.species.url);
    const speciesData = await speciesResponse.json();
    const englishName = speciesData.names.find(
      (entry) => entry.language.name === "en"
    )?.name;
    const nameToSpeak = englishName || pokemonData.name;

    if (isMuted) return;

    const englishEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );

    let textToSpeak = "";
    if (englishEntry) {
      textToSpeak = englishEntry.flavor_text.replace(/[\n\f\r]/g, " ");
    }

    const cryUrl = pokemonData.cries?.latest || pokemonData.cries?.legacy;
    
    if (cryUrl) {
      currentCry = new Audio(cryUrl);
      currentCry.volume = 0.3; 
      
      currentCry.onended = () => {
        if (textToSpeak) speakDescription(nameToSpeak, textToSpeak);
      };
      
      await currentCry.play();
    } else if (textToSpeak) {
      speakDescription(nameToSpeak, textToSpeak);
    }
  } catch (error) {
    console.error("Audio feature failed:", error);
  }
}

function speakDescription(apiName, text) {
  const synth = window.speechSynthesis;

  let baseName = apiName;
  const normalizedApiName = apiName.toLowerCase();
  const trueHyphenNames = ["ho-oh", "porygon-z", "jangmo-o", "hakamo-o", "kommo-o", "wo-chien", "chien-pao", "ting-lu", "chi-yu"];
  
  if (!trueHyphenNames.includes(normalizedApiName) && apiName.includes("-")) {
    baseName = apiName.split("-")[0];
  } else if (normalizedApiName === "type-null") {
    baseName = "Type: Null";
  }

  // 2. Fetch the phonetic spelling (if one exists)
  const lowerName = baseName.toLowerCase().replace(/\s+/g, "-");
  const spokenName = phoneticDictionary[lowerName] || baseName;

  // 3. Find the baseName in the text and swap it with the spokenName
  const nameRegex = new RegExp(`\\b${baseName}\\b`, 'gi');
  const spokenText = text.replace(nameRegex, spokenName);

  // 4. Speak it!
  const finalUtterance = `${spokenName}, ... ${spokenText}`;
  const utterance = new SpeechSynthesisUtterance(finalUtterance);
  
  const voices = synth.getVoices();
  const preferredVoice = voices.find(v => v.name.includes("Microsoft Mark")) || 
                         voices.find(v => v.name.includes("Microsoft Zira")) || 
                         voices.find(v => v.name.includes("Google UK English Male")) ||
                         voices.find(v => v.lang === "en-US");
                         
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  utterance.rate = 0.85; 
  utterance.pitch = 0.9; 
  
  synth.speak(utterance);
}