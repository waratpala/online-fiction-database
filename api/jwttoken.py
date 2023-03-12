import jwt
import datetime
import configparser

configParser = configparser.ConfigParser()
configParser.read('config.ini')

secret = configParser.get('JWT', 'secret')
getAlgorithm = configParser.get('JWT', 'algorithm')


def jwtEncode(user_id):
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1, seconds=60),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(payload, secret, algorithm=getAlgorithm)
    except Exception as e:
        return e


def jwtDecode(token):
    try:
        user = jwt.decode(token, secret, algorithms=getAlgorithm)
        return user
    except:
        return None
