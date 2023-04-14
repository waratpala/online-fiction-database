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


def category(categoryID):
    match categoryID:
        case 2:
            return 'นิยายระทึกขวัญ'
        case 3:
            return 'นิยายสืบสวน'
        case 4:
            return 'นิยายแฟนตาซี'
        case 5:
            return 'นิยายวิทยาศาสตร์'
        case 6:
            return 'นิยายแอ๊คชั่น'
        case 7:
            return 'นิยายรักดราม่า'
        case _:
            return 'ไม่พบข้อมูล'
