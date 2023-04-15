import configparser
import mysql.connector
from mysql.connector import errorcode

configParser = configparser.ConfigParser()
configParser.read('config.ini')


class DbConnection(object):
    _iInstance = None

    class Singleton:
        def __init__(self):
            self.connection = mysql.connector.connect(
                host=configParser.get('MYSQL', 'host'), user=configParser.get('MYSQL', 'user'), password=configParser.get('MYSQL', 'password'), db=configParser.get('MYSQL', 'db'))

    def __init__(self):
        if DbConnection._iInstance is None:
            DbConnection._iInstance = DbConnection.Singleton()
        self._EventHandler_instance = DbConnection._iInstance

    def __getattr__(self, aAttr):
        return getattr(self._iInstance, aAttr)

    def __setattr__(self, aAttr, aValue):
        return setattr(self._iInstance, aAttr, aValue)
