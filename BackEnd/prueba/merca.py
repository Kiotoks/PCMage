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


def get_product_price(product_id):
    # Definir la URL del producto utilizando su ID
    product_url = f'https://api.mercadolibre.com/items/{product_id}'

    # Realizar la solicitud GET
    response = requests.get(product_url)

    # Verificar si la solicitud fue exitosa (código de respuesta 200)
    if response.status_code == 200:
        product_data = response.json()
        product_price = product_data.get('price')
        if product_price is not None:
            return product_price
        else:
            return 'Precio no disponible'
    else:
        return 'Error en la solicitud'

if __name__ == '__main__':
    product_id = input('Ingresa la ID del producto: ')
    price = get_product_price(product_id)
    print('Precio del producto:', price)