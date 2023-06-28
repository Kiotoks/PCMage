from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://PcMage:PcMage123@cluster1.lc6nmqa.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(uri, server_api=ServerApi('1'))

collection = informaciónclientes ["clientes_españa"]

informaciónclientes = [
{
"nombre" : "García",
"dirección" : "Calle Ejemplo 10",
"código postal" : "46006",
"ciudad" : "Valencia"
}
{
"nombre" : "Rodríguez",
"dirección" : "Calle Principal 1",
"código postal" : "28007",
"ciudad" : "Madrid"
}
{
"nombre" : "González",
"dirección" : "Calle Amplia 2",
"código postal" : "36002",
"ciudad" : "Pontevedra"
}
]
collection.insert_many(informaciónclientes)