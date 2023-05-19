from flask import Flask, jsonify, request, make_response, send_file
from flask_cors import CORS
from functools import wraps
from model import *
from jwttoken import *
from validation import *
from classficationModel import *
from common import *
from werkzeug.utils import secure_filename
from model import *
import os
import uuid
from mysql_con import DbConnection


UPLOAD_FOLDER = 'upload'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__)

# CORS(app, supports_credentials=True)
# cors = CORS(app, resources={
#     r'/*': {
#             "Access-Control-Allow-Origin": [
#                 'http://localhost:3000',  # React
#                 'http://127.0.0.1:3000',  # React
#             ],
#             "Access-Control-Allow-Credentials": True,
#             'supports_credentials': True
#             },
# },
#     supports_credentials=True,
#     expose_headers="*")

CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def authenticationUser():
    def _authenticationUser(f):
        @ wraps(f)
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
        @ wraps(f)
        def __authenticationPermission(*args, **kwargs):

            bearer = request.headers.get('Authorization')
            user = jwtDecode(bearer .split()[1])
            fictionID = request.view_args['fictionID']

            permission, err = VerifierPermission(
                fictionID, user['sub']['user'])
            if err != None:
                return make_response(jsonify(str(err)), 500)
            if permission is None:
                return make_response(jsonify({"status": "You dont have permission in this fiction."}), 403)

            result = f(*args, **kwargs)
            return result

        return __authenticationPermission
    return _authenticationPermission


@ app.route("/user", methods=['GET'])
@ authenticationUser()
def getUser():
    bearer = request.headers.get('Authorization')
    id = jwtDecode(bearer .split()[1])
    user, err = GetUser(id['sub']['user'])
    if err != None:
        return make_response(jsonify(str(err)), 500)
    return make_response(jsonify(user), 200)


@ app.route("/login", methods=['Post'])
def LoginAPI():

    try:
        username = request.form['username']
    except:
        return make_response(jsonify({"status": "request form username."}), 400)

    try:
        password = request.form['password']
    except:
        return make_response(jsonify({"status": "request form password."}), 400)

    username = username.strip()
    password = password.strip()

    if username is None or username == '':
        return make_response(jsonify({"status": "username is empty."}), 400)
    if password is None or password == '':
        return make_response(jsonify({"status": "password is empty."}), 400)

    userID, err = VerifierUser(username, password)
    if err != None:
        return make_response(jsonify(str(err)), 500)
    if userID is None:
        return make_response(jsonify({"status": "username ro password was wrong."}), 404)

    token = jwtEncode(userID)
    res = make_response(jsonify({"token": token}), 200)

    return res


@ app.route("/register", methods=['Post'])
def NewUserAPI():

    try:
        username = request.form['username']
    except:
        return make_response(jsonify({"status": "request form username."}), 400)

    try:
        password = request.form['password']
    except:
        return make_response(jsonify({"status": "request form password."}), 400)

    username = username.strip()
    password = password.strip()

    if username is None or username == '':
        return make_response(jsonify({"status": "username is empty."}), 400)
    if password is None or password == '':
        return make_response(jsonify({"status": "password is empty."}), 400)

    if registerValidation(username, password):
        return make_response(jsonify({"status": "English letters and numbers only."}), 400)

    userID, err = NewUser(username, password)
    if err != None:
        if err.errno == 1062:
            return make_response(jsonify({"status": "Duplicate Name"}), 400)
        return make_response(jsonify({"token": str(err)}), 500)

    token = jwtEncode({"user": userID})
    res = make_response(jsonify({"token": token}), 201)

    return res


@ app.route("/fiction", methods=['GET'])
def GetFictionListAPI():

    page = request.args.get('page')
    limit = request.args.get('limit')
    sort = request.args.get('sort')
    filterDB = request.args.get('filter', default=None, type=None)
    search = request.args.get('search')

    try:
        page = int(page)
        limit = int(limit)
    except TypeError as err:
        return make_response(jsonify({"status": "TypeError"}), 400)

    if filterDB == '':
        filterDB = None

    if (filterDB):
        try:
            filterDB = int(filterDB)
        except:
            return make_response(jsonify({"status": "TypeError"}), 400)

    sort = "fictionID " + sort

    result, err = GetFictionList(page, limit, filterDB, sort, search)
    if err != None:
        if (type(err) == 'str'):
            return make_response(jsonify({"status": err}), 400)
        return make_response(jsonify({"status": str(err)}), 500)

    return make_response(jsonify(result), 200)


@ app.route("/fiction/name/<fictionID>", methods=['PUT'])
@ authenticationUser()
@ authenticationPermission()
def UpdateFictionNameAPI(fictionID):

    try:
        title = request.form['title']
    except:
        return make_response(jsonify({'status': 'request form tile'}), 400)

    if title is None or title == "":
        return make_response(jsonify({'status': 'title is empty'}), 400)

    err = UpdateFictionName(fictionID, title)
    if err != None:
        return make_response(jsonify(str(err)), 500)

    return make_response({"status": "OK"}, 201)


@ app.route("/fiction/image/<fictionID>", methods=['PUT'])
@ authenticationUser()
@ authenticationPermission()
def UpdateFictionImageAPI(fictionID):

    file = request.files['fiction_image']

    Image, err = GetImageName(fictionID)
    if err != None:
        return make_response(jsonify(str(err)), 500)

    filename = str(uuid.uuid4())
    file = request.files['fiction_image']
    if (file):
        file_name, file_extension = os.path.splitext(file.filename)
        if not allowed(file.filename):
            return make_response(jsonify({"status": "File allowed type 'png', 'jpg', 'jpeg'"}), 400)

        file.filename = filename+file_extension
        filePath = os.path.join(UPLOAD_FOLDER,
                                secure_filename(file.filename))
        file.save(filePath)
        url = 'http://127.0.0.1:5000/image/' + file.filename
    else:
        url = 'http://127.0.0.1:5000/image/default.jpg'

    err = UpdateImagePath(fictionID, url)
    if err != None:
        return make_response(jsonify(str(err)), 500)

    if (Image != "default.jpg"):
        os.remove(os.path.join(UPLOAD_FOLDER,
                               secure_filename(Image)))

    return make_response({"status": "ok"}, 201)


