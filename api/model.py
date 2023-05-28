import json
import math
import os
import mysql.connector
from common import *
from mysql.connector import errorcode
from mysql_con import DbConnection


def GetFictionList(page, limit, filterDB, sort, search):
    if search == None:
        search = ""
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True, buffered=True)

        mycursor.execute(
            "SELECT COUNT(fictionID) as total FROM fiction WHERE delete_at IS NULL")
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
            sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE fictionName LIKE %s AND delete_at IS NULL ORDER BY " + sort + " LIMIT %s OFFSET %s"
            val = ("%" + search + "%", pagination['limit'], pagination['offset'])
        else:
            sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE fictionName LIKE %s AND categoryID=%s AND delete_at IS NULL ORDER BY "  + sort + " LIMIT %s OFFSET %s"
            val = ("%" + search + "%", filterDB, pagination['limit'], pagination['offset'])

        mycursor.execute(sql, val)
        pagination["data"] = mycursor.fetchall()
        return pagination, None

    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def UpdateFictionName(fictionID, title):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True, buffered=True)

        sql = "UPDATE fiction SET fictionName=%s WHERE fictionID=%s"
        val = (title, fictionID)

        mycursor.execute(sql, val)
        mydb.commit()

        return None

    except mysql.connector.Error as err:
        return err
    except TypeError as err:
        return err

def UpdateFictionAbstract(fictionID, abstract):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True, buffered=True)

        sql = "UPDATE fiction SET abstract=%s WHERE fictionID=%s"
        val = (abstract, fictionID)

        mycursor.execute(sql, val)
        mydb.commit()

        return None

    except mysql.connector.Error as err:
        return err
    except TypeError as err:
        return err
    
def GetImageName(fictionID):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True, buffered=True)

        sql = "SELECT picture FROM fiction WHERE fictionID = %s"
        val = (fictionID,)

        mycursor.execute(sql, val)
        image = mycursor.fetchone()
        imageName = os.path.split(image['picture'])[1]

        return imageName, None

    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def UpdateImagePath(fictionID, imageURL):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True, buffered=True)

        sql = "UPDATE fiction SET picture=%s WHERE fictionID=%s"
        val = (imageURL, fictionID)

        mycursor.execute(sql, val)
        mydb.commit()

        return None

    except mysql.connector.Error as err:
        return err
    except TypeError as err:
        return err


