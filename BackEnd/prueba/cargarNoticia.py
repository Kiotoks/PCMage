from pymongo import MongoClient

connection_string = "mongodb+srv://PcMage:pcm2@pcmage.rfnrvkw.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(connection_string)

db = client.pcmdb
while True:
    tit = str(input("titulo: "))
    art = str(input("articulo: "))
    img1 = str(input("img1: "))
    img2 = str(input("img2: "))
    fecha = str(input("fecha: "))

    document = {"titulo": tit, "articulo": art, "img1": img1, "img2": img2, "fecha": fecha}

    collection = db.Noticias
    collection.insert_one(document) 