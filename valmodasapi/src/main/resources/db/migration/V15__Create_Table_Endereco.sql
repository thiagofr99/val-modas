CREATE TABLE IF NOT EXISTS `endereco` (
  	`id` bigint(20) NOT NULL AUTO_INCREMENT,
	`nome_rua` VARCHAR(100) NOT NULL,
	`numero` VARCHAR(100)  NULL,
    `bairro` VARCHAR(100)  NULL,
    `cep` VARCHAR(100)  NULL,
    `complemento` VARCHAR(100)  NULL,
	`dt_atualizacao` DATE NULL,
	`dt_cadastro` DATE NULL,
	`nu_usuario_atualizacao` VARCHAR(255) NULL,
	`nu_usuario_cadastro` VARCHAR(255) NULL,
     PRIMARY KEY (`id`)
) ENGINE=InnoDB;