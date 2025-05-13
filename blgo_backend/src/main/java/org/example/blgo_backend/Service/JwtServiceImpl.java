package org.example.blgo_backend.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtServiceImpl implements JwtService {


    @Value("${spring.security.jwt.secret}")
    private String secretKey;


    @Override
    public String generateTokens(String userName) {
        return Jwts.builder()
                .subject(userName)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey)))
                .compact();
    }

    @Override
    public boolean validateToken(String token) {
        System.out.println("IN VALIDATE TOKEN Checking token: " + token);
        String extractedEmail = extractClaims(token).getSubject();
        System.out.println("username:  "+ extractedEmail);
        return !extractedEmail.isBlank() && !tokenExpired(token);

    }

    public String getTokenValue(String token){
        return extractClaims(token).getSubject();
    }

    private boolean tokenExpired(String token) {

        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaims(token).getExpiration();
    }

    @Override
    public Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey)))
                .setAllowedClockSkewSeconds(60) // Add 60 seconds of tolerance
                .build()
                .parseSignedClaims(token)
                .getPayload();

    }
}
