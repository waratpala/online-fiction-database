import json
import math
import mysql.connector
from common import *
from mysql.connector import errorcode
from mysql_con import DbConnection


def GetFictionList(page, limit, filterDB, sort, search):
    if search == None:
        search = ""
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        mycursor.execute(
            "SELECT COUNT(fictionID) as total FROM fiction")
        count = mycursor.fetchone()

        pagination = {
            "curent_page": page,
            "limit": limit,
            "offset": limit*(page-1),
            "max_page": math.ceil(count['total']/limit),
            "sort": sort,
            "data": []
        }

        if count['total'] == 0:
            pagination['max_page'] = 1

        if pagination['max_page'] < pagination['curent_page']:
            return None, "max<curent"

        if (filterDB is None):
            sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE fictionName LIKE %s ORDER BY %s LIMIT %s OFFSET %s"
            val = ("%" + search + "%", sort,
                   pagination['limit'], pagination['offset'])
        else:
            sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE fictionName LIKE %s AND categoryID=%s ORDER BY %s LIMIT %s OFFSET %s"
            val = ("%" + search + "%", filterDB, sort,
                   pagination['limit'], pagination['offset'])

        mycursor.execute(sql, val)
        pagination["data"] = mycursor.fetchall()
        return pagination, None

    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def GetWriterFiction(page, limit, filterDB, sort, search, writer):

    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        mycursor.execute(
            "SELECT COUNT(fictionID) as total FROM fiction WHERE writer=%s", (writer,))
        count = mycursor.fetchone()

        pagination = {
            "curent_page": page,
            "limit": limit,
            "offset": limit*(page-1),
            "max_page": math.ceil(count['total']/limit),
            "sort": sort,
            "writer": writer,
            "data": [],
            "val": "",
            "sql": ""
        }

        if count['total'] == 0:
            pagination['max_page'] = 1

        if pagination['max_page'] < pagination['curent_page']:
            return None, "max<curent"

        if (filterDB is None):
            # sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE writer=%s AND fictionName LIKE %s ORDER BY %s LIMIT %s OFFSET %s"
            # val = (writer, "%" + search + "%", sort,
            #        pagination['limit'], pagination['offset'])
            sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE writer=%s"
            val = (writer,)
            pagination["val"] = val
            pagination["sql"] = sql

        else:
            sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE writer=%s AND fictionName LIKE %s AND categoryID=%s ORDER BY %s LIMIT %s OFFSET %s"
            val = (writer, "%" + search + "%", filterDB, sort,
                   pagination['limit'], pagination['offset'])
            pagination["val"] = val
            pagination["sql"] = sql

        mycursor.execute(sql, val)
        pagination["data"] = mycursor.fetchall()
        return pagination, None

    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def GetFiction(fictionID):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "SELECT fictionID,fictionName,categoryID,picture,user_name FROM fiction INNER JOIN user ON writer=id WHERE fictionID = %s"
        val = (fictionID,)

        mycursor.execute(sql, val)
        info = mycursor.fetchone()

        return info, None

    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def GetChapter(page, limit, sort, fictionID):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "SELECT COUNT(chapter) as total FROM chapter WHERE fictionID = %s"
        val = (fictionID,)
        mycursor.execute(sql, val)
        count = mycursor.fetchone()
        if count == 0:
            count = 1
        pagination = {
            "curent_page": page,
            "limit": limit,
            "offset": limit*(page-1),
            "max_page": math.ceil(count['total']/limit),
            "sort": sort,
            "data": [],
        }

        if count['total'] == 0:
            pagination['max_page'] = 1

        if pagination['max_page'] < pagination['curent_page']:
            return None, "max<curent"

        sql = "SELECT chapterID,chapter,Title FROM chapter WHERE fictionID = %s ORDER BY %s LIMIT %s OFFSET %s"
        val = (fictionID, sort,
               pagination['limit'], pagination['offset'])

        mycursor.execute(sql, val)
        pagination["data"] = mycursor.fetchall()
        pagination["val"] = val
        return pagination, None

    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def GetContent(chapterID):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "SELECT chapterID,chapter,Title,Content FROM chapter WHERE chapterID = %s"
        val = (chapterID,)

        mycursor.execute(sql, val)
        content = mycursor.fetchone()
        return content, None

    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def NewFiction(fictionName, writerID, url):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        if (url):
            sql = ("INSERT INTO fiction (fictionName,writer,picture) VALUES (%s,%s,%s)")
            val = (fictionName, writerID, url)
        else:
            sql = ("INSERT INTO fiction (fictionName,writer) VALUES (%s,%s)")
            val = (fictionName, writerID)

        mycursor.execute(sql, val)
        mydb.commit()

        return None
    except mysql.connector.Error as err:
        return err
    except TypeError as err:
        return err


def VerifierUser(username, password):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "SELECT id user FROM user WHERE user_name=%s AND password=%s"
        val = (username, password)

        mycursor.execute(sql, val)
        user = mycursor.fetchone()
        return user, None
    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def VerifierPermission(fiction, writer):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "SELECT * user FROM user WHERE fiction=%s AND writer=%s"
        val = (fiction, writer)

        mycursor.execute(sql, val)
        user = mycursor.fetchone()
        return user, None
    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def NewUser(username, password):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor()

        sql = "INSERT INTO user (user_name,password) VALUES (%s,%s)"
        val = (username, password)

        mycursor.execute(sql, val)
        mydb.commit()
        return mycursor.lastrowid, None

    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def NewChapter(fictionID, chapter, title, content, category, worldList):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "INSERT INTO chapter (fictionID,chapter,categoryID,Title,Content) VALUES (%s,%s,%s,%s,%s)"
        val = (fictionID, chapter, category, title, content)

        mycursor.execute(sql, val)
        mydb.commit()

        sql = "INSERT INTO feature (word, total, fan) VALUES(%s, 1, %s) ON DUPLICATE KEY UPDATE %s=%s+1, total=total1"
        val = (worldList, category, category, category)

        mycursor.execute(sql, val)
        mydb.commit()

    except mysql.connector.Error as err:
        return err
    except TypeError as err:
        return err


def GetFeature(worldList):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)
        format_strings = ','.join(['%s'] * len(worldList))
        data = {}
        cat = ["hor", "mys", "fan", "sci", "act", "dra"]

        for i in cat:
            mycursor.execute("SELECT word, "+i+",total FROM feature WHERE word IN (%s)" % format_strings,
                             tuple(worldList))
            data[i] = mycursor.fetchall()
        return data, None
    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def UpdateChapter(fictionID, chapter, title, content):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "UPDATE chapter SET Title = %s, Content = %s WHERE fictionID = %s AND chapter = %s"
        val = (title, content, fictionID, chapter)

        mycursor.execute(sql, val)
        mydb.commit()

    except mysql.connector.Error as err:
        return err
    except TypeError as err:
        return err


def DeleteChapter(fictionID, chapter):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "DELETE FROM chapter WHERE fictionID = %s AND chapter = %s"
        val = (fictionID, chapter)

        mycursor.execute(sql, val)
        mydb.commit()

    except mysql.connector.Error as err:
        return err
    except TypeError as err:
        return err
