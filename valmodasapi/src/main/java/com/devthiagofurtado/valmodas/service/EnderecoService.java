package com.devthiagofurtado.valmodas.service;

import com.devthiagofurtado.valmodas.converter.DozerConverter;
import com.devthiagofurtado.valmodas.data.model.Cliente;
import com.devthiagofurtado.valmodas.data.model.Endereco;
import com.devthiagofurtado.valmodas.data.vo.EnderecoVO;
import com.devthiagofurtado.valmodas.repository.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private UserService userService;


    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public EnderecoVO salvar(EnderecoVO enderecoVO, Cliente cliente, String userName) {
        userService.validarUsuarioAdmGerente(userName);

        var endereco = DozerConverter.parseObject(enderecoVO, Endereco.class);

        if (enderecoVO.getKey() == null) {
            endereco.setCadastradoEm(LocalDateTime.now());
            endereco.setResponsavelCadastro(userName);
            endereco.setCliente(cliente);
        } else {
            endereco.setAtualizadoEm(LocalDateTime.now());
            endereco.setResponsavelAtualizacao(userName);
            endereco.setCliente(cliente);
        }
        var enderecoSalvo = enderecoRepository.save(endereco);
        return DozerConverter.parseObject(enderecoSalvo, EnderecoVO.class);

    }


    @Transactional(readOnly = true)
    public EnderecoVO buscarPorId(Long idEndereco, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        var endereco = enderecoRepository.findById(idEndereco).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
        return DozerConverter.parseObject(endereco, EnderecoVO.class);
    }

    @Transactional(readOnly = true)
    public Page<EnderecoVO> buscarPorNomeOuParteDoNome(String busca, Pageable pageable, String userName) {
        userService.validarUsuarioAdmGerente(userName);

        var page = enderecoRepository.findAllByEnderecoName(busca, pageable);

        return page.map(this::convertToEnderecoVO);
    }

    private EnderecoVO convertToEnderecoVO(Endereco endereco) {
        return DozerConverter.parseObject(endereco, EnderecoVO.class);
    }

    @Transactional(readOnly = true)
    public Endereco buscarEntityPorId(Long idEndereco) {
        return enderecoRepository.findById(idEndereco).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
    }
/*
    @Transactional(readOnly = true)
    public ClienteDetalhadoVO buscarDetalhadoPorId(Long idCliente, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        var cliente = clienteRepository.findById(idCliente).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));

        var vendasVo = vendaService.listarVendasPorCliente(cliente);

        var clienteVo = DozerConverter.parseObject(cliente, ClienteVO.class);


        return ClienteDetalhadoVO.builder()
                .clienteVO(clienteVo)
                .vendaVOS(vendasVo)
                .build();
    }
*/
}
