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

setInterval(healthCheck, 1000);

// Exemplo de resposta JSON da API
const apiResponse = [
  {
    name: "Gabriel Gollo",
    avatar: null,
    rank: "Epic",
    currentScore: "677.15K",
    previousScore: "622.04K",
    gain: "+95K",
    coinImage: null,
  },
  // Adicione mais objetos conforme necessário
];

// Função para criar o HTML de um amigo
function createFriendItem(user) {
  const avatarImage = user.avatar || "default-avatar.png";
  const coinImage = user.coinImage || "default-coin.png";
  return `
    <div class="friends-list">
        <div class="friends-item">
            <div class="friends-item-user">
                <div class="user-info">
                    <div class="user-info-avatar"><img src="${avatarImage}" alt="Avatar"></div>
                    <div class="user-info-content">
                        <p>${user.name}</p>
                        <div class="user-info-content-data">
                            <span>${user.rank}</span>
                            <span class="is-circle"></span>
                            <div class="price">
                                <div class="price-image">
                                    <img class="coin img-responsive is-14" src="${coinImage}" alt="Coin">
                                </div>
                                <div class="price-value">${user.currentScore}</div>
                            </div>
                            <span class="text-grey">&nbsp;&nbsp;(${user.previousScore})</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="friends-item-stats">
                <div class="price">
                    <div class="price-image">
                        <img class="coin img-responsive is-20" src="${coinImage}" alt="Coin">
                    </div>
                    <div class="price-value">${user.gain}</div>
                </div>
            </div>
        </div>
    </div>`;
}

// Função para carregar os dados da API e atualizar o HTML
function loadFriends() {
  // Simulando uma chamada à API com a resposta
  const friendsWrap = document.querySelector(".friends-wrap");
  apiResponse.forEach((user) => {
    friendsWrap.innerHTML += createFriendItem(user);
  });
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", loadFriends);
