CREATE TABLE IF NOT EXISTS `produto` (
  	`id` bigint(20) NOT NULL AUTO_INCREMENT,
	`nome_produto` VARCHAR(100) NOT NULL,
	`codigo_barra` VARCHAR(255) NULL,
	`valor_venda` DECIMAL(10,2) NOT NULL,
	`valor_compra` DECIMAL(10,2) NOT NULL,
	`fornecedor_id` BIGINT(20) DEFAULT NULL,
	`dt_atualizacao` DATE NULL,
	`dt_cadastro` DATE NULL,
	`nu_usuario_atualizacao` VARCHAR(255) NULL,
	`nu_usuario_cadastro` VARCHAR(255) NULL,
     PRIMARY KEY (`id`),
     FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedor` (`id`)
) ENGINE=InnoDB;