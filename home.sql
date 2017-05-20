DROP DATABASE IF EXISTS home;
CREATE DATABASE home
	CHARACTER SET = 'utf8'
	COLLATE = 'utf8_general_ci';

CREATE TABLE IF NOT EXISTS person (
	id_person int unsigned AUTO_INCREMENT PRIMARY KEY,
	vorname varchar(255) NOT NULL DEFAULT '',
	nachname varchar(255) NOT NULL DEFAULT ''
) engine = InnoDB, AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS category (
	id_category int unsigned AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL DEFAULT ''
) engine = InnoDB, AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS amount (
	id_amount int unsigned AUTO_INCREMENT PRIMARY KEY,
	value float unsigned NOT NULL DEFAULT 0,
	date date NOT NULL,
	id_person int unsigned NOT NULL,
	id_category int unsigned NOT NULL,
	CONSTRAINT `fk_amount_person`
		FOREIGN KEY (id_person) REFERENCES person (id_person)
		ON DELETE CASCADE,
	CONSTRAINT `fk_amount_category`
		FOREIGN KEY (id_category) REFERENCES category (id_category)
) engine = InnoDB, AUTO_INCREMENT = 1;
