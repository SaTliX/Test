// Utilisation d'une fonction auto-exécutée pour éviter les conflits de noms de variables
(function() {
  // Sélectionner les éléments de l'interface utilisateur
  const chatbox = document.getElementById("chatbox");
  const userinput = document.getElementById("userinput");
  const chatlog = document.getElementById("chatlog");

  let conversationState = 0; // État de la conversation
  let locationInput = '';
  let cuisine = '';
  let price = '';
  let openNow = '';

  // Ajouter un écouteur d'événement pour le formulaire de saisie de l'utilisateur
  const form = document.getElementById("chatform");
  form.addEventListener("submit", async function(event) {
      event.preventDefault();
      const usermessage = userinput.value;
      userinput.value = "";
      afficherMessage(`User: ${usermessage}`, false); // Afficher la réponse de l'utilisateur

      if (conversationState === 0) {
          locationInput = usermessage;
          afficherMessage(`Bot: Très bien. Quel type de cuisine préférez-vous?`, true);
          conversationState++;
      } else if (conversationState === 1) {
          cuisine = usermessage;
          afficherMessage(`Bot: Parfait. Avez-vous une fourchette de prix en tête?`, true);
          conversationState++;
      } else if (conversationState === 2) {
          price = usermessage;
          afficherMessage(`Bot: D'accord. Voulez-vous voir seulement les restaurants ouverts actuellement? (Répondre par oui ou non)`, true);
          conversationState++;
      } else if (conversationState === 3) {
          openNow = usermessage.toLowerCase() === 'oui';
          afficherMessage(`Bot: Je vais rechercher des restaurants dans la ville ${locationInput}, de cuisine ${cuisine}, dans une fourchette de prix ${price}, qui sont ouverts actuellement. Comment souhaitez-vous trier les résultats? Par avis, pertinence ou distance?`, true);
          conversationState++;
      } else if (conversationState === 4) {
          const response = await fetch('/search', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ location: locationInput, cuisine, price, openNow })
          });
          const data = await response.json();
          displayResults(data.businesses);
          conversationState = 0;
      }
  });

  // Fonction pour afficher un message dans la zone de conversation
  function afficherMessage(message, classe) {
      const p = document.createElement("p");
      p.textContent = message;
      p.className = classe ? 'bot' : 'user';
      chatlog.appendChild(p);
      chatbox.scrollTop = chatbox.scrollHeight;
  }

  function displayResults(restaurants) {
      const resultsDiv = document.getElementById('chatlog');
      resultsDiv.innerHTML = '';
      restaurants.forEach(restaurant => {
          const name = restaurant.name;
          const rating = restaurant.rating;
          const price = restaurant.price;
          const address = restaurant.location.address1;
          const phone = restaurant.phone;
          const resultDiv = document.createElement('div');
          resultDiv.innerHTML = `<h2>${name}</h2><p>Rating: ${rating}</p><p>Price: ${price}</p><p>Address: ${address}</p><p>Phone: ${phone}</p>`;
          resultsDiv.appendChild(resultDiv);
      });
  }
})();
