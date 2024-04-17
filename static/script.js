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

    // Tableau des catégories de cuisine importantes
    const importantCuisines = [
        'italian',
        'french',
        'american',
        'chinese',
        'japanese',
        'mexican',
        'indian',
        'thai',
        'mediterranean',
        'vegetarian',
        'vegan',
        'gluten_free'
    ];

    // Fonction pour vérifier si la catégorie saisie par l'utilisateur est valide
    function isValidCuisine(category) {
        return importantCuisines.includes(category.trim().toLowerCase());
    }

    // Fonction pour afficher un message de l'utilisateur instantanément
    function afficherMessageUtilisateur(message) {
        const p = document.createElement("p");
        p.textContent = message;
        p.classList.add("message");
        p.classList.add("user-message");
        chatlog.appendChild(p);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    // Fonction pour afficher un message du bot avec un délai
    async function afficherMessageBotAvecDelai(message) {
        const delay = 50; // Délai entre chaque lettre (en millisecondes)
        const p = document.createElement("p");
        p.classList.add("message");
        p.classList.add("bot-message");

        const botName = 'RestoBot';
        p.innerHTML = `<strong>${botName}:</strong> `;

        chatlog.appendChild(p);

        for (const letter of message) {
            p.textContent += letter;
            await sleep(delay);
        }

        // Faire défiler automatiquement vers le bas
        chatbox.scrollTop = chatbox.scrollHeight;
    }
    // Fonction pour mettre en pause l'exécution
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Ajouter un écouteur d'événement pour le formulaire de saisie de l'utilisateur
    const form = document.getElementById("chatform");
    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const usermessage = userinput.value;
        userinput.value = "";
        afficherMessageUtilisateur(`Vous: ${usermessage}`, false); // Afficher la réponse de l'utilisateur

        if (conversationState === 0) {
            locationInput = usermessage;
            await afficherMessageBotAvecDelai(`Très bien. Quel type de cuisine préférez-vous?`, true);
            conversationState++;
        } else if (conversationState === 1) {
            cuisine = usermessage;
            if (isValidCuisine(cuisine)) {
                await afficherMessageBotAvecDelai("Parfait. Avez-vous une fourchette de prix en tête? (1, 2, 3 ou 4)", true);
                conversationState++;
            } else {
                await afficherMessageBotAvecDelai("Veuillez choisir un type de cuisine valide.", true);
            }
        } else if (conversationState === 2) {
            if (isValidPriceRange(usermessage)) {
                price = usermessage;
                await afficherMessageBotAvecDelai("D'accord. Voulez-vous voir seulement les restaurants ouverts actuellement? (Répondre par oui ou non)", true);
                conversationState++;
            } else {
                await afficherMessageBotAvecDelai("Veuillez entrer une fourchette de prix valide (1, 2, 3 ou 4).", true);
            }
        } else if (conversationState === 3) {
            openNow = usermessage.toLowerCase() === 'oui';
            await afficherMessageBotAvecDelai(`Je vais rechercher des restaurants dans la ville ${locationInput}, de cuisine ${cuisine}, dans une fourchette de prix ${price}, qui sont ouverts actuellement. Comment souhaitez-vous trier les résultats? Par avis ou pertinence`, true);
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

    // Fonction pour afficher les résultats des restaurants
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
