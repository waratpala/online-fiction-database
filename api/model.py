import json
import sys
import math
import mysql.connector
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

        if filterDB == None:
            sql = "SELECT fictionID,fictionName,categoryID FROM fiction WHERE fictionName LIKE %s ORDER BY %s LIMIT %s OFFSET %s"
            val = ("%" + search + "%", sort,
                   pagination['limit'], pagination['offset'])

            mycursor.execute(sql, val)
            pagination["data"] = mycursor.fetchall()
        else:
            sql = "SELECT fictionID,fictionName,categoryID FROM fiction WHERE fictionName LIKE %s AND categoryID=%s ORDER BY %s LIMIT %s OFFSET %s"
            val = ("%" + search + "%", Category(filterDB), sort,
                   pagination['limit'], pagination['offset'])

            mycursor.execute(sql, val)
            pagination["data"] = mycursor.fetchall()
        return pagination, None

    except mysql.connector.Error as err:
        print(err)
        return None, err
    except TypeError as err:
        print(err)
        return None, err


def GetWriterFiction(page, limit, filterDB, sort, search, writer):
    if search == None:
        search = ""
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
            "data": []
        }
        if filterDB == None:
            sql = "SELECT fictionID,fictionName,categoryID FROM fiction WHERE writer=%s AND fictionName LIKE %s ORDER BY %s LIMIT %s OFFSET %s"
            val = (writer, "%" + search + "%", sort,
                   pagination['limit'], pagination['offset'])

            mycursor.execute(sql, val)
            pagination["data"] = mycursor.fetchall()
        else:
            sql = "SELECT fictionID,fictionName,categoryID FROM fiction WHERE writer=%s AND fictionName LIKE %s AND categoryID=%s ORDER BY %s LIMIT %s OFFSET %s"
            val = (writer, "%" + search + "%", Category(filterDB), sort,
                   pagination['limit'], pagination['offset'])

            mycursor.execute(sql, val)
            pagination["data"] = mycursor.fetchall()
        return pagination, None

    except mysql.connector.Error as err:
        print(err)
        return None, err
    except TypeError as err:
        print(err)
        return None, err


def GetFiction(fictionID, sort):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "SELECT fictionID,fictionName,categoryID FROM fiction WHERE fictionID = %s ORDER BY %s"
        val = (fictionID, sort)

        mycursor.execute(sql, val)
        info = mycursor.fetchone()

        sql = "SELECT categoryID,COUNT(categoryID) as total FROM chapter WHERE fictionID=%s GROUP BY categoryID"
        val = (fictionID,)

        mycursor.execute(sql, val)
        contentCat = mycursor.fetchone()
        info["category"] = contentCat
        return info, None

    except mysql.connector.Error as err:
        print(err)
        return None, err
    except TypeError as err:
        print(err)
        return None, err


def GetChapter(page, limit, sort, fictionID):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "SELECT COUNT(chapter) as total FROM chapter WHERE fictionID = %s"
        val = (fictionID,)
        mycursor.execute(sql, val)
        count = mycursor.fetchone()

        pagination = {
            "curent_page": page,
            "limit": limit,
            "offset": limit*(page-1),
            "max_page": math.ceil(count['total']/limit),
            "sort": sort,
            "data": []
        }
        sql = "SELECT chapterID,chapter,Title FROM chapter WHERE fictionID = %s ORDER BY %s LIMIT %s OFFSET %s"
        val = (fictionID, sort,
               pagination['limit'], pagination['offset'])

        mycursor.execute(sql, val)
        pagination["data"] = mycursor.fetchall()
        return pagination, None

    except mysql.connector.Error as err:
        print(err)
        return None, err
    except TypeError as err:
        print(err)
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
        print(err)
        return None, err
    except TypeError as err:
        print(err)
        return None, err


def NewFiction(fictionName, writerID):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = ("INSERT INTO fiction (fictionName,writer) VALUES (%s,%s)")
        val = (fictionName, writerID)
        mycursor.execute(sql, val)
        mydb.commit()
        print(val)
        print(mycursor.lastrowid)

    except mysql.connector.Error as err:
        print(err)
        return None, err
    except TypeError as err:
        print(err)
        return None, err


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


def NewChapter(fictionID, chapter, title, content, category):
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        sql = "INSERT INTO chapter (fictionID,chapter,categoryID,Title,Content) VALUES (%s,%s,%s,%s,%s)"
        val = (fictionID, chapter, category, title, content)

        mycursor.execute(sql, val)
        mydb.commit()

    except mysql.connector.Error as err:
        return err
    except TypeError as err:
        return err


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


def Category(category):
    match str(category):
        case "นิยายระทึกขวัญ":
            return 2
        case "นิยายสืบสวน":
            return 3
        case "นิยายแฟนตาซี":
            return 4
        case "นิยายวิทยาศาสตร์":
            return 5
        case "นิยายแอ๊คชั่น":
            return 6
        case "นิยายรักดราม่า":
            return 7
        case _:
            return 1