def GetWriterFiction(page, limit, filterDB, sort, search, writer):

    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True, buffered=True)

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
            sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE writer=%s AND fictionName LIKE %s AND delete_at IS NULL ORDER BY " + sort + " LIMIT %s OFFSET %s"
            val = (writer, "%" + search + "%", pagination['limit'], pagination['offset'])

        else:
            sql = "SELECT fictionID,fictionName,categoryID,picture FROM fiction WHERE writer=%s AND fictionName LIKE %s AND categoryID=%s AND delete_at IS NULL ORDER BY" + sort + " LIMIT %s OFFSET %s"
            val = (writer, "%" + search + "%", filterDB, pagination['limit'], pagination['offset'])

        mycursor.execute(sql, val)
        pagination["data"] = mycursor.fetchall()
        return pagination, None

    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def GetChapter(sort, fictionID):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True, buffered=True)

        sql = "SELECT fictionID,fictionName,categoryID,abstract,picture,user_name FROM fiction INNER JOIN user ON writer=id WHERE fictionID = %s"
        val = (fictionID,)

        mycursor.execute(sql, val)
        fictionContent = mycursor.fetchone()

        sql = """SELECT sum(case when categoryID = 2 then probability else 0 end) + sum(case when sub_categoryID_1 = 2 then probability_sub_1 else 0 end) + sum(case when sub_categoryID_2 = 2 then probability_sub_2 else 0 end) AS c2,
    	sum(case when categoryID = 3 then probability else 0 end) + sum(case when sub_categoryID_1 = 3 then probability_sub_1 else 0 end) + sum(case when sub_categoryID_2 = 3 then probability_sub_2 else 0 end) AS c3,
    	sum(case when categoryID = 4 then probability else 0 end) + sum(case when sub_categoryID_1 = 4 then probability_sub_1 else 0 end) + sum(case when sub_categoryID_2 = 4 then probability_sub_2 else 0 end) AS c4,
    	sum(case when categoryID = 5 then probability else 0 end) + sum(case when sub_categoryID_1 = 5 then probability_sub_1 else 0 end) + sum(case when sub_categoryID_2 = 5 then probability_sub_2 else 0 end) AS c5,
    	sum(case when categoryID = 6 then probability else 0 end) + sum(case when sub_categoryID_1 = 6 then probability_sub_1 else 0 end) + sum(case when sub_categoryID_2 = 6 then probability_sub_2 else 0 end) AS c6,
    	sum(case when categoryID = 7 then probability else 0 end) + sum(case when sub_categoryID_1 = 7 then probability_sub_1 else 0 end) + sum(case when sub_categoryID_2 = 7 then probability_sub_2 else 0 end) AS c7,
    	sum(case when categoryID = 1 then probability else 0 end) + sum(case when sub_categoryID_1 = 1 then probability_sub_1 else 0 end) + sum(case when sub_categoryID_2 = 1 then probability_sub_2 else 0 end) AS c1
        FROM chapter
        WHERE fictionID = %s;"""
        val = (fictionID,)
        mycursor.execute(sql, val)
        fictionContent['chapter_cat'] = mycursor.fetchone()

        sql = 'SELECT chapterID, chapter, title, categoryID category, probability,sub_categoryID_1 sub_category1, probability_sub_1, sub_categoryID_2 sub_category2, probability_sub_2 FROM chapter WHERE fictionID = %s AND delete_at IS NULL ORDER BY ' + sort
        val = (fictionID,)

        mycursor.execute(sql, val)
        fictionContent['chapterlist'] = mycursor.fetchall()
        fictionContent['sort'] = sort

        return fictionContent, None

    except mysql.connector.Error as err:
        return None, err
    except TypeError as err:
        return None, err


def GetContent(chapterID):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True, buffered=True)

        sql = "SELECT chapterID,chapter,title,content,fictionID FROM chapter WHERE chapterID = %s"
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


def NewFiction(fictionName, abstract, writerID, url):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True, buffered=True)

        if (url):
            sql = (
                "INSERT INTO fiction (fictionName,abstract,writer,picture) VALUES (%s,%s,%s,%s)")
            val = (fictionName, abstract, writerID, url)
        else:
            sql = ("INSERT INTO fiction (fictionName,abstract,writer) VALUES (%s,%s,%s)")
            val = (fictionName, abstract, writerID)

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
        mycursor = mydb.cursor(dictionary=True, buffered=True)

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
        mycursor = mydb.cursor(dictionary=True, buffered=True)

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
        mycursor = mydb.cursor(dictionary=True, buffered=True)

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
        mycursor = mydb.cursor(dictionary=True, buffered=True)

        sql = "SELECT MAX(chapter)+1 curerent FROM chapter WHERE fictionID=%s"
        val = (fictionID,)
        mycursor.execute(sql, val)
        chapter = mycursor.fetchone()

        sql = "INSERT INTO chapter (fictionID, chapter, categoryID, sub_categoryID_1, sub_categoryID_2, probability, probability_sub_1, probability_sub_2, title, content) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        val = (fictionID, chapter['curerent'], category[0]['category'], category[1]['category'], category[2]['category'], category[0]['prop'], category[1]['prop'], category[2]['prop'], title, content)
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
        mycursor = mydb.cursor(dictionary=True, buffered=True)
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
        mycursor = mydb.cursor(dictionary=True, buffered=True)

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
        mycursor = mydb.cursor(dictionary=True, buffered=True)

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
        mycursor = mydb.cursor(dictionary=True, buffered=True)

        sql = "UPDATE fiction SET delete_at = CURRENT_TIMESTAMP WHERE fictionID = %s"
        val = (fictionID,)

        mycursor.execute(sql, val)
        mydb.commit()

    except mysql.connector.Error as err:
        return err
    except TypeError as err:
        return err
