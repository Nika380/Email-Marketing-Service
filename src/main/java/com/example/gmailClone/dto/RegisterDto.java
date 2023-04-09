package com.example.gmailClone.dto;

import com.example.gmailClone.entity.Permissions;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class RegisterDto {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private List<Permissions> permissions;
}
