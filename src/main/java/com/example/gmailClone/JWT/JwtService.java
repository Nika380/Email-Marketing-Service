package com.example.gmailClone.JWT;

import com.example.gmailClone.dto.JwtResponseDto;
import com.example.gmailClone.repository.UserRepo;
import com.example.gmailClone.security.SecUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final UserRepo userRepo;

    @Value("${jwt.secret}")
    private String SECRET_KEY;
    public String extractUsername(String jwtToken) {
        return extractClaim(jwtToken, Claims::getSubject);
    }


    public <T> T extractClaim(String jwtToken, Function<Claims, T> claimsCollector){
        final Claims claims = extractAllClaims(jwtToken);
        return claimsCollector.apply(claims);
    }

    public JwtResponseDto generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public JwtResponseDto generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        int expireTime = 1000 * 60 * 10;
        String refreshToken = generateRefreshToken(userDetails);
        String jwtToken = Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expireTime))
                .signWith(getSigninKey(), SignatureAlgorithm.HS256)
                .compact();
        return new JwtResponseDto(jwtToken, refreshToken);
    }


    public String generateRefreshToken(UserDetails userDetails) {
        int expireTime = 1000 * 60 * 60 * 24 * 7; // 7 days in milliseconds
        return Jwts
                .builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expireTime))
                .signWith(getSigninKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    public JwtResponseDto refreshToken(String refreshToken) {
        validateRefreshToken(refreshToken);
        String username = extractUsername(refreshToken);
        var user = userRepo.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        UserDetails userDetails = new SecUser(user);// retrieve user details from database using username
        return generateToken(userDetails);
    }
    public boolean validateRefreshToken(String refreshToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigninKey())
                    .build()
                    .parseClaimsJws(refreshToken);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean isTokenValid(String jwtToken, UserDetails userDetails) {
        final String username = extractUsername(jwtToken);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(jwtToken);
    }

    private boolean isTokenExpired(String jwtToken) {
        return extractExpiration(jwtToken).before(new Date());
    }

    private Date extractExpiration(String jwtToken) {
        return extractClaim(jwtToken, Claims::getExpiration);
    }

    private Claims extractAllClaims(String jwtToken) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigninKey())
                .build()
                .parseClaimsJws(jwtToken)
                .getBody();
    }

    private Key getSigninKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
