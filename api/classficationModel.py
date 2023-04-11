import pandas as pd
import numpy as np
import mysql.connector
import pythainlp
import time
import string
from mysql_con import DbConnection


class Model:
    def __init__(self, user, password, host, database):
        self.user = user
        self.password = password
        self.host = host
        self.database = database
        self.notThai = list(string.printable)+list("๑๒๓๔๕๖๗๘๙")+list("ๆ๐")

    def getTable(self, tableName):
        cnx = DbConnection().connection

        cursor = cnx.cursor()
        query = "select * from " + tableName
        cursor.execute(query)

        data = []
        for row in cursor:
            data.append(row)

        return data

    def clearTable(self, tableName):
        cnx = DbConnection().connection

        cursor = cnx.cursor()

        cursor.execute("DELETE FROM " + tableName)
        cnx.commit()

    def trainAllData(self):

        print("training new dataSet")
        start = time.time()

        fictionNumber = [0, 0, 0, 0, 0, 0, 0]

        dataSet = self.getTable("chapter")

        for i in range(len(dataSet)):
            text = dataSet[i][5]
            if (text is None):
                continue

            for letter in self.notThai:
                text = text.replace(letter, "")
            pythaiToken = pythainlp.word_tokenize(text, keep_whitespace=False)

            fictionNumber[0] += 1
            fictionNumber[dataSet[i][3]-1] += 1

            if (i == 0):
                pythaiWord = pd.DataFrame({"word": pd.DataFrame(pythaiToken, columns=[
                                          "word"]).word.unique(), "genre": dataSet[i][3]})
            else:
                pythaiWord = pd.concat([pythaiWord, pd.DataFrame({"word": pd.DataFrame(
                    pythaiToken, columns=["word"]).word.unique(), "genre": dataSet[i][3]})])

        pythaiCount = pd.DataFrame({"amount": pythaiWord.groupby(
            ["word", "genre"])["word"].size()}).reset_index()

        wordTable = []
        i = -1
        for index, row in pythaiCount.iterrows():
            if (len(wordTable) == 0 or wordTable[i][0] != row.word):
                i += 1
                wordTable.append([row.word]+list("0000000"))
                wordTable[i][row.genre] = row.amount
                wordTable[i][1] = row.amount
            else:
                wordTable[i][row.genre] = row.amount
                wordTable[i][1] += row.amount

        self.clearTable("feature")
        self.clearTable("fiction_number")

        cnx = DbConnection().connection

        cursor = cnx.cursor()

        number = "INSERT INTO `fiction_number`(`total`, `hor`, `mys`, `fan`, `sci`, `act`, `dra`) VALUES (%s, %s, %s, %s, %s, %s, %s)"

        cursor.execute(number, fictionNumber)

        feature = "INSERT INTO feature (`word`, `total`, `hor`, `mys`, `fan`, `sci`, `act`, `dra`) VALUES ( %s, %s, %s, %s, %s, %s, %s, %s)"

        for word in wordTable:
            cursor.execute(feature, word)

        cnx.commit()

        end = time.time()
        print("use time " + str(end-start) + " sec")

    def predictData(self, text):

        if (text is None):
            return 1

        start = time.time()

        for letter in self.notThai:
            text = text.replace(letter, "")
        pythai_token = pythainlp.word_tokenize(text, keep_whitespace=False)

        pythai_word = pd.DataFrame({"word": pd.DataFrame(
            pythai_token, columns=["word"]).word.unique()})
        text = pd.DataFrame({"amount": pythai_word.groupby(
            ["word"])["word"].size()}).reset_index()

        feature = self.getTable("feature")
        ficNumber = self.getTable("fiction_number")

        feature = pd.DataFrame(
            feature, columns=["word", "total", "hor", "mys", "fan", "sci", "act", "dra"])

        model = text.merge(feature, on="word", how="left")

        propDf = pd.DataFrame(
            columns=["hor", "mys", "fan", "sci", "act", "dra"])

        bias = 0.5

        propDf["hor"] = np.log((model["hor"]+bias)/ficNumber[0][2])
        propDf["mys"] = np.log((model["mys"]+bias)/ficNumber[0][3])
        propDf["fan"] = np.log((model["fan"]+bias)/ficNumber[0][4])
        propDf["sci"] = np.log((model["sci"]+bias)/ficNumber[0][5])
        propDf["act"] = np.log((model["act"]+bias)/ficNumber[0][6])
        propDf["dra"] = np.log((model["dra"]+bias)/ficNumber[0][7])

        prop = [0, 0, 0, 0, 0, 0]

        prop[0] = pd.Series(propDf["hor"]).sum()
        prop[1] = pd.Series(propDf["mys"]).sum()
        prop[2] = pd.Series(propDf["fan"]).sum()
        prop[3] = pd.Series(propDf["sci"]).sum()
        prop[4] = pd.Series(propDf["act"]).sum()
        prop[5] = pd.Series(propDf["dra"]).sum()

        max = prop[0]
        maxIdx = 0

        for i in range(len(prop)):
            if prop[i] > max:
                max = prop[i]
                maxIdx = i
        maxIdx += 2

        self.updateFeature(maxIdx, pd.Series(model["word"]))

        end = time.time()
        print("use time " + str(end-start) + " sec")

        return maxIdx

    def updateFeature(self, category, wordList):
        cnx = DbConnection().connection

        cursor = cnx.cursor()

        catList = ["hor", "mys", "fan", "sci", "act", "dra"]

        feature = "UPDATE feature SET " + \
            catList[category-2] + " = " + catList[category-2] + \
            " + 1, total = total + 1 WHERE word = %s"

        for word in wordList:
            cursor.execute(feature, [word])

        ficNumber = "UPDATE fiction_number SET " + \
            catList[category-2] + " = " + \
            catList[category-2] + " + 1, total = total + 1"

        cursor.execute(ficNumber)

        cnx.commit()
