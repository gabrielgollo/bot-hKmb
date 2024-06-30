import { stringToMorse } from "./morseTranslator.js";

// script.js
let dailyCipher = "";

function healthCheck() {
  fetch("/healthcheck")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("Tokens").innerText = JSON.stringify(
        data,
        null,
        4
      );
    });
}

async function fetchBots() {
  const response = await fetch("/bots");
  const data = await response.json();
  return data;
}

setInterval(healthCheck, 1000);
const ranks = {
  1: "Bronze",
  2: "Silver",
  3: "Gold",
  4: "Platinum",
  5: "Diamond",
  6: "Epic",
  7: "Legendary",
  8: "Master",
  9: "Grandmaster",
  10: "Lord",
};

function toEngineeringNotation(num) {
  if (num === 0) return "0";

  const exponent = Math.floor(Math.log10(Math.abs(num)) / 3) * 3;
  const mantissa = num / Math.pow(10, exponent);

  const suffixes = {
    0: "",
    3: "K",
    6: "M",
    9: "G",
    12: "T",
    15: "P",
    18: "E",
  };

  return `${mantissa.toFixed(2)} ${suffixes[exponent]}`;
}

function createBotItem(user) {
  const avatarImage = user.avatar || "./images/default-avatar.png";
  const coinImage = "./images/default-coin.png";
  const energyImage = "./images/default-energy.png";

  const balanceCoins = toEngineeringNotation(user.balanceCoins);
  const earnPassivePerHour = toEngineeringNotation(user.earnPassivePerHour);

  return `
        <div class="bot-item">
            <div class="bot-item-user">
                <div class="user-info">
                    <div class="user-info-avatar"><img src="${avatarImage}" alt="Avatar"></div>
                    <div class="user-info-content">
                        <p>${user.name}</p>
                        <div class="user-info-content-data">
                            <span>${ranks[user.rank]}</span>
                            <span class="is-circle"></span>
                            <div class="price">
                                <div class="price-image">
                                    <img class="coin img-responsive is-14" src="${coinImage}" alt="Coin">
                                </div>
                                <div class="price-value">${earnPassivePerHour} $/h</div>
                            </div>
                            <span class="text-grey">&nbsp;&nbsp;(${balanceCoins})</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bot-item-stats">
                <div class="price">
                    <div class="price-image">
                        <img class="coin img-responsive is-20" src="${energyImage}" alt="Energy">
                    </div>
                    <div class="price-value">${user.availableTaps}</div>
                </div>
            </div>
        </div>`;
}

// Função para carregar os dados da API e atualizar o HTML
async function loadBots() {
  try {
    const apiResponse = await fetchBots();

    console.log(apiResponse);

    // Atualiza a lista de bots
    const BotList = document.querySelector(".bot-list");
    BotList.innerHTML = "";
    apiResponse?.bots?.forEach((user) => {
      BotList.innerHTML += createBotItem(user);
    });

    // Atualiza o código/Cifra diário
    const contentEle = document.getElementById("cipher");
    contentEle.innerHTML = `
          <div class="card text-white bg-dark mb-3" style="min-width: 5rem;">
            <div class="card-header">Cipher</div>
            <div class="card-body">
              <div id="dailyCipher" class="card-text"></div>
            </div>  
          </div>`;

    if (apiResponse?.bots?.length > 0) {
      dailyCipher = apiResponse.bots[0].cipher;
      const eleCipher = document.getElementById("dailyCipher");
      if (eleCipher) {
        const morseString = stringToMorse(dailyCipher);
        let treatedMorseString = [];

        for (let i = 0; i < dailyCipher.length; i++) {
          treatedMorseString.push(`${dailyCipher[i]} : ${morseString[i]}`);
        }

        // print letter by letter with morse code in right side
        eleCipher.innerText = `${treatedMorseString.join("\n")}`;
      }
    }
  } catch (error) {
    console.error("Erro ao carregar os bots", error);
  }

  // Atualiza a cada 60 segundos
  setTimeout(loadBots, 10000);
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", loadBots);
