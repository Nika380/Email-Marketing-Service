package com.example.gmailClone.controller;

import com.example.gmailClone.dto.ChangePasswordDto;
import com.example.gmailClone.security.SecUser;
import com.example.gmailClone.service.PasswordReset.PasswordResetServiceImp;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/change-password")
@RequiredArgsConstructor
public class ChangePasswordController {
    private final PasswordResetServiceImp resetServiceImp;
    @PutMapping
    public ResponseEntity<?> updatePassword(@AuthenticationPrincipal SecUser user, @RequestBody ChangePasswordDto dto) {
        return resetServiceImp.changePassword(user, dto);
    }
}
