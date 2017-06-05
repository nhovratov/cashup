
DROP DATABASE IF EXISTS home;
CREATE DATABASE home
  CHARACTER SET = 'utf8'
  COLLATE = 'utf8_general_ci';

CREATE TABLE IF NOT EXISTS person (
  id_person INT UNSIGNED          AUTO_INCREMENT PRIMARY KEY,
  vorname   VARCHAR(255) NOT NULL DEFAULT '',
  nachname  VARCHAR(255) NOT NULL DEFAULT ''
)
  ENGINE = InnoDB, AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS category (
  id_category INT UNSIGNED          AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL DEFAULT ''
)
  ENGINE = InnoDB, AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS amount (
  id_amount   INT UNSIGNED            AUTO_INCREMENT PRIMARY KEY,
  value       FLOAT UNSIGNED NOT NULL DEFAULT 0,
  date        DATE           NOT NULL,
  id_person   INT UNSIGNED   NOT NULL,
  id_category INT UNSIGNED   NOT NULL,
  CONSTRAINT `fk_amount_person`
  FOREIGN KEY (id_person) REFERENCES person (id_person)
    ON DELETE CASCADE,
  CONSTRAINT `fk_amount_category`
  FOREIGN KEY (id_category) REFERENCES category (id_category)
)
  ENGINE = InnoDB, AUTO_INCREMENT = 1;
