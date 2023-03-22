import mysql.connector
from mysql.connector import errorcode
from mysql_con import DbConnection


DB_NAME = 'main'

TABLES = {}

TABLES['user'] = (
    "CREATE TABLE [IF NOT EXISTS] `user` ("
    "  `id` int NOT NULL AUTO_INCREMENT,"
    "  `user_name` varchar(255) NOT NULL,"
    "  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,"
    "  PRIMARY KEY (`id`),"
    "  UNIQUE KEY `user_name` (`user_name`)"
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;")

TABLES['uscategoryer'] = (
    "    CREATE TABLE [IF NOT EXISTS] `category` ("
    "  `categoryID` int NOT NULL AUTO_INCREMENT,"
    "  `name` varchar(100) DEFAULT NULL,"
    "  PRIMARY KEY (`categoryID`)"
    ") ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;"
)
TABLES['fiction'] = (
    "CREATE TABLE [IF NOT EXISTS] `fiction` ("
    "  `fictionID` int NOT NULL AUTO_INCREMENT,"
    "  `fictionName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,"
    "  `categoryID` int DEFAULT NULL,"
    "  `picture` varchar(255),"
    "  `writer` int NOT NULL,"
    "  PRIMARY KEY (`fictionID`),"
    "  KEY `categoryID` (`categoryID`),"
    "  CONSTRAINT `fiction_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `category` (`categoryID`)"
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;")
TABLES['chapter'] = (
    "CREATE TABLE [IF NOT EXISTS] `chapter` ("
    "  `chapterID` int NOT NULL AUTO_INCREMENT,"
    "  `fictionID` int DEFAULT NULL,"
    "  `chapter` int DEFAULT NULL,"
    "  `categoryID` int DEFAULT NULL,"
    "  `Title` varchar(1000) DEFAULT NULL,"
    "  `Content` mediumtext,"
    "  PRIMARY KEY (`chapterID`),"
    "  KEY `fictionID` (`fictionID`),"
    "  KEY `categoryID` (`categoryID`),"
    "  CONSTRAINT `chapter_ibfk_1` FOREIGN KEY (`fictionID`) REFERENCES `fiction` (`fictionID`),"
    "  CONSTRAINT `chapter_ibfk_2` FOREIGN KEY (`categoryID`) REFERENCES `category` (`categoryID`)"
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;")
TABLES['feature'] = (
    "CREATE TABLE [IF NOT EXISTS] `feature` ("
    "  `word` varchar(100) NOT NULL,"
    "  `total` int DEFAULT 0,"
    "  `hor` int DEFAULT 0,"
    "  `mys` int DEFAULT 0,"
    "  `fan` int DEFAULT 0,"
    "  `sci` int DEFAULT 0,"
    "  `act` int DEFAULT 0,"
    "  `dra` int DEFAULT 0,"
    "  PRIMARY KEY (`word`)"
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;")


def create_database():
    mydb = DbConnection().connection
    cursor = mydb.cursor()
    try:
        cursor.execute(
            "CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(DB_NAME))
    except mysql.connector.Error as err:
        print("Failed creating database: {}".format(err))
    try:
        cursor.execute("USE {}".format(DB_NAME))
    except mysql.connector.Error as err:
        print("Database {} does not exists.".format(DB_NAME))
        if err.errno == errorcode.ER_BAD_DB_ERROR:
            create_database(cursor)
            mydb.database = DB_NAME
        else:
            print(err)

    for table_name in TABLES:
        table_description = TABLES[table_name]
        try:
            cursor.execute(table_description)
        except mysql.connector.Error as err:
            print(err.msg)
