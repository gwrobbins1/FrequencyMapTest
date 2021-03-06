CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Sensors` (
  `SID` INT NOT NULL,
  `Latitude` DOUBLE NULL,
  `Longitude` DOUBLE NULL,
  PRIMARY KEY (`SID`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `mydb`.`Recorded_Data` (
  `Index` INT NOT NULL AUTO_INCREMENT,
  `SID` INT NULL,
  `TIME` DATETIME NULL,
  `Completed` TINYINT(1) NOT NULL,
  `Frequency` DOUBLE NULL,
  `Readings` DOUBLE NULL,
  PRIMARY KEY (`Index`));

CREATE TABLE IF NOT EXISTS `mydb`.`Live_Data` (
  `SID` INT NULL,
  `TIME` DATETIME NULL,
  `Completed` TINYINT(1) NOT NULL,  
  `Frequency` DOUBLE NULL,
  `Readings` DOUBLE NULL,
  PRIMARY KEY (`SID`,`Frequency`));