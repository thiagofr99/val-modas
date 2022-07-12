CREATE TABLE IF NOT EXISTS `venda_produto` (
  `id_venda` bigint(20) NOT NULL,
  `id_produto` bigint(20) NOT NULL,
  PRIMARY KEY (`id_venda`,`id_produto`),
  KEY `fk_venda_produto_produto` (`id_produto`),
  CONSTRAINT `fk_venda_produto` FOREIGN KEY (`id_venda`) REFERENCES `venda` (`id`),
  CONSTRAINT `fk_venda_produto_produto` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id`)
) ENGINE=InnoDB;