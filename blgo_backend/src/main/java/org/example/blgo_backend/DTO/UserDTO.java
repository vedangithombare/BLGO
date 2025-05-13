package org.example.blgo_backend.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    @NotNull
    @Min(1)
    private Integer id;
    @NotNull
    @Size(min = 3, max = 20)
    private String userName;
    @Email
    @NotNull
    private String email;
    @Size(min = 4)
    @NotNull
    private String password;
}
