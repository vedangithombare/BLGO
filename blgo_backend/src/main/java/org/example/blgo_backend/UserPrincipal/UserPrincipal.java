package org.example.blgo_backend.UserPrincipal;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.List;

public class UserPrincipal extends User {
    public UserPrincipal(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
    }

    public UserPrincipal(org.example.blgo_backend.Entity.User userEntity) {
        this(userEntity.getUserName(), userEntity.getPassword(), List.of());
    }

}