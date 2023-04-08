package com.example.gmailClone.security;

import com.example.gmailClone.entity.User;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

@Data
public class SecUser implements UserDetails {

    public SecUser(User user) {
        this.email = user.getEmail();
        this.password= user.getPassword();
        this.active = user.getActive();
        this.authorities = user.getPermissions()
                .stream().map(permission ->
                        new SimpleGrantedAuthority(permission.getPermissionName()))
                .collect(Collectors.toList());
    }

    private String email;
    private String password;
    private Boolean active;
    private Collection<GrantedAuthority> authorities ;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return active;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return active;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
