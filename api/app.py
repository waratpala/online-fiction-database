from flask import Flask, jsonify, request, make_response, send_file
from flask_cors import CORS
from functools import wraps
from model import *
from jwttoken import *
from validation import *
from common import *
from werkzeug.utils import secure_filename
from model import *
import os
import uuid
from mysql_con import DbConnection


UPLOAD_FOLDER = 'upload'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app)


def allowed(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def authenticationUser():
    def _authenticationUser(f):
        @wraps(f)
        def __authenticationUser(*args, **kwargs):

            token = None
            headers = request.headers
            bearer = headers.get('Authorization')

            if bearer:
                token = bearer .split()[1]
            if not token:
                return make_response(jsonify({"message": "A valid token is missing."}), 401)

            data = jwtDecode(token)
            if data is None:
                return make_response(jsonify({"message": "Invalid token."}), 401)
            result = f(*args, **kwargs)

            return result
        return __authenticationUser
    return _authenticationUser


def authenticationPermission():
    def _authenticationPermission(f):
        @wraps(f)
        def __authenticationPermission(*args, **kwargs):

            bearer = request.headers.get('Authorization')
            user = jwtDecode(bearer .split()[1])
            fictionID = request.view_args['fictionID']

            permission, err = VerifierPermission(fictionID, user)
            if err != None:
                return make_response(jsonify(), 404)
            if permission is None:
                return make_response(jsonify({"status": "You dont have permission in this fiction."}), 403)

            result = f(*args, **kwargs)
            return result

        return __authenticationPermission
    return _authenticationPermission


@app.route("/", methods=['GET'])
def test():
    try:
        mydb = DbConnection().connection
        mycursor = mydb.cursor(dictionary=True)

        mycursor.execute("SELECT * FROM user")
        count = mycursor.fetchall()
    except mysql.connector.Error as err:
        return make_response(jsonify({"token": str(err)}), 400)
    return make_response(jsonify({"token": count}), 200)


@app.route("/login", methods=['GET'])
def LoginAPI():
    username = request.form['username']
    password = request.form['password']

    userID, err = VerifierUser(username, password)
    if err != None:
        return make_response(jsonify(), 404)
    if userID is None:
        return make_response(jsonify({"status": "username ro password was wrong."}), 403)

    token = jwtEncode(userID)
    res = make_response(jsonify({"token": token}), 200)

    return res


@app.route("/login", methods=['Post'])
def NewUserAPI():

    username = request.form['username']
    password = request.form['password']

    if username is None:
        return make_response(jsonify({"status": "username is empty."}), 400)
    if password is None:
        return make_response(jsonify({"status": "password is empty."}), 400)
    if registerValidation(username, password):
        return make_response(jsonify({"status": "English letters and numbers only."}), 400)

    userID, err = NewUser(username, password)
    if err != None:
        if err.errno == 1062:
            return make_response(jsonify({"status": "Duplicate Name"}), 400)
        return make_response(jsonify({"token": str(err)}), 404)

    token = jwtEncode({"user": userID})
    res = make_response(jsonify({"token": token}), 201)

    return res


@app.route("/fiction", methods=['GET'])
def GetFictionListAPI():

    page = request.args.get('page')
    limit = request.args.get('limit')
    sort = request.args.get('sort')
    filterDB = request.args.get('filter')
    search = request.args.get('search')

    try:
        page = int(page)
        limit = int(limit)
        if (filterDB):
            filterDB = int(filterDB)
        if (filterDB == ""):
            filterDB = None
    except TypeError as err:
        return make_response(jsonify({"status": "TypeError"}), 400)

    sort = "fictionID " + sort

    result, err = GetFictionList(page, limit, filterDB, sort, search)
    if err != None:
        if (type(err) == 'str'):
            return make_response(jsonify({"status": err}), 400)
        return make_response(jsonify({"status": str(err)}), 404)

    return make_response(jsonify(result), 200)


@app.route("/info/<fiction>", methods=['GET'])
def GetFictionAPI(fiction):

    result, err = GetFiction(fiction)
    if err != None:
        return make_response(jsonify(), 404)

    return make_response(jsonify(result), 200)


@app.route("/<fiction>", methods=['GET'])
def GetChapterAPI(fiction):

    page = request.args.get('page')
    limit = request.args.get('limit')
    sort = request.args.get('sort')
    try:
        page = int(page)
        limit = int(limit)
    except TypeError as err:
        return make_response(jsonify({"status": "TypeError"}), 400)

    sort = "chapter " + sort

    result, err = GetChapter(page, limit, sort, fiction)
    if err != None:
        if (type(err) == 'str'):
            return make_response(jsonify({"status": str(err)}), 400)
        return make_response(jsonify(), 404)

    return make_response(jsonify(result))


@app.route("/content/<chapterID>", methods=['GET'])
def GetContentAPI(chapterID):

    result, err = GetContent(chapterID)
    if err != None:
        return make_response(jsonify(), 404)

    return make_response(jsonify(result))


@app.route("/writer", methods=['GET'])
@authenticationUser()
def GetWriterFictionListAPI():

    bearer = request.headers.get('Authorization')
    user = jwtDecode(bearer .split()[1])

    page = request.args.get('page')
    limit = request.args.get('limit')
    sort = request.args.get('sort')
    filterDB = request.args.get('filter')
    search = request.args.get('search')

    try:
        page = int(page)
        limit = int(limit)
        if (filterDB):
            filterDB = int(filterDB)
        if (filterDB == ""):
            filterDB = None
        if search == None:
            search = ""
    except TypeError as err:
        return make_response(jsonify({"status": "TypeError"}), 400)

    sort = "fictionID " + sort

    result, err = GetWriterFiction(
        page, limit, filterDB, sort, search, user['sub']['user'])
    if err != None:
        if (type(err) == 'str'):
            return make_response(jsonify({"status": str(err)}), 400)
        return make_response(jsonify({"status": str(err)}), 404)

    return make_response(jsonify(result))


@app.route("/image/<imageName>", methods=['GET'])
def GetImageAPI(imageName):

    x, file_extension = os.path.splitext(imageName)
    type = mimetypeCheck(file_extension)
    filePath = os.path.join(
        UPLOAD_FOLDER, imageName)
    return send_file(filePath, mimetype=type)


@ app.route("/writer", methods=['POST'])
@ authenticationUser()
def AddNewFictionAPI():
    bearer = request.headers.get('Authorization')
    user = jwtDecode(bearer .split()[1])

    fictionName = request.form['fiction_name']
    if fictionName is None:
        return make_response(jsonify({"status": "fiction_name is empty"}), 400)
    filename = str(uuid.uuid4())
    file = request.files['fiction_image']
    url = None
    if (file):
        file_name, file_extension = os.path.splitext(file.filename)
        if not allowed(file.filename):
            return make_response(jsonify({"status": "File allowed type 'png', 'jpg', 'jpeg'"}), 400)

        file.filename = filename+file_extension
        filePath = os.path.join(UPLOAD_FOLDER,
                                secure_filename(file.filename))
        file.save(filePath)
        url = "http://127.0.0.1:5000/image/" + file.filename

    err = NewFiction(
        fictionName, user["sub"]['user'], url)

    if err != None:
        return make_response(jsonify(), 404)

    return make_response({"status": "OK"}, 201)


@ app.route("/writer/<fictionID>/<chapter>", methods=['POST'])
@ authenticationUser()
@ authenticationPermission()
def AddNewChapterAPI(fictionID, chapter):

    title = request.form['title']
    content = request.form['content']
    if title is None:
        return make_response(jsonify({"status": "title is empty."}), 400)
    if content is None:
        return make_response(jsonify({"status": "content is empty."}), 400)
    if len(content) < 3000:
        return make_response(jsonify({"status": "content less than 3,000 characters."}), 400)

    category = 1
    err = NewChapter(fictionID, chapter, title, content, category)
    if err != None:
        return make_response(jsonify(), 404)

    return make_response({"status": "OK"}, 201)


@ app.route("/writer/<fictionID>/<chapter>", methods=['PUT'])
@ authenticationUser()
@ authenticationPermission()
def UpdateNewChapterAPI(fictionID, chapter):

    title = request.form['title']
    content = request.form['content']

    err = UpdateChapter(fictionID, chapter, title, content)
    if err != None:
        return make_response(jsonify(), 404)

    return make_response({"status": "OK"}, 201)


@ app.route("/writer/<fictionID>/<chapter>", methods=['DELETE'])
@ authenticationUser()
@ authenticationPermission()
def DeteleNewChapterAPI(fictionID, chapter):

    err = DeleteChapter(fictionID, chapter)
    if err != None:
        return make_response(jsonify(), 404)

    return make_response({"status": "OK"}, 200)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
