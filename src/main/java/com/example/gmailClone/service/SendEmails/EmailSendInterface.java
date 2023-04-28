package com.example.gmailClone.service.SendEmails;

import com.example.gmailClone.dto.BombEmailDto;
import com.example.gmailClone.dto.BulkEmail;
import jakarta.mail.MessagingException;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;

import java.io.UnsupportedEncodingException;

public interface EmailSendInterface {
    void sendBulkEmail(BulkEmail bulkEmail) throws MessagingException, UnsupportedEncodingException;
    ResponseEntity<String> bombOneMail(BombEmailDto dto) throws MessagingException, UnsupportedEncodingException;

}
