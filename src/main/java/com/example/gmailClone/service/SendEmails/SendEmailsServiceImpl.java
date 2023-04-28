package com.example.gmailClone.service.SendEmails;

import com.example.gmailClone.dto.BombEmailDto;
import com.example.gmailClone.dto.BulkEmail;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SendEmailsServiceImpl implements EmailSendInterface{

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String owner;

    @Override
    public void sendBulkEmail(BulkEmail bulkEmail) throws MessagingException, UnsupportedEncodingException {
        MimeMessage mimeMessage;

        mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setFrom(new InternetAddress(owner, bulkEmail.getMailSender()));
        helper.setText(bulkEmail.getMailBody());
        helper.setSubject(bulkEmail.getMailSubject());

        bulkEmail.getMails().forEach(mail -> {
            try {
                helper.setTo(mail.getMailTo());
                mailSender.send(mimeMessage);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        });

    }

    @Override
    public ResponseEntity<String> bombOneMail(BombEmailDto dto) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);

        String emailFrom = dto.getEmailSender();
        String body = dto.getEmailBody();
        String subject = generateRandomString();

        messageHelper.setFrom(new InternetAddress(owner, emailFrom));
        messageHelper.setTo(dto.getEmailTo());
        messageHelper.setSubject(subject);
        messageHelper.setText(body);

        try{
            mailSender.send(message);
            return ResponseEntity.status(201).body("Email Bombed");
        } catch (Exception e) {
            throw new RuntimeException("No work");
        }

    }

    public String generateRandomString() {
        int length = 8;
        String chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
