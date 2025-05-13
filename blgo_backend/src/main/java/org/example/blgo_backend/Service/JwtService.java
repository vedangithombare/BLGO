package org.example.blgo_backend.Service;


import io.jsonwebtoken.Claims;

public interface JwtService {

    public String generateTokens(String userName);

    boolean validateToken(String token);

    public Claims extractClaims(String token);

    public String getTokenValue(String token);
}
