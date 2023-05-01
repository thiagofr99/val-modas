package com.devthiagofurtado.valmodas.service;

import com.devthiagofurtado.valmodas.converter.DozerConverter;
import com.devthiagofurtado.valmodas.data.model.Cliente;
import com.devthiagofurtado.valmodas.data.vo.ClienteDetalhadoVO;
import com.devthiagofurtado.valmodas.data.vo.ClienteVO;
import com.devthiagofurtado.valmodas.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private VendaService vendaService;

    @Autowired
    private EnderecoService enderecoService;


    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public ClienteVO salvar(ClienteVO clienteVO, String userName) {
        userService.validarUsuarioAdmGerente(userName);

        var cliente = DozerConverter.parseObject(clienteVO, Cliente.class);

        if (clienteVO.getKey() == null) {
            cliente.setCadastradoEm(LocalDateTime.now());
            cliente.setResponsavelCadastro(userName);

        } else {
            cliente.setAtualizadoEm(LocalDateTime.now());
            cliente.setResponsavelAtualizacao(userName);

        }
        var clienteSalvo = clienteRepository.save(cliente);
        enderecoService.salvar(clienteVO.getEnderecoVO(), clienteSalvo, userName);


        return DozerConverter.parseObject(clienteSalvo, ClienteVO.class);

    }


    @Transactional(readOnly = true)
    public ClienteVO buscarPorId(Long idCliente, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        var cliente = clienteRepository.findById(idCliente).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
        return DozerConverter.parseObject(cliente, ClienteVO.class);
    }

    @Transactional(readOnly = true)
    public Page<ClienteVO> buscarPorNomeOuParteDoNome(String busca, Pageable pageable, String userName) {
        userService.validarUsuarioAdmGerente(userName);

        var page = clienteRepository.findAllByClienteName(busca, pageable);

        return page.map(this::convertToFornecedorVO);
    }

    private ClienteVO convertToFornecedorVO(Cliente cliente) {
        return DozerConverter.parseObject(cliente, ClienteVO.class);
    }

    @Transactional(readOnly = true)
    public Cliente buscarEntityPorId(Long idCliente) {
        return clienteRepository.findById(idCliente).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));
    }

    @Transactional(readOnly = true)
    public ClienteDetalhadoVO buscarDetalhadoPorId(Long idCliente, String userName) {
        userService.validarUsuarioAdmGerente(userName);
        var cliente = clienteRepository.findById(idCliente).orElseThrow(() -> new ResourceNotFoundException("Não Localizou o registro pelo id."));

        var vendasVo = vendaService.listarVendasPorCliente(cliente);

        var clienteVo = DozerConverter.parseObject(cliente, ClienteVO.class);

        var enderecoVo = enderecoService.buscarPorIdCliente(cliente,userName);

        return ClienteDetalhadoVO.builder()
                .clienteVO(clienteVo)
                .vendaVOS(vendasVo)
                .enderecoVO(enderecoVo)
                .build();
    }

}
