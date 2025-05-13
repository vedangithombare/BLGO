package org.example.blgo_backend.Filter;


import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.example.blgo_backend.Security.UserDetailsServiceImpl;
import org.example.blgo_backend.Service.JwtService;
import org.example.blgo_backend.Service.UserService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Log4j2
@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public JWTAuthenticationFilter(JwtService jwtService, UserDetailsServiceImpl userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String token = null;
        String email = null;

        if (request.getCookies() != null) {
            Optional<Cookie> cookieOptional = Arrays.stream(request.getCookies()).
                    filter(cookie -> cookie.getName().equals("jwt")).findFirst();

            if (cookieOptional.isPresent()) {
                token = cookieOptional.get().getValue();
                System.out.println("TOKEN" + token);

                if (jwtService.validateToken(token)) {
                    Claims claims = jwtService.extractClaims(token);
                    email = claims.getSubject();
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    System.out.println("userdetails: " + userDetails);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken
                            (userDetails, userDetails.getPassword(), userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    Cookie newCookie = new Cookie("jwt", null);
                    newCookie.setMaxAge(0);
                    response.addCookie(newCookie);
                }
            }
        }
        filterChain.doFilter(request, response);
    }

}
