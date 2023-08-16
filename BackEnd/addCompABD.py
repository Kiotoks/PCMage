from pymongo import MongoClient
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
    
def actPrecio(mla):
    global db
    myquery = { "codBarra": mla }
    newvalues = { "$set": { "precio": get_product_price(mla) } }
    try:
        collection = db.Componentes
        collection.update_one(myquery, newvalues)
    except:
        print("Error actualizando precio automaticamente")

connection_string = "mongodb+srv://PcMage:pcm2@pcmage.rfnrvkw.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(connection_string)


while True:
    db = client.pcmdb
    mla = "MLA" + str(input("Ingrese mla (solo numero): "))
    nom = str(input("Ingrese nombre del producto: "))
    precio = get_product_price(mla)

    document = {"MLA": mla, "nom": nom, "precio": precio}

    collection = db.Componentes
    collection.insert_one(document)



os.system("pause")