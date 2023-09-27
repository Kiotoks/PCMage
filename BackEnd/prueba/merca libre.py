import requests
import os

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

os.system("pause")