from pymongo import MongoClient

# Cadena de conexión de MongoDB Atlas
connection_string = "mongodb+srv://PcMage:PcMage123@cluster1.lc6nmqa.mongodb.net/?retryWrites=true&w=majority"

# Crea una instancia del cliente de MongoDB
client = MongoClient(connection_string)

# Selecciona una base de datos
db = client.Noticia

# Selecciona una colección
collection = db.noticias

# Insertar un documento en la colección
document = {"name": "John", "age": 30}
collection.insert_one(document)

# Realizar operaciones en la base de datos
# Por ejemplo, consultar documentos
documentos = collection.find()

for documento in documentos:
    print(documento)
