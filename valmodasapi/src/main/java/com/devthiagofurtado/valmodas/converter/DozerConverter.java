package com.devthiagofurtado.valmodas.converter;

import com.devthiagofurtado.valmodas.data.model.*;
import com.devthiagofurtado.valmodas.data.vo.*;
import com.devthiagofurtado.valmodas.service.ClienteService;
import com.github.dozermapper.core.DozerBeanMapperBuilder;
import com.github.dozermapper.core.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class DozerConverter {

    private static Mapper mapper = DozerBeanMapperBuilder.buildDefault();

    public static <O, D> D parseObject(O origin, Class<D> destination) {

        return mapper.map(origin, destination);
    }

    public static <O, D> List<D> parseListObjects(List<O> origin, Class<D> destination) {

        return origin.stream().map(o -> mapper.map(o, destination)).collect(Collectors.toList());

    }

    public static <O, D> Page<D> parsePageObjects(Page<O> origin, Class<D> destination) {

        return new PageImpl<>(origin.stream().map(o -> mapper.map(o, destination)).collect(Collectors.toList()));

    }

    public static User parseUsuarioVOtoUser(UsuarioVO user) {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(16);
        String result = bCryptPasswordEncoder.encode(user.getPassword());
        User user1 = new User();
        user1.setId( user.getKey()==null || user.getKey()==0 ? null: user.getKey());
        user1.setUserName(user.getUserName());
        user1.setFullName(user.getFullName());
        user1.setPassword(result);
        var testeData = user.getDateLicense() != null && (user.getDateLicense().compareTo(LocalDate.now()) > 0);
        user1.setAccountNonExpired(testeData);
        user1.setAccountNonLocked(testeData);
        user1.setCredentialsNonExpired(testeData);
        user1.setDateLicense( user.getDateLicense() == null ? LocalDate.now(): user.getDateLicense());
        user1.setPermissions(
                user.getPermissions().stream().map(DozerConverter::permissionVOToEntity).collect(Collectors.toList())
        );
        user1.setEnabled(true);
        return user1;
    }

    public static UsuarioVO parseUsertoVO(User user) {
        return UsuarioVO.builder()
                .key(user.getId())
                .userName(user.getUserName())
                .fullName(user.getFullName())
                .permissions(
                        user.getPermissions().stream().map(
                                p-> PermissionVO.retornar(p.getId().intValue())
                        ).collect(Collectors.toList())
                )
                .dateLicense(user.getDateLicense())
                .enabled(true)
                .build();
    }

    public static Permission permissionVOToEntity(PermissionVO vo) {
        Permission permission = new Permission();
        permission.setId(vo.getCodigo().longValue());
        permission.setDescription(vo.name());
        return permission;
    }

    public static Venda vendaVOToEntity(VendaVO vo, Cliente cliente) {

        return Venda.builder()
                .cliente(cliente)
                .produtos( vo.getProdutosVOS().stream().map(p-> DozerConverter.parseObject(p, Produto.class)).collect(Collectors.toList()) )
                .desconto(vo.getDesconto())
                .id( vo.getKey() )
                .build();

    }

    public static VendaVO vendaToVO(Venda venda, List<PagamentoVO> pagamentoVOS) {
        return VendaVO.builder()
                .cadastradoEm(venda.getCadastradoEm())
                .atualizadoEm(venda.getAtualizadoEm())
                .responsavelCadastro(venda.getResponsavelCadastro())
                .responsavelAtualizacao(venda.getResponsavelAtualizacao())
                .clienteId( venda.getCliente().getId() )
                .desconto(venda.getDesconto())
                .valorTotal(venda.getValorTotal())
                .subTotal(venda.getSubTotal())
                .pagamentoVOS(pagamentoVOS)
                .produtosVOS( venda.getProdutos().stream().map(p-> DozerConverter.parseObject(p, ProdutoVO.class)).collect(Collectors.toList()) )
                .key( venda.getId() )
                .build();

    }

    public static Pagamento pagamentoVOToEntity(PagamentoVO vo, Venda venda) {

        return Pagamento.builder()
                .venda(venda)
                .formaPagamentos(vo.getFormaPagamentos())
                .valorPagamento(vo.getValorPagamento())
                .numeroParcelas(vo.getNumeroParcelas())
                .id( vo.getKey() )
                .build();

    }

    public static PagamentoVO pagamentoToVO(Pagamento pagamento) {
        return PagamentoVO.builder()
                .vendaId( pagamento.getVenda().getId() )
                .formaPagamentos(pagamento.getFormaPagamentos())
                .valorPagamento(pagamento.getValorPagamento())
                .numeroParcelas(pagamento.getNumeroParcelas())
                .key( pagamento.getId() )
                .build();

    }

}
