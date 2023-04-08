package com.example.gmailClone.service.EmailVerification;

import com.example.gmailClone.dto.BulkEmail;
import com.example.gmailClone.dto.MailDto;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface EmailVerificationServiceInterface {
    String sendMail(MailDto mailDto) throws UnsupportedEncodingException, MessagingException;

    String activateEmail(String email, String OTP);


}
