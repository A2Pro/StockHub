from pymongo import MongoClient

uri = "mongodb+srv://a2pro:FHYijF6S6oe9gi2x@cluster0.slugn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(
    uri,
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=20000,
    socketTimeoutMS=20000
)

try:
    # Send a ping to confirm a successful connection
    client.admin.command('ping')
    print("Connection successful!")
except Exception as e:
    print(f"Connection failed: {e}")