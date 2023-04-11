def mimetypeCheck(fileName):
    match str(fileName):
        case ".png'":
            return 'image/png'
        case '.jpg':
            return 'image/jpg'
        case ".jpeg":
            return 'image/jpeg'
        case _:
            return 1


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
