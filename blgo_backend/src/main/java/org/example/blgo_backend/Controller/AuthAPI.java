package org.example.blgo_backend.Controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.blgo_backend.DTO.LogInDTO;
import org.example.blgo_backend.DTO.RegisterDTO;
import org.example.blgo_backend.Service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthAPI {

    private final UserService userService;

    public AuthAPI(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @CrossOrigin
    public RegisterDTO registerUser(@RequestBody RegisterDTO registerDTO){
        return userService.registerUser(registerDTO);
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody LogInDTO logInDTO, HttpServletRequest request, HttpServletResponse httpServletResponse){
        System.out.println("Request from: " + request.getHeader("Origin"));
        System.out.println("Content-Type: " + request.getHeader("Content-Type"));
        System.out.println("Request body email: " + logInDTO.getEmail());
        return userService.loginAndVerifyUser(logInDTO,httpServletResponse);
    }

    @GetMapping("/verify-auth")
    @CrossOrigin
    public ResponseEntity<?> verifyAuth(HttpServletRequest request){
        return  userService.verifyUserToken(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletResponse response){
        return userService.userLogout(response);

    }

}
