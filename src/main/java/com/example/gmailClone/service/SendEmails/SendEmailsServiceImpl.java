package com.example.gmailClone.service.SendEmails;

import com.example.gmailClone.dto.BombEmailDto;
import com.example.gmailClone.dto.BulkEmail;
import com.example.gmailClone.entity.BulkMailGroup;
import com.example.gmailClone.repository.MailGroups.BulkMailGroupRepo;
import com.example.gmailClone.security.SecUser;
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
public class SendEmailsServiceImpl {

    private final  JavaMailSender mailSender;
    private final BulkMailGroupRepo groupRepo;

    @Value("${spring.mail.username}")
    private String owner;

//    @Override
    public ResponseEntity<String> sendBulkEmail(String groupName, BulkEmail bulkEmail, SecUser user) throws MessagingException,UnsupportedEncodingException {

        var groupsList = groupRepo.findAllBulkMailGroupByGroupOwner(user.getUsername());

        for(BulkMailGroup group : groupsList) {
            if(group.getGroupName().equals(groupName)) {

                MimeMessage mimeMessage;
                mimeMessage = mailSender.createMimeMessage();
                try {
                    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
                    helper.setFrom(new InternetAddress(owner, bulkEmail.getMailSender()));
                    helper.setFrom(new InternetAddress(owner, bulkEmail.getMailSender()));
                    helper.setText(bulkEmail.getMailBody());
                    helper.setSubject(bulkEmail.getMailSubject());
                    group.getBulkMailLists().forEach(list -> list.getMailRecipients().forEach(mailRecipient -> {
                        try {
                            helper.setTo(mailRecipient.getEmailAddress());
                            mailSender.send(mimeMessage);
                        } catch (MessagingException e) {
                            throw new RuntimeException(e);
                        }
                    }));
                } catch (MessagingException | UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }

                break;
            }
        }

//        MimeMessage mimeMessage;
//
//        mimeMessage = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
//        helper.setFrom(new InternetAddress(owner, bulkEmail.getMailSender()));
//        helper.setText(bulkEmail.getMailBody());
//        helper.setSubject(bulkEmail.getMailSubject());
//        var group = groupRepo.findById(groupId).orElseThrow(() -> new NotFoundException("Group Does Not Exists"));
//        group.getBulkMailLists().forEach(list -> list.getMailRecipients().forEach(mailRecipient -> {
//            try {
//                helper.setTo(mailRecipient.getEmailAddress());
//                mailSender.send(mimeMessage);
//            } catch (MessagingException e) {
//                throw new RuntimeException(e);
//            };
//        }));
        return ResponseEntity.status(201).body("Sent Successfully");


    }


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
