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
            "SELECT COUNT(fictionID) as total FROM fiction AND delete_at IS NULL")
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
            sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE fictionName LIKE %s AND delete_at IS NULL ORDER BY %s LIMIT %s OFFSET %s"
            val = ("%" + search + "%", sort,
                   pagination['limit'], pagination['offset'])
        else:
            sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE fictionName LIKE %s AND categoryID=%s AND delete_at IS NULL ORDER BY %s LIMIT %s OFFSET %s"
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
            "SELECT COUNT(fictionID) as total FROM fiction WHERE writer=%s AND delete_at IS NULL", (writer,))
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
            sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE writer=%s AND fictionName LIKE %s AND delete_at IS NULL ORDER BY %s LIMIT %s OFFSET %s"
            val = (writer, "%" + search + "%", sort,
                   pagination['limit'], pagination['offset'])
            # sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE writer=%s AND delete_at IS NULL"
            # val = (writer,)

        else:
            sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE writer=%s AND fictionName LIKE %s AND categoryID=%s AND delete_at IS NULL ORDER BY %s LIMIT %s OFFSET %s"
            val = (writer, "%" + search + "%", filterDB, sort,
                   pagination['limit'], pagination['offset'])

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

        sql = "SELECT fictionID,fictionName,categoryID,picture,user_name FROM fiction INNER JOIN user ON writer=id WHERE fictionID = %s AND delete_at IS NULL"
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

        sql = "SELECT COUNT(chapter) as total FROM chapter WHERE fictionID = %s AND delete_at IS NULL"
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

        sql = "SELECT chapterID,chapter,title,categoryID category FROM chapter WHERE fictionID = %s AND delete_at IS NULL ORDER BY %s LIMIT %s OFFSET %s"
        val = (fictionID, sort,
               pagination['limit'], pagination['offset'])

        mycursor.execute(sql, val)
        pagination["data"] = mycursor.fetchall()

        return pagination, None

    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def GetContent(chapterID):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "SELECT chapterID,chapter,title,content,fictionID FROM chapter WHERE chapterID = %s AND delete_at IS NULL"
        val = (chapterID,)

        mycursor.execute(sql, val)
        content = mycursor.fetchone()

        sql = "SELECT fictionName,writer FROM fiction WHERE fictionID=%s"
        val = (content['fictionID'],)

        mycursor.execute(sql, val)
        fiction = mycursor.fetchone()
        content['fiction_name'] = fiction['fictionName']
        content['writer'] = fiction['writer']

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


def GetUser(id):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "SELECT id, user_name FROM user WHERE id=%s"
        val = (id,)

        mycursor.execute(sql, val)
        user = mycursor.fetchone()
        return user, None
    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def VerifierPermission(fictionID, writer):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "SELECT * FROM fiction WHERE fictionID=%s AND writer=%s"
        val = (fictionID, writer)

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


def NewChapter(fictionID, title, content, category):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "SELECT MAX(chapter)+1 curerent FROM chapter WHERE fictionID=%s"
        val = (fictionID,)
        mycursor.execute(sql, val)
        chapter = mycursor.fetchone()

        sql = "INSERT INTO chapter (fictionID,chapter,categoryID,title,content) VALUES (%s,%s,%s,%s,%s)"
        val = (fictionID, chapter['curerent'], category, title, content)
        mycursor.execute(sql, val)
        mydb.commit()

        sql = "SELECT categoryID FROM (SELECT categoryID,COUNT(categoryID) catcount FROM chapter WHERE fictionID=%s GROUP BY categoryID) cat ORDER BY catcount DESC LIMIT 1"
        val = (fictionID,)
        mycursor.execute(sql, val)
        fictionCategory = mycursor.fetchone()

        sql = "UPDATE fiction SET categoryID = %s WHERE fictionID = %s"
        val = (fictionCategory['categoryID'], fictionID)
        mycursor.execute(sql, val)
        mydb.commit()

        return None

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


def UpdateChapter(chapterID, title, content):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "UPDATE chapter SET title = %s, content = %s WHERE chapterID = %s"
        val = (title, content, chapterID)

        mycursor.execute(sql, val)
        mydb.commit()

    except mysql.connector.Error as err:
        return err
    except TypeError as err:
        return err


def DeleteChapter(chapterID):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "UPDATE chapter SET delete_at = CURRENT_TIMESTAMP WHERE chapterID = %s"
        val = (chapterID,)

        mycursor.execute(sql, val)
        mydb.commit()

    except mysql.connector.Error as err:
        return err
    except TypeError as err:
        return err


def DeleteFiction(fictionID):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "UPDATE fiction SET delete_at = CURRENT_TIMESTAMP WHERE fictionID = %s"
        val = (fictionID,)

        mycursor.execute(sql, val)
        mydb.commit()

    except mysql.connector.Error as err:
        return err
    except TypeError as err:
        return err
