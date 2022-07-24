CREATE TABLE IF NOT EXISTS `venda` (
  	`id` bigint(20) NOT NULL AUTO_INCREMENT,
	`cliente_id` BIGINT(20) DEFAULT NULL,
	`valor_total` DECIMAL(10,2) NOT NULL,
	`desconto` DECIMAL(10,2) NOT NULL,
	`sub_total` DECIMAL(10,2) NOT NULL,
	`dt_atualizacao` DATE NULL,
	`dt_cadastro` DATE NULL,
	`nu_usuario_atualizacao` VARCHAR(255) NULL,
	`nu_usuario_cadastro` VARCHAR(255) NULL,
     PRIMARY KEY (`id`),
     FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`)
) ENGINE=InnoDB;