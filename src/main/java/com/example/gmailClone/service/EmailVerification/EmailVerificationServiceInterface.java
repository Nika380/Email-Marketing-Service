package com.example.gmailClone.service.EmailVerification;

import com.example.gmailClone.dto.BulkEmail;
import com.example.gmailClone.dto.MailDto;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;

import java.io.UnsupportedEncodingException;

public interface EmailVerificationServiceInterface {
    String sendMail(MailDto mailDto) throws UnsupportedEncodingException, MessagingException;

    ResponseEntity<String> activateEmail(String email, String OTP);


}
