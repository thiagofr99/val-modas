CREATE TABLE IF NOT EXISTS `devolucao_produto` (
  `id_devolucao` bigint(20) NOT NULL,
  `id_produto` bigint(20) NOT NULL,
  PRIMARY KEY (`id_devolucao`,`id_produto`),
  KEY `fk_devolucao_produto_produto` (`id_produto`),
  CONSTRAINT `fk_devolucao_produto` FOREIGN KEY (`id_devolucao`) REFERENCES `devolucao` (`id`),
  CONSTRAINT `fk_devolucao_produto_produto` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id`)
) ENGINE=InnoDB;