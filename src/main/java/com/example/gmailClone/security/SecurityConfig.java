package com.example.gmailClone.security;

import com.example.gmailClone.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.CrossOrigin;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserRepo userRepo;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            var user = userRepo.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));

            return new SecUser(user);
        };
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests()
                .requestMatchers("/users/register").permitAll()
                .requestMatchers("/email/activate/**").permitAll()
                .requestMatchers("/activate/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .httpBasic()
                .and()
                .formLogin();
//                .and()
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        return http.build();
    }

}
