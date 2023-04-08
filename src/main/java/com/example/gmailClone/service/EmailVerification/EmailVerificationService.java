package com.example.gmailClone.service.EmailVerification;

import com.example.gmailClone.OTP.OTPEntity;
import com.example.gmailClone.dto.MailDto;
import com.example.gmailClone.OTP.OTPRepo;
import com.example.gmailClone.repository.UserRepo;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.Random;


@Service
@RequiredArgsConstructor
public class EmailVerificationService implements EmailVerificationServiceInterface {


    private final JavaMailSender javaMailSender;
    private final OTPRepo otpRepo;
    private final UserRepo userRepo;

    @Value("${spring.mail.username}")
    private String owner;


    public String sendMail(MailDto mailDto) throws UnsupportedEncodingException, MessagingException {
         MimeMessage message;

        message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);


        var OTP = generateOTP();


        var checkUser = otpRepo.findByUserEmail(mailDto.getMailTo()).isPresent();

        if(checkUser) {
            var userOTP = otpRepo.findByUserEmail(mailDto.getMailTo())
                    .orElseThrow(() -> new RuntimeException("User Not Found"));

            userOTP.setOTP(OTP);
            otpRepo.save(userOTP);
        } else {
            otpRepo.save(new OTPEntity(mailDto.getMailTo(), OTP));
        }


        helper.setFrom(new InternetAddress(owner, "Account Verification"));
        helper.setTo(mailDto.getMailTo());
        helper.setText("Your One Time Passcode Is " + OTP);
        helper.setSubject(mailDto.getSubject());

        javaMailSender.send(message);

        return message.toString();
    }

    public static String generateOTP() {
        Random random = new Random();
        int OTP = 100000 + random.nextInt(900000);
        return String.valueOf(OTP);
    }


    public String activateEmail(String email, String OTP) {
        var user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        var checkUser = otpRepo.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Not Found"));

        var checkExpire = checkUser.getExpiresAt();
        if(checkUser.getOTP().equals(OTP) && checkExpire.isAfter(LocalDateTime.now())){
            user.setActive(true);
            userRepo.save(user);
            checkUser.setConfirmedAt(LocalDateTime.now());
            otpRepo.save(checkUser);
            return "Account Activated";
        } else {
            return "Account Not Activated";
        }

    }




}
