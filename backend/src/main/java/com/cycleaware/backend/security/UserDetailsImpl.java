package com.cycleaware.backend.security;

import com.cycleaware.backend.entity.User;
import com.cycleaware.backend.enums.Gender;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@AllArgsConstructor
@Getter
public class UserDetailsImpl implements UserDetails {

    private Long id;
    private String name;
    private String email;
    @JsonIgnore
    private String password;
    private Gender gender;
    private Collection<? extends GrantedAuthority> authorities;

    public static UserDetailsImpl build(User user) {
        return new UserDetailsImpl(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getGender(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

