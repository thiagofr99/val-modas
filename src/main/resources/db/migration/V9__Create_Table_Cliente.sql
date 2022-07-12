CREATE TABLE IF NOT EXISTS `cliente` (
  	`id` bigint(20) NOT NULL AUTO_INCREMENT,
	`nome_cliente` VARCHAR(100) NOT NULL,
	`telefone` VARCHAR(100)  NULL,
	`dt_atualizacao` DATE NULL,
	`dt_cadastro` DATE NULL,
	`nu_usuario_atualizacao` VARCHAR(255) NULL,
	`nu_usuario_cadastro` VARCHAR(255) NULL,
     PRIMARY KEY (`id`)
) ENGINE=InnoDB;