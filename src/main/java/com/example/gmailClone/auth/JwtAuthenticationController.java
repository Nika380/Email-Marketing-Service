package com.example.gmailClone.auth;

import com.example.gmailClone.JWT.JwtService;
import com.example.gmailClone.dto.JwtResponseDto;
import com.example.gmailClone.dto.RefreshTokenRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class JwtAuthenticationController {
    private final AuthenticationService authService;
    private final JwtService jwtService;

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest authRequest) {
        return ResponseEntity.status(HttpStatusCode.valueOf(201)).body(authService.authenticate(authRequest));
    }
    @PostMapping("/refresh")
    public ResponseEntity<JwtResponseDto> refresh(@RequestBody RefreshTokenRequestDto request) {
        String refreshToken = request.getRefreshToken();
        String newAccessToken = jwtService.refreshToken(refreshToken).getJwtToken();



        return ResponseEntity.ok(new JwtResponseDto(newAccessToken, refreshToken));
    }
}
