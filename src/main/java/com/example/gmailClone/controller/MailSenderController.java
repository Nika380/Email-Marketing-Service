package com.example.gmailClone.controller;

import com.example.gmailClone.dto.BombEmailDto;
import com.example.gmailClone.dto.BulkEmail;
import com.example.gmailClone.security.SecUser;
import com.example.gmailClone.service.SendEmails.SendEmailsServiceImpl;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/send-mail")
@RequiredArgsConstructor
public class MailSenderController {

    private final SendEmailsServiceImpl emailsService;

    @PostMapping("/send-bulk/{groupName}")
//    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> sendBulkMail(@PathVariable String groupName, @RequestBody BulkEmail bulkEmail, @AuthenticationPrincipal SecUser user) throws MessagingException, UnsupportedEncodingException {
        return emailsService.sendBulkEmail(groupName, bulkEmail, user);
    }

    @PostMapping("/bomb-email/{number}")
    public ResponseEntity<?> bombEmail(@RequestBody BombEmailDto dto, @PathVariable int number) throws MessagingException, UnsupportedEncodingException {
        for(int i = 0; i < number; i++) {
            emailsService.bombOneMail(dto);
        }
        return ResponseEntity.status(201).body("Bombed");
    }

}
