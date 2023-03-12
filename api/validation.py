import re


def registerValidation(user, password):
    pat = re.compile(r"[A-Za-z0-9]+")
    try:
        re.fullmatch(pat, user)
        re.fullmatch(pat, password)
        return False
    except re.error:
        return True
