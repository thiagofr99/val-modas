package com.devthiagofurtado.valmodas.service;

import com.devthiagofurtado.valmodas.converter.DozerConverter;
import com.devthiagofurtado.valmodas.data.model.Permission;
import com.devthiagofurtado.valmodas.data.model.User;
import com.devthiagofurtado.valmodas.data.vo.PermissionVO;
import com.devthiagofurtado.valmodas.data.vo.UsuarioVO;
import com.devthiagofurtado.valmodas.exception.ResourceBadRequestException;
import com.devthiagofurtado.valmodas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userRepository.findByUsername(username);
        if (user != null) {
            return user;
        } else {
            throw new UsernameNotFoundException("Username " + username + " not found");
        }

    }

    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public UsuarioVO salvar(UsuarioVO user, String userName) {

        validarUsuarioAdmin(userName);

        var userSave = userRepository.save(DozerConverter.parseUsuarioVOtoUser(user));
        return DozerConverter.parseUsertoVO(userSave);


    }

    private void validarUsuarioAdmin(String userName) {
        List<Permission> permissions = findByUserName(userName).getPermissions();
        if (permissions.stream().noneMatch(p -> p.getDescription().equals(PermissionVO.ADMIN.name()))) {
            throw new ResourceBadRequestException("Apenas usuário Admin pode executar a ação.");
        }
    }

    public User findByUserName(String userName) {
        return userRepository.findByUsername(userName);
    }

    public UsuarioVO findById(Long id, String userName) {
        validarUsuarioAdmin(userName);
        return DozerConverter.parseUsertoVO(userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não localizado!")));
    }

    @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
    public void habilitarLicencaTrintaDias(Long id, String userName) {
        validarUsuarioAdmin(userName);

        var user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não localizado!"));
        var isAtivo = user.getDateLicense() == null || user.getDateLicense().isAfter(LocalDate.now());

        if (isAtivo)
            throw new ResourceBadRequestException("Usuário com licença válida, não possível habilitar nova licença.");

        user.setDateLicense(LocalDate.now().plusDays(30));
        user.setCredentialsNonExpired(true);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        userRepository.save(user);
    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRED)
    public Page<UsuarioVO> findAllByUserName(String userName, Pageable pageable, String userAdmin) {
        validarUsuarioAdmin(userAdmin);
        var page = userRepository.findAllByUserName(userName, pageable);

        return page.map(this::convertToUsuarioVO);
    }

    private UsuarioVO convertToUsuarioVO(User user) {
        return DozerConverter.parseUsertoVO(user);
    }


    public void validarUsuarioAdmGerente(String userName) {
        List<Permission> permissions = findByUserName(userName).getPermissions();
        if (permissions.stream().anyMatch(p -> p.getDescription().equals(PermissionVO.COMMON_USER.name()))) {
            throw new ResourceBadRequestException("Apenas usuário Admin ou gerente pode executar a ação.");
        }
    }

}
