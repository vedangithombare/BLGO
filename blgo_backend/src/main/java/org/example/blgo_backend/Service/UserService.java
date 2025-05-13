package org.example.blgo_backend.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.blgo_backend.DTO.LogInDTO;
import org.example.blgo_backend.DTO.RegisterDTO;
import org.example.blgo_backend.Entity.User;
import org.springframework.http.ResponseEntity;

public interface UserService {

    public RegisterDTO registerUser(RegisterDTO registerDTO);

    public String loginAndVerifyUser(LogInDTO logInDTO, HttpServletResponse httpServletResponse);

    public boolean authenticateUser(LogInDTO logInDTO);

    ResponseEntity<?> verifyUserSession(String token);

    ResponseEntity<?> verifyUserToken(HttpServletRequest request);

    ResponseEntity<?> userLogout(HttpServletResponse response);

    public ResponseEntity<User> getAuthenticatedUserResponse(HttpServletRequest request);
}