@ app.route("/<fictionID>", methods=['GET'])
def GetChapterAPI(fictionID):

    sort = "chapter " + request.args.get('sort')

    result, err = GetChapter(sort, fictionID)
    if err != None:
        if (type(err) == 'str'):
            return make_response(jsonify({"status": str(err)}), 400)
        return make_response(jsonify(str(err)), 500)

    return make_response(jsonify(result))


@ app.route("/writer/<fictionID>", methods=['GET'])
@ authenticationUser()
@ authenticationPermission()
def GetWriterChapterAPI(fictionID):

    sort = "chapter " + request.args.get('sort')

    result, err = GetChapter(sort, fictionID)
    if err != None:
        if (type(err) == 'str'):
            return make_response(jsonify({"status": str(err)}), 400)
        return make_response(jsonify(str(err)), 500)

    return make_response(jsonify(result))


@ app.route("/content/<chapterID>", methods=['GET'])
def GetContentAPI(chapterID):

    result, err = GetContent(chapterID)
    if err != None:
        return make_response(jsonify(str(err)), 500)

    return make_response(jsonify(result))


@ app.route("/writer", methods=['GET'])
@ authenticationUser()
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
        if search == None:
            search = ""
    except TypeError as err:
        return make_response(jsonify({"status": "TypeError"}), 400)

    if filterDB == '':
        filterDB = None

    if (filterDB):
        try:
            filterDB = int(filterDB)
        except:
            return make_response(jsonify({"status": "TypeError"}), 400)

    sort = "fictionID " + sort

    result, err = GetWriterFiction(
        page, limit, filterDB, sort, search, user['sub']['user'])
    if err != None:
        if (type(err) == 'str'):
            return make_response(jsonify({"status": str(err)}), 400)
        return make_response(jsonify({"status": str(err)}), 500)

    return make_response(jsonify(result))


@app.route("/image/<imageName>", methods=['GET'])
def GetImageAPI(imageName):

    x, file_extension = os.path.splitext(imageName)
    type = mimetypeCheck(file_extension.lower())
    filePath = os.path.join(
        UPLOAD_FOLDER, imageName)
    if (os.path.isfile(filePath)):
        return send_file(filePath, mimetype=type)
    return make_response(jsonify(), 404)


@ app.route("/writer", methods=['POST'])
@ authenticationUser()
def AddNewFictionAPI():
    bearer = request.headers.get('Authorization')
    user = jwtDecode(bearer .split()[1])

    try:
        fictionName = request.form['fiction_name']
    except:
        return make_response(jsonify({'status': 'request form fiction_name'}), 400)

    if fictionName is None or fictionName == '':
        return make_response(jsonify({"status": "fiction_name is empty"}), 400)
    filename = str(uuid.uuid4())

    try:
        file = request.files['fiction_image']
    except:
        file = None

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
        return make_response(jsonify(str(err)), 500)

    return make_response({"status": "OK"}, 201)


@ app.route("/writer/<fictionID>", methods=['POST'])
@ authenticationUser()
@ authenticationPermission()
def AddNewChapterAPI(fictionID):

    try:
        title = request.form['title']
    except:
        return make_response(jsonify({'status': 'request form title'}), 400)

    try:
        content = request.form['content']
    except:
        return make_response(jsonify({'status': 'request form content'}), 400)

    if title is None or title == "":
        return make_response(jsonify({"status": "title is empty."}), 400)
    if content is None or content == "":
        return make_response(jsonify({"status": "content is empty."}), 400)
    if len(content.replace(" ", "")) < 3000:
        return make_response(jsonify({"status": "content less than 3,000 characters."}), 400)

    model = Model("user", "password", "host", "database")
    category = model.predictData(content)

    err = NewChapter(fictionID, title, content, category)
    if err != None:
        return make_response(jsonify(str(err)), 500)

    return make_response({"status": "OK"}, 201)


@ app.route("/writer/<fictionID>/<chapterID>", methods=['PUT'])
@ authenticationUser()
@ authenticationPermission()
def UpdateChapterAPI(fictionID, chapterID):

    try:
        title = request.form['title']
    except:
        return make_response(jsonify({'status': 'request form title'}), 400)

    try:
        content = request.form['content']
    except:
        return make_response(jsonify({'status': 'request form content'}), 400)

    err = UpdateChapter(chapterID, title, content)
    if err != None:
        return make_response(jsonify(str(err)), 500)

    return make_response({"status": "OK"}, 201)


@ app.route("/writer/<fictionID>/<chapterID>", methods=['DELETE'])
@ authenticationUser()
@ authenticationPermission()
def DeteleChapterAPI(fictionID, chapterID):

    err = DeleteChapter(chapterID)
    if err != None:
        return make_response(jsonify(str(err)), 500)

    return make_response({"status": "OK"}, 200)


@ app.route("/writer/<fictionID>", methods=['DELETE'])
@ authenticationUser()
@ authenticationPermission()
def DeteleFictionAPI(fictionID):

    err = DeleteFiction(fictionID)
    if err != None:
        return make_response(jsonify(str(err)), 500)

    return make_response({"status": "OK"}, 200)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
