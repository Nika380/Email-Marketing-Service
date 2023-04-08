package com.example.gmailClone.controller;

import com.example.gmailClone.dto.MailDto;
import com.example.gmailClone.service.EmailVerification.EmailVerificationService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailVerificationController {
    private final EmailVerificationService emailVerificationService;

    @PostMapping
    public String sendMail(@RequestBody MailDto mailDto) throws MessagingException, UnsupportedEncodingException {
        return emailVerificationService.sendMail(mailDto);
    }

    @GetMapping("/activate/{email}/{OTP}")
    public String activateMail(@PathVariable String email,@PathVariable String OTP) {
        return emailVerificationService.activateEmail(email, OTP);
    }

}
