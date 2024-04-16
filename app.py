from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search_restaurants():
    location = request.json['location']
    cuisine = request.json['cuisine']  # Nouveau paramètre de recherche
    price = request.json['price']  # Nouveau paramètre de recherche
    open_now = request.json.get('openNow', False)  # Nouveau paramètre de recherche, par défaut False
  # Ajoutez d'autres paramètres de recherche du formulaire

    # Faire une requête à l'API Yelp avec les paramètres de recherche
    api_url = 'https://api.yelp.com/v3/businesses/search'
    headers = {'Authorization': 'Bearer BcSHFc8ge0xDAAHuYn15yya5_jige6_--nH6ilI3nWD-cMHfXBTCclQyWQHWtNfYsBfVy5qGKlRxeGfUilFv71688tMrnLm8jk1eyFCUtaOkDPJyjA8-X2To5zAUZnYx'}
    params = {'location': location, 'categories': cuisine, 'price': price, 'open_now': open_now, 'sort_by': 'rating'}
    response = requests.get(api_url, headers=headers, params=params)
    data = response.json()

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
