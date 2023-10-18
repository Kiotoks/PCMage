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
        product_img = product_data.get('thumbnail')
        product_link = product_data.get('permalink')
        if product_price is not None:
            return product_price, product_img, product_link
        else:
            return 'Precio no disponible'
    else:
        return 'Error en la solicitud'
    
def actPrecios():
    global db
    collection = db.Componentes
    documentos = collection.find()
    for doc in documentos:
        myquery = { "MLA": doc["MLA"] }
        precio = get_product_price(doc["MLA"])[0]
        newvalues = { "$set": { "precio": precio  } }
        try:
            collection.update_one(myquery, newvalues)
            print(doc["MLA"] )
            print(precio)
            print("Terminado")
        except:
            print("Error actualizando precio automaticamente")

def addImgLink():
    global db
    collection = db.Componentes
    documentos = collection.find()
    for doc in documentos:
        myquery = { "MLA": doc["MLA"] }
        precio, img, link = get_product_price(doc["MLA"])
        newvalues = { "$set": { "img": img  }}
        newvalues2 = { "$set": { "link": link  }}
        try:
            collection.update_one(myquery, newvalues)
            collection.update_one(myquery, newvalues2)
            print(doc["MLA"] )
            print(img)
            print(link)
            print("Terminado")
        except:
            print("Error actualizando precio automaticamente")

connection_string = "mongodb+srv://PcMage:pcm2@pcmage.rfnrvkw.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(connection_string)
db = client.pcmdb

tipo = nom = str(input("Ingrese el tipo de los productos que va a ingresar: "))

while True:
    mla = "MLA" + str(input("Ingrese mla (solo numero): "))
    nom = str(input("Ingrese nombre del producto: "))
    
    precio, img, link = get_product_price(mla)

    document = {"MLA": mla, "nom": nom, "precio": precio, "img": img, "link":link, "tipo":tipo}
    print(document)
    collection = db.Componentes
    collection.insert_one(document)
    input()
    os.system("cls")



os.system("pause")