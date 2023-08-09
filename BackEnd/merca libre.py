import requests

def search_products(query):
    # Definir las credenciales de la API (reemplaza con tus propias credenciales)
    client_id = '6228197328840507'
    client_secret = 'Sr6YzPZGAT2xvSdBWtf2YPbzI1ntHhB0'

    # Obtener el token de acceso
    token_url = 'https://api.mercadolibre.com/oauth/token'
    token_data = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret
    }
    response = requests.post(token_url, data=token_data)
    access_token = response.json()['access_token']

    # Realizar la búsqueda de productos
    search_url = 'https://api.mercadolibre.com/sites/MLA/search'
    params = {
        'q': query,
        'limit': 10
    }
    response = requests.get(search_url, params=params)
    products = response.json()['results']

    # Mostrar información básica de los productos
    for product in products:
        print('Precio:', product['price'])
        print('URL:', product['permalink'])
        print('-' * 40)

    if response.status_code == 200:
        products = response.json()['results']
        for product in products:
            print('Título:', product['title'])
            print('Precio:', product['price'])
            print('URL:', product['permalink'])
            print('-' * 40)
    else:
        print('Error en la solicitud:', response.status_code)

    if __name__ == '__main__':
    search_query = input('Ingresa un término de búsqueda: ')
    search_products(search_query)


