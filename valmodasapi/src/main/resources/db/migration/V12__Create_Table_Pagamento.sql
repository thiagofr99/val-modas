CREATE TABLE IF NOT EXISTS `pagamento` (
  	`id` bigint(20) NOT NULL AUTO_INCREMENT,
  	`venda_id` BIGINT(20) DEFAULT NULL,
  	`forma_pagamento` varchar(80) DEFAULT NULL,
  	`valor_pagamento` DECIMAL(10,2) NOT NULL,
  	`numero_parcelas` INTEGER NULL,
	`dt_atualizacao` DATE NULL,
	`dt_cadastro` DATE NULL,
	`nu_usuario_atualizacao` VARCHAR(255) NULL,
	`nu_usuario_cadastro` VARCHAR(255) NULL,
     PRIMARY KEY (`id`),
     FOREIGN KEY (`venda_id`) REFERENCES `venda` (`id`)
) ENGINE=InnoDB;