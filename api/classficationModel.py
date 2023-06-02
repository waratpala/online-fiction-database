import pandas as pd
import numpy as np
import mysql.connector
import pythainlp
import time
import string
from scipy.stats import norm
from pythainlp.util import normalize
from pythainlp.corpus import thai_stopwords, thai_words
from mysql_con import DbConnection


class Model:
    def __init__(self, user, password, host, database):
        self.user = user
        self.password = password
        self.host = host
        self.database = database
        self.notThai = list(string.printable)+list("๑๒๓๔๕๖๗๘๙")+list("ๆ๐")
        self.stopwords = list(thai_stopwords())
        self.words_thai_dic = list(thai_words())

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

    def trainAllData(self) :
        
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
            
            text_normalize = normalize(text)
            pythai_token = pythainlp.word_tokenize(text_normalize, keep_whitespace=False)

            fictionNumber[0] += 1
            fictionNumber[dataSet[i][3]-1] += 1

            if (i == 0):
                pythaiWord = pd.DataFrame({"word":pd.DataFrame(pythai_token, columns = ["word"]).word.unique(), "genre": dataSet[i][3]})
            else:
                pythaiWord = pd.concat([pythaiWord, pd.DataFrame({"word":pd.DataFrame(pythai_token, columns = ["word"]).word.unique(), "genre": dataSet[i][3]})])
        
        
        pythaiCount = pd.DataFrame({"amount" :pythaiWord.groupby(["word", "genre"])["word"].size()}).reset_index()

        wordTable = []
        i = -1
        for index, row in pythaiCount.iterrows():
            if (len(wordTable) == 0 or wordTable[i][0] != row.word):
                i += 1
                wordTable.append([row.word]+list("0000000"))
                wordTable[i][row.genre] = row.amount
                wordTable[i][1] = row.amount
            else :
                wordTable[i][row.genre] = row.amount
                wordTable[i][1] += row.amount
                
        wordTableNoStop = [i for i in wordTable if i[0] not in self.stopwords]
        wordTableFinal = [i for i in wordTableNoStop if i[0] in self.words_thai_dic]

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

    def predictData(self, text) :
        
        if (text is None):
            return 1
        
        for letter in self.notThai:
                text = text.replace(letter, "")
            
        text_normalize = normalize(text)
        pythai_token = pythainlp.word_tokenize(text_normalize, keep_whitespace=False)
        pythaiToken_not_stopwords = [i for i in pythai_token if i not in self.stopwords]

        pythai_word = pd.DataFrame({"word":pd.DataFrame(pythaiToken_not_stopwords, columns = ["word"]).word.unique()})
        text = pd.DataFrame({"amount" :pythai_word.groupby(["word"])["word"].size()}).reset_index()
        
        feature = self.getTable("feature")
        ficNumber = self.getTable("fiction_number")
        
        feature = pd.DataFrame(feature, columns = ["word","total","hor","mys","fan","sci","act","dra"])
        
        model = text.merge(feature, on="word", how="outer")
        model['amount'] = model['amount'].fillna(0)
        
        
        propDf = pd.DataFrame(columns = ["hor","mys","fan","sci","act","dra"])
        
        bias = 0.5
        
        TF = model['amount'].sum()
        row = len(model.index)

        propDf["hor"] = np.where(model["amount"] > 0, np.log((model["hor"]+bias)/ficNumber[0][2]) * np.log(ficNumber[0][1]/model["total"]) * model["amount"]/TF, np.log((ficNumber[0][2]-model["hor"]+bias)/ficNumber[0][2]) * np.log(ficNumber[0][1]/model["total"]) * model["amount"]/TF)
        propDf["mys"] = np.where(model["amount"] > 0, np.log((model["mys"]+bias)/ficNumber[0][3]) * np.log(ficNumber[0][1]/model["total"]) * model["amount"]/TF, np.log((ficNumber[0][3]-model["mys"]+bias)/ficNumber[0][3]) * np.log(ficNumber[0][1]/model["total"]) * model["amount"]/TF)
        propDf["fan"] = np.where(model["amount"] > 0, np.log((model["fan"]+bias)/ficNumber[0][4]) * np.log(ficNumber[0][1]/model["total"]) * model["amount"]/TF, np.log((ficNumber[0][4]-model["fan"]+bias)/ficNumber[0][4]) * np.log(ficNumber[0][1]/model["total"]) * model["amount"]/TF) 
        propDf["sci"] = np.where(model["amount"] > 0, np.log((model["sci"]+bias)/ficNumber[0][5]) * np.log(ficNumber[0][1]/model["total"]) * model["amount"]/TF, np.log((ficNumber[0][5]-model["sci"]+bias)/ficNumber[0][5]) * np.log(ficNumber[0][1]/model["total"]) * model["amount"]/TF) 
        propDf["act"] = np.where(model["amount"] > 0, np.log((model["act"]+bias)/ficNumber[0][6]) * np.log(ficNumber[0][1]/model["total"]) * model["amount"]/TF, np.log((ficNumber[0][6]-model["act"]+bias)/ficNumber[0][6]) * np.log(ficNumber[0][1]/model["total"]) * model["amount"]/TF) 
        propDf["dra"] = np.where(model["amount"] > 0, np.log((model["dra"]+bias)/ficNumber[0][7]) * np.log(ficNumber[0][1]/model["total"]) * model["amount"]/TF, np.log((ficNumber[0][7]-model["dra"]+bias)/ficNumber[0][7]) * np.log(ficNumber[0][1]/model["total"]) * model["amount"]/TF) 
        
        prop = [
            {"category" : 2, "prop" : pd.Series(propDf["hor"]).sum()+np.log10(ficNumber[0][2]/ficNumber[0][1])},
            {"category" : 3, "prop" : pd.Series(propDf["mys"]).sum()+np.log10(ficNumber[0][3]/ficNumber[0][1])},  
            {"category" : 4, "prop" : pd.Series(propDf["fan"]).sum()+np.log10(ficNumber[0][4]/ficNumber[0][1])},  
            {"category" : 5, "prop" : pd.Series(propDf["sci"]).sum()+np.log10(ficNumber[0][5]/ficNumber[0][1])},  
            {"category" : 6, "prop" : pd.Series(propDf["act"]).sum()+np.log10(ficNumber[0][6]/ficNumber[0][1])},  
            {"category" : 7, "prop" : pd.Series(propDf["dra"]).sum()+np.log10(ficNumber[0][7]/ficNumber[0][1])}
        ]
        
        def  getProp(num) :
            return num["prop"] 
        
        prop.sort(key=getProp)
        
        box = []
        for i in prop:
            box.append(i["prop"])

        std = np.std(box)
        mean = np.mean(box)

        for i in range(len(box)) :
            prop[i]["prop"] = norm.cdf((box[i]-mean)/std) * 100

        maxCategory = prop[-1]
        
        subMaxCategory = prop[-2]
        
        subSubMaxCategory = prop[-3]
        
        self.updateFeature(maxCategory["category"], pd.Series(model["word"].loc[model['amount'] >= 1]))
            
        return [maxCategory, subMaxCategory, subSubMaxCategory]

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
