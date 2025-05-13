package org.example.blgo_backend.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
//@AllArgsConstructor
@NoArgsConstructor
public class RegisterDTO {

    public RegisterDTO(String userName, String email, String password, LocalDateTime createdAt) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }

    @Size(min = 3)
    //@NotNull
    private String userName;
    //@NotNull
    @Email
    private String email;
    @Min(3)
    //@NotNull
    private String password;
    private LocalDateTime createdAt = LocalDateTime.now();



    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
