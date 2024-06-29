// script.js

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

// Função para criar o HTML de um amigo
function createBotItem(user) {
  const avatarImage = user.avatar || "./images/default-avatar.png";
  const coinImage = "./images/default-coin.png";
  const energyImage = "./images/default-energy.png";
  return `
        <div class="bot-item">
            <div class="bot-item-user">
                <div class="user-info">
                    <div class="user-info-avatar"><img src="${avatarImage}" alt="Avatar"></div>
                    <div class="user-info-content">
                        <p>${user.name}</p>
                        <div class="user-info-content-data">
                            <span>${rank[user.rank]}</span>
                            <span class="is-circle"></span>
                            <div class="price">
                                <div class="price-image">
                                    <img class="coin img-responsive is-14" src="${coinImage}" alt="Coin">
                                </div>
                                <div class="price-value">${user.earnPassivePerHour}</div>
                            </div>
                            <span class="text-grey">&nbsp;&nbsp;(${user.balanceCoins})</span>
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

    const BotList = document.querySelector(".bot-list");
    BotList.innerHTML = "";
    apiResponse?.bots?.forEach((user) => {
      BotList.innerHTML += createBotItem(user);
    });
  } catch (error) {
    console.error("Erro ao carregar os bots", error);
  }

  // Atualiza a cada 60 segundos
  setTimeout(loadBots, 10000);
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", loadBots);
