package com.example.gmailClone.service.PasswordReset;

import com.example.gmailClone.dto.PasswordResetDto;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/auth/reset-password")
@RequiredArgsConstructor
public class PasswordResetController {
    private final PasswordResetServiceImp passwordResetService;

    @PostMapping
    public String resetPassword(@RequestBody PasswordResetDto dto) {
        return passwordResetService.resetPassword(dto);
    }
    @PostMapping("/send-otp/{email}")
    public String sendPasswordResetOTP(@PathVariable String email) throws MessagingException, UnsupportedEncodingException {
        return passwordResetService.sendPasswordResetOTP(email);
    }
}
