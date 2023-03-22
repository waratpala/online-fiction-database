CREATE DATABASE main;

USE main;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `category` (
  `categoryID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

CREATE TABLE `fiction` (
  `fictionID` int NOT NULL AUTO_INCREMENT,
  `fictionName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `categoryID` int DEFAULT NULL,
  `picture` varchar(255),
  `writer` int NOT NULL,
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
  PRIMARY KEY (`chapterID`),
  KEY `fictionID` (`fictionID`),
  KEY `categoryID` (`categoryID`),
  CONSTRAINT `chapter_ibfk_1` FOREIGN KEY (`fictionID`) REFERENCES `fiction` (`fictionID`),
  CONSTRAINT `chapter_ibfk_2` FOREIGN KEY (`categoryID`) REFERENCES `category` (`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feature` (
  `word` varchar(100) NOT NULL,
  `total` int DEFAULT 0,
  `hor` int DEFAULT 0,
  `mys` int DEFAULT 0,
  `fan` int DEFAULT 0,
  `sci` int DEFAULT 0,
  `act` int DEFAULT 0,
  `dra` int DEFAULT 0,
  PRIMARY KEY (`word`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;