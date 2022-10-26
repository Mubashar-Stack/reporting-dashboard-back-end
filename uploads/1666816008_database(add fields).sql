-- MySQL dump 10.13  Distrib 8.0.29, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: database
-- ------------------------------------------------------
-- Server version	8.0.31-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `domains`
--

DROP TABLE IF EXISTS `domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domains` (
  `id` int NOT NULL AUTO_INCREMENT,
  `domainname` char(255) NOT NULL,
  `created_at` date DEFAULT NULL,
  `updated_at` date DEFAULT NULL,
  `ads_code` char(250) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domains`
--

LOCK TABLES `domains` WRITE;
/*!40000 ALTER TABLE `domains` DISABLE KEYS */;
INSERT INTO `domains` VALUES (1,'hi.com/oops1122','2022-10-05','2022-10-22','1666392926_Frame 1295 (1).png'),(2,'helloLALA.com','2022-10-22','2022-10-22',NULL),(3,'hi.com/lalaa','2022-10-22','2022-10-22',NULL),(4,'hi.com/lali','2022-10-22','2022-10-22',NULL),(5,'hi.com/laal','2022-10-22','2022-10-22',NULL),(8,'helloLALA.com','2022-10-22','2022-10-22',NULL),(9,'helloLALA.com','2022-10-22','2022-10-22','byo.py'),(10,'hi.com/oops','2022-10-22','2022-10-22','1666392759_Frame 1295 (1).png');
/*!40000 ALTER TABLE `domains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file` varchar(256) NOT NULL,
  `commission` float NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (3,'1666297347_demoData.csv',20,'2022-10-24 20:04:53','2022-10-24 20:04:53');
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Domain_name` varchar(256) NOT NULL,
  `Ad_Requests` float NOT NULL,
  `Ad_Impressions` float NOT NULL,
  `Revenue` float NOT NULL,
  `commission` float NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `eCPM` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (71,'domain-1.com',10000,1000,1,20,'2022-10-14 20:04:37','2022-10-24 20:04:37',1),(72,'domain-2.com',2,2,0,20,'2022-10-15 20:04:37','2022-10-24 20:04:37',1),(73,'domain-3.com',11316,5347,0.433,20,'2022-10-24 20:04:37','2022-10-24 20:04:37',1),(74,'domain-4.com',0,2129,0.217,20,'2022-10-24 20:04:37','2022-10-24 20:04:37',1),(75,'domain-5.com',0,0,0,20,'2022-10-24 20:04:37','2022-10-24 20:04:37',1),(76,'domain-6.com',3,1,0,20,'2022-10-24 20:04:37','2022-10-24 20:04:37',1),(77,'domain-7.com',83204,63327,4.85,20,'2022-10-24 20:04:37','2022-10-24 20:04:37',1),(78,'domain-8.com',0,0,0,20,'2022-10-24 20:04:37','2022-10-24 20:04:37',1),(79,'domain-9.com',47413,35125,3.111,20,'2022-10-16 20:04:37','2022-10-24 20:04:37',1),(80,'domain-10.com',289867,103771,23.073,20,'2022-10-24 20:04:37','2022-10-24 20:04:37',1),(81,'domain-1.com',0,0,0,20,'2022-10-24 20:04:53','2022-10-24 20:04:53',1),(82,'domain-2.com',2,2,0,20,'2022-10-24 20:04:53','2022-10-24 20:04:53',1),(83,'domain-3.com',11316,5347,0.433,20,'2022-10-22 20:04:53','2022-10-24 20:04:53',1),(84,'domain-4.com',0,2129,0.217,20,'2022-10-24 20:04:53','2022-10-24 20:04:53',1),(85,'domain-5.com',0,0,0,20,'2022-10-24 20:04:53','2022-10-24 20:04:53',1),(86,'domain-6.com',3,1,0,20,'2022-10-24 20:04:53','2022-10-24 20:04:53',1),(87,'domain-7.com',83204,63327,4.85,20,'2022-09-24 20:04:53','2022-10-24 20:04:53',1),(88,'domain-8.com',0,0,0,20,'2022-10-24 20:04:53','2022-10-24 20:04:53',1),(89,'domain-9.com',47413,35125,3.111,50,'2022-10-24 20:04:53','2022-10-24 20:04:53',1),(90,'domain-10.com',289867,103771,23.073,20,'2022-10-24 20:04:53','2022-10-24 20:04:53',1);
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(180) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `first_name` varchar(180) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `last_name` varchar(180) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `photo` varchar(1000) NOT NULL,
  `email` varchar(180) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `create_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `card_name` char(250) DEFAULT NULL,
  `card_number` char(250) DEFAULT NULL,
  `cvc` char(10) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `banck_name` varchar(100) NOT NULL,
  `bank_address` varchar(100) NOT NULL,
  `bank_ac_holder_name` varchar(100) NOT NULL,
  `account_number` varchar(255) NOT NULL,
  `IFSC_code` varchar(255) NOT NULL,
  `bank_account_holder_address` varchar(255) NOT NULL,
  `paypal_email_address` varchar(255) NOT NULL,
  `swift_bic_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','first','last','','admin@admin.com',1,'38e24912471365aed567e675b107e875',NULL,NULL,'abc','abc','abc',NULL,'abc','abac','abc','abc','abc','abc','abc',NULL),(2,'user','test','user','','user@admin.com',1,'38e24912471365aed567e675b107e875','2022-10-15 16:56:57','2022-10-15 16:56:57','abc','abc','abc',NULL,'abc','abac','abc','abc','abc','abc','abc',NULL),(3,'user','test','user','1665861696_WhatsApp Image 2022-10-09 at 5.12.44 PM.jpeg','myuser@gmail.com',1,'38e24912471365aed567e675b107e875','2022-10-15 19:21:36','2022-10-15 19:21:36','abc','abc','abc',NULL,'abc','abac','abc','abc','abc','abc','abc',NULL),(7,'user','hihifs','lalaglalag','1666418867_maxresdefault.jpg','you@mail.com',1,'hello123','2022-10-22 05:38:45','2022-10-22 06:07:47','abc','abc','abc','2022-10-15','abc','abac','abc','abc','abc','abc','abc',NULL),(9,'user','llklk','lalaglalag','1666765834_maxresdefault.jpg','you1@mail.com',1,'pass','2022-10-26 06:26:57','2022-10-26 06:30:35','master','1010101010','325','2022-10-15','special banck_name','bank_address','bank_ac_holder_name','account_number','IFSC_code','bank_account_holder_address','paypal_email_address1212',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_domains`
--

DROP TABLE IF EXISTS `users_domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_domains` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `domain_id` int NOT NULL,
  `created_at` date DEFAULT NULL,
  `updated_at` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_domains`
--

LOCK TABLES `users_domains` WRITE;
/*!40000 ALTER TABLE `users_domains` DISABLE KEYS */;
INSERT INTO `users_domains` VALUES (2,1,3,'2022-10-22','2022-10-22'),(3,2,3,'2022-10-22','2022-10-22'),(4,2,4,'2022-10-22','2022-10-22'),(5,2,5,'2022-10-22','2022-10-22');
/*!40000 ALTER TABLE `users_domains` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-26 11:39:01
