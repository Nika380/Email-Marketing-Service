package com.example.gmailClone.dto;

import lombok.Data;

@Data
public class OTPRequestBody {
    private String phoneNumber;
    private String email;
}
