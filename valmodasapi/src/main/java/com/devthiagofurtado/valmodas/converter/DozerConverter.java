package com.devthiagofurtado.valmodas.converter;

import com.devthiagofurtado.valmodas.data.model.Permission;
import com.devthiagofurtado.valmodas.data.vo.PermissionVO;
import com.devthiagofurtado.valmodas.data.vo.UsuarioVO;
import com.github.dozermapper.core.DozerBeanMapperBuilder;
import com.github.dozermapper.core.Mapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;


import com.devthiagofurtado.valmodas.data.model.User;
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
        user1.setAccountNonExpired(false);
        user1.setAccountNonLocked(false);
        user1.setCredentialsNonExpired(false);
        user1.setDateLicense(LocalDate.now());
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
                .enabled(true)
                .build();
    }

    public static Permission permissionVOToEntity(PermissionVO vo) {
        Permission permission = new Permission();
        permission.setId(vo.getCodigo().longValue());
        permission.setDescription(vo.name());
        return permission;
    }
}
