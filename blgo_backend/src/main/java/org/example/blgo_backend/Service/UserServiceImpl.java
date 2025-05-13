package org.example.blgo_backend.Service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.example.blgo_backend.DTO.AuthenticatedUserDTO;
import org.example.blgo_backend.DTO.LogInDTO;
import org.example.blgo_backend.DTO.RegisterDTO;
import org.example.blgo_backend.Entity.User;
import org.example.blgo_backend.Repository.Users;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final JwtService jwtService;
    private final Users userRepo;
    private final PasswordEncoder passwordEncoder;

//    Dependency Injection
    public UserServiceImpl(JwtService jwtService, Users userRepo, PasswordEncoder passwordEncoder) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public RegisterDTO registerUser(RegisterDTO registerDTO) {
        try {
            User userEntity = new User();
            //checking if the user already exits
            Optional<User> user = userRepo.findByEmail(registerDTO.getEmail());
            //if its a new user then only registering
            if (user.isEmpty()) {
                userEntity.setUserName(registerDTO.getUserName());
                userEntity.setEmail(registerDTO.getEmail());

                System.out.println("Received Password: " + registerDTO.getPassword());
                userEntity.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
                System.out.println("Encoded Password from DB: " + userEntity.getPassword());

                User savedUser = userRepo.save(userEntity);
                System.out.println("saved user" + savedUser.getUserName());
                return new RegisterDTO(savedUser.getUserName(), savedUser.getEmail(), "", savedUser.getCreatedAt());
            } else {
                throw new RuntimeException("User already exits, Please login");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error: " + e.getMessage(), e);
        }

    }


    @Override
    public boolean authenticateUser(LogInDTO logInDTO) {
        Optional<User> checkUser = userRepo.findByEmail(logInDTO.getEmail());
        System.out.println("checkUser: " + checkUser);
        //checking if user exits in the db
        if (checkUser.isEmpty()) {
            System.out.println("User not found");
            throw new RuntimeException("User not found");
        }
        System.out.println("checkUser object:" + checkUser.get().getUserName() + " " + checkUser.get().getPassword());
        System.out.println("Stored Password: " + checkUser.get().getPassword());
        System.out.println("Entered Password: " + logInDTO.getPassword());
        if (passwordEncoder.matches(logInDTO.getPassword(), checkUser.get().getPassword())) {
            return true;
        } else {
            throw new RuntimeException("Wrong password");
        }
    }


    // first login
    @Override
    public String loginAndVerifyUser(LogInDTO logInDTO, HttpServletResponse httpServletResponse) {

        try {
            boolean verifyUser = authenticateUser(logInDTO);
            System.out.println("Verify user: " + verifyUser);
            if (verifyUser) {
                System.out.println("User authenticated" + " " + logInDTO.getEmail());
                //using email to generate token
                String token = jwtService.generateTokens(logInDTO.getEmail());
                System.out.println("The generated token is : " + token);
                Cookie cookie = new Cookie("jwt",token);
                cookie.setHttpOnly(true);
                cookie.setMaxAge(24 * 60 * 60);
                cookie.setPath("/");
                httpServletResponse.addCookie(cookie);

                return logInDTO.getEmail();

            }
        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }

        return "Unauthorised";
    }

    /*   had problem here because the cookie was set but it was not showing becouse of cors policy
* solved this by adding withCrendtials : true in the frontend when sending the request from the api
* so the cookies were visible
* */
    @Override
    public ResponseEntity<?> verifyUserToken(HttpServletRequest request) {
        String token = null;

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("jwt")) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        if (token != null) {
            return verifyUserSession(token);
        }

        return ResponseEntity.status(401).body("Unauthorised: No valid token found");
    }

    @Override
    public ResponseEntity<?> verifyUserSession(String token) {

        try {
            if (jwtService.validateToken(token)) {
                String email = jwtService.getTokenValue(token);

                Optional<User> user = userRepo.findByEmail(email);

                if (user.isPresent()) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("authenticated", true);
                    response.put("userName", user.get().getUserName());
                    response.put("email", user.get().getEmail());

                    return ResponseEntity.ok(response);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Token verification failed: " + e.getMessage());
        }
        return ResponseEntity.status(401).body("Unauthorised: No valid token found");
    }

    @Override
    public ResponseEntity<?> userLogout(HttpServletResponse response) {

        Cookie cookie = new Cookie("jwt", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        System.out.println("Starting logout");
        return new ResponseEntity<>("Successfully logged out", HttpStatus.OK);
    }


    //    Extracting the whole user object
    private ResponseEntity<User> extractAuthenticatedUser(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String token = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                System.out.println("Found cookie: " + cookie.getName() + " = " + cookie.getValue());

                if (cookie.getName().equals("jwt")) {
                    token = cookie.getValue();
                    System.out.println("cookies token: " + token);
                    break;
                }
            }
        }

        // Check if token was found
        if (token == null) {
            System.out.println("No JWT token found in cookies");
            return ResponseEntity.badRequest().build();
        }

        String email = jwtService.getTokenValue(token);
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    @Override
    public ResponseEntity<User> getAuthenticatedUserResponse(HttpServletRequest request) {
        try {
            return extractAuthenticatedUser(request);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
