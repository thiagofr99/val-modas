CREATE TABLE IF NOT EXISTS `devolucao_produto` (
  `id_endereco` bigint(20) NOT NULL,
  `id_cliente` bigint(20) NOT NULL,
  PRIMARY KEY (`id_endereco`,`id_cliente`),
  KEY `fk_endereco_cliente_cliente` (`id_cliente`),
  CONSTRAINT `fk_endereco_cliente` FOREIGN KEY (`id_endereco`) REFERENCES `endereco` (`id`),
  CONSTRAINT `fk_endereco_cliente_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`)
) ENGINE=InnoDB;