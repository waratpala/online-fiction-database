import jwt
import configparser

parser = configparser.ConfigParser()
parser.read("config.ini")

secret = parser.get('JWT', 'secret')
getAlgorithm = parser.get('JWT', 'algorithm')
print(secret, getAlgorithm)
payload_data = {
    "id": 1,
    "user": "s",
}
token = jwt.encode(payload=payload_data, key="secret")
print(token)
