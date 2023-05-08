package com.example.gmailClone.service.PasswordReset;

import com.example.gmailClone.dto.PasswordResetDto;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;

import java.io.UnsupportedEncodingException;

public interface PasswordResetInterface {
    ResponseEntity<String> resetPassword(PasswordResetDto dto);
    String sendPasswordResetOTP(String email) throws MessagingException, UnsupportedEncodingException;
}
