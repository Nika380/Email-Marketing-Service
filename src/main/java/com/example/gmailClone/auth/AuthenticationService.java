package com.example.gmailClone.auth;

import com.example.gmailClone.JWT.JwtService;
import com.example.gmailClone.repository.UserRepo;
import com.example.gmailClone.security.SecUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final UserRepo userRepo;
    private final JwtService jwtService;
    public AuthenticationResponse authenticate(AuthenticationRequest authRequest) {
         authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(),
                        authRequest.getPassword()
                )
        );

         var user = userRepo.findByEmail(authRequest.getEmail())
                 .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
         var jwtToken = jwtService.generateToken(new SecUser(user));

         return AuthenticationResponse
                 .builder()
                 .jwtToken(jwtToken.getJwtToken())
                 .refreshToken(jwtToken.getRefreshToken())
                 .build();
    }
}
