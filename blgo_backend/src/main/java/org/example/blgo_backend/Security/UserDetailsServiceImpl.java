package org.example.blgo_backend.Security;

import org.example.blgo_backend.Entity.User;
import org.example.blgo_backend.Repository.Users;
import org.example.blgo_backend.UserPrincipal.UserPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final Users users;

    public UserDetailsServiceImpl(Users users) {
        this.users = users;
    }

    @Override
    //using email instead of username
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User checkUser = users.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("User not found: " + email);
                    return new UsernameNotFoundException("User not found: " + email);
                });
        return new UserPrincipal(checkUser);
    }
}
