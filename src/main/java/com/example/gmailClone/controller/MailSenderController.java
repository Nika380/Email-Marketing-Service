package com.example.gmailClone.controller;

import com.example.gmailClone.dto.BulkEmail;
import com.example.gmailClone.service.SendEmails.SendEmailsServiceImpl;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/bomb-email/{emailTo}/{number}")
    public void bombEmail(@PathVariable String emailTo, @PathVariable int number) throws MessagingException, UnsupportedEncodingException {
        for(int i = 0; i < number; i++) {
            emailsService.bombOneMail(emailTo);
        }
    }
}
