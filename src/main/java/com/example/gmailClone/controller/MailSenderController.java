package com.example.gmailClone.controller;

import com.example.gmailClone.dto.BombEmailDto;
import com.example.gmailClone.dto.BulkEmail;
import com.example.gmailClone.service.SendEmails.SendEmailsServiceImpl;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/send-mail")
@RequiredArgsConstructor
public class MailSenderController {

    private final SendEmailsServiceImpl emailsService;

    @PostMapping("/send-bulk")
    @PreAuthorize("hasAuthority('USER')")
    public void sendBulkMail(@RequestBody BulkEmail bulkEmail) throws MessagingException, UnsupportedEncodingException {
        emailsService.sendBulkEmail(bulkEmail);
    }

    @PostMapping("/bomb-email/{number}")
    public ResponseEntity<?> bombEmail(@RequestBody BombEmailDto dto, @PathVariable int number) throws MessagingException, UnsupportedEncodingException {
        for(int i = 0; i < number; i++) {
            emailsService.bombOneMail(dto);
        }
        return ResponseEntity.status(201).body("Bombed");
    }
}
