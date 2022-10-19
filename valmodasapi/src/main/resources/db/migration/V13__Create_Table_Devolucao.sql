CREATE TABLE IF NOT EXISTS `devolucao` (
  	`id` bigint(20) NOT NULL AUTO_INCREMENT,
	`venda_id` BIGINT(20) DEFAULT NULL,
	`valor_devolucao` DECIMAL(10,2) NOT NULL,
	`dt_atualizacao` DATE NULL,
	`dt_cadastro` DATE NULL,
	`nu_usuario_atualizacao` VARCHAR(255) NULL,
	`nu_usuario_cadastro` VARCHAR(255) NULL,
     PRIMARY KEY (`id`),
     FOREIGN KEY (`venda_id`) REFERENCES `venda` (`id`)
) ENGINE=InnoDB;