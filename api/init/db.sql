/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `category` (
  `categoryID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100),
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `fiction` (
  `fictionID` int NOT NULL AUTO_INCREMENT,
  `fictionName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `categoryID` int DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `writer` int NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`fictionID`),
  KEY `categoryID` (`categoryID`),
  CONSTRAINT `fiction_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `category` (`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `chapter` (
  `chapterID` int NOT NULL AUTO_INCREMENT,
  `fictionID` int DEFAULT NULL,
  `chapter` int DEFAULT NULL,
  `categoryID` int DEFAULT NULL,
  `Title` varchar(1000) DEFAULT NULL,
  `Content` mediumtext,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`chapterID`),
  KEY `fictionID` (`fictionID`),
  KEY `categoryID` (`categoryID`),
  CONSTRAINT `chapter_ibfk_1` FOREIGN KEY (`fictionID`) REFERENCES `fiction` (`fictionID`),
  CONSTRAINT `chapter_ibfk_2` FOREIGN KEY (`categoryID`) REFERENCES `category` (`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feature` (
  `word` varchar(100) NOT NULL,
  `total` int DEFAULT '0',
  `hor` int DEFAULT '0',
  `mys` int DEFAULT '0',
  `fan` int DEFAULT '0',
  `sci` int DEFAULT '0',
  `act` int DEFAULT '0',
  `dra` int DEFAULT '0',
  PRIMARY KEY (`word`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `fiction_number` (
  `id` int(11) NOT NULL primary key,
  `total` int(11) DEFAULT 0,
  `hor` int(11) DEFAULT 0,
  `mys` int(11) DEFAULT 0,
  `fan` int(11) DEFAULT 0,
  `sci` int(11) DEFAULT 0,
  `act` int(11) DEFAULT 0,
  `dra` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;


CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `category` (`categoryID`, `name`) VALUES
(1, 'ไม่พบข้อมูล');
INSERT INTO `category` (`categoryID`, `name`) VALUES
(2, 'นิยายระทึกขวัญ');
INSERT INTO `category` (`categoryID`, `name`) VALUES
(3, 'นิยายสืบสวน');
INSERT INTO `category` (`categoryID`, `name`) VALUES
(4, 'นิยายแฟนตาซี'),
(5, 'นิยายวิทยาศาสตร์'),
(6, 'นิยายบู๊ แอ๊คชั่น'),
(7, 'นิยายรักดราม่า');

INSERT INTO `user` (`user_name`, `password`) VALUES
('x', 'x');








/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;