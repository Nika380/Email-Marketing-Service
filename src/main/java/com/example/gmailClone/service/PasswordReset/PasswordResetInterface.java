package com.example.gmailClone.service.PasswordReset;

import com.example.gmailClone.dto.PasswordResetDto;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface PasswordResetInterface {
    String resetPassword(PasswordResetDto dto);
    String sendPasswordResetOTP(String email) throws MessagingException, UnsupportedEncodingException;
}
