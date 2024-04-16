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
  
 // Fonction pour vérifier la validité de la fourchette de prix
function isValidPriceRange(price) {
    return ['1', '2', '3', '4'].includes(price);
}

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
        afficherMessage(`Bot: Parfait. Avez-vous une fourchette de prix en tête? (1, 2, 3 ou 4)`, true);
        conversationState++;
    } else if (conversationState === 2) {
        if (isValidPriceRange(usermessage)) {
            price = usermessage;
            afficherMessage(`Bot: D'accord. Voulez-vous voir seulement les restaurants ouverts actuellement? (Répondre par oui ou non)`, true);
            conversationState++;
        } else {
            afficherMessage(`Bot: Veuillez entrer une fourchette de prix valide (1, 2, 3 ou 4).`, true);
        }
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

  
    function afficherMessage(message, classe) {
        const p = document.createElement("p");
        p.textContent = message;
        p.classList.add("message"); // Ajouter la classe pour les messages
        p.classList.add(classe ? "bot-message" : "user-message"); // Ajouter la classe appropriée
        chatlog.appendChild(p);
    
        // Faire défiler automatiquement vers le bas
        chatbox.scrollTop = chatbox.scrollHeight;
    }
    
    function displayResults(restaurants) {
        restaurants.slice(0, 5).forEach(restaurant => {
            const name = restaurant.name;
            const rating = restaurant.rating;
            const price = restaurant.price;
            const address = restaurant.location.address1;
            const phone = restaurant.phone;
    
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('bot-message'); // Ajouter une classe pour le style
            resultDiv.innerHTML = `<h2>${name}</h2><p>Rating: ${rating}</p><p>Price: ${price}</p><p>Address: ${address}</p><p>Phone: ${phone}</p>`;
    
            // Insérer le résultat après le dernier message de la conversation
            chatlog.insertBefore(resultDiv, chatlog.lastElementChild);
        });
    }
    
  })();