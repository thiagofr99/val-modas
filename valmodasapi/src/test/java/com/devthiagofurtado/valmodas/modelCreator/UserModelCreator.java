package com.devthiagofurtado.valmodas.modelCreator;

import com.devthiagofurtado.valmodas.data.model.Permission;
import com.devthiagofurtado.valmodas.data.model.User;
import com.devthiagofurtado.valmodas.data.vo.PermissionVO;
import com.devthiagofurtado.valmodas.data.vo.UsuarioVO;
import com.devthiagofurtado.valmodas.modelCreator.jsonTest.UsuarioVOJsonTest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class UserModelCreator {

    public static User cadastrado(LocalDate licenca, List<Permission> permissions, boolean enabled){
        User user = new User();
        user.setId(1L);
        user.setUserName("teste");
        user.setAccountNonLocked(enabled);
        user.setCredentialsNonExpired(enabled);
        user.setAccountNonExpired(enabled);
        user.setEnabled(enabled);
        user.setFullName("teste teste");
        user.setDateLicense(licenca);
        user.setPermissions(permissions);
        return user;
    }

    public static UsuarioVO vo(List<PermissionVO> permissions, boolean enabled, boolean cadastrado){
        UsuarioVO user = new UsuarioVO();
        user.setKey(cadastrado?1L:null);
        user.setPassword("123teste");
        user.setUserName("teste");
        user.setEnabled(enabled);
        user.setFullName("teste teste");
        user.setPermissions(permissions);
        return user;
    }

    public static List<PermissionVO> permissionVOS(PermissionVO permissionVO){
        return Collections.singletonList(permissionVO);
    }

    public static List<Permission> permissions(PermissionVO permissionVO){
        Permission permission = new Permission();
        permission.setDescription(permissionVO.name());
        permission.setId(permissionVO.getCodigo().longValue());
        return Collections.singletonList(permission);
    }

    public static UserDetails userDetails(User user){
        return new UserDetails() {
            @Override
            public Collection<? extends GrantedAuthority> getAuthorities() {
                return user.getPermissions();
            }

            @Override
            public String getPassword() {
                return user.getPassword();
            }

            @Override
            public String getUsername() {
                return user.getUsername();
            }

            @Override
            public boolean isAccountNonExpired() {
                return user.getAccountNonExpired();
            }

            @Override
            public boolean isAccountNonLocked() {
                return user.getAccountNonLocked();
            }

            @Override
            public boolean isCredentialsNonExpired() {
                return user.getCredentialsNonExpired();
            }

            @Override
            public boolean isEnabled() {
                return user.getEnabled();
            }
        };
    }

    public static UsuarioVOJsonTest jsonTest(UsuarioVO user){

        return UsuarioVOJsonTest.builder()
                .key(user.getKey())
                .userName(user.getUserName())
                .enabled(user.getEnabled())
                .fullName(user.getFullName())
                .password(user.getPassword())
                .permissions(user.getPermissions().stream().map(Enum::name).collect(Collectors.toList()))
                .build();
    }
}
