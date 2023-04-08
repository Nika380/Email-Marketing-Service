package com.example.gmailClone.service.SendEmails;

import com.example.gmailClone.dto.BombEmailDto;
import com.example.gmailClone.dto.BulkEmail;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface EmailSendInterface {
    void sendBulkEmail(BulkEmail bulkEmail) throws MessagingException, UnsupportedEncodingException;
    void bombOneMail(String mailTo) throws MessagingException, UnsupportedEncodingException;

}
