package com.example.gmailClone.service.PasswordReset;

import com.example.gmailClone.OTP.OTPRepo;
import com.example.gmailClone.dto.ChangePasswordDto;
import com.example.gmailClone.dto.PasswordResetDto;
import com.example.gmailClone.repository.UserRepo;
import com.example.gmailClone.security.SecUser;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImp implements PasswordResetInterface{
    private final UserRepo userRepo;
    private final OTPRepo otpRepo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String owner;
    @Override
    public ResponseEntity<String> resetPassword(PasswordResetDto dto) {
        var checkUser = userRepo.findByEmail(dto.getEmail()).isPresent();
        if(checkUser) {
            var userOTP = otpRepo.findByUserEmail(dto.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
            if(userOTP.getOTP().equals(dto.getOtp())) {
                var user = userRepo.findByEmail(dto.getEmail())
                        .orElseThrow();
                user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
                userRepo.save(user);

                return ResponseEntity.status(201).body("Password Changed Successfully");
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username OR OTP Is Incorrect");
        }
        return ResponseEntity.status(400).body("Username Does Not exists");
    }

    @Override
    public String sendPasswordResetOTP(String email) throws MessagingException, UnsupportedEncodingException {
        var checkUser = userRepo.findByEmail(email)
                .isPresent();
        if(checkUser) {
            var user = otpRepo.findByUserEmail(email).orElseThrow();
            var newOTP = generateOTP();
            var timeNow = LocalDateTime.now();
            user.setOTP(newOTP);
            user.setCreatedAt(timeNow);
            user.setExpiresAt(timeNow.plusMinutes(30));
            user.setConfirmedAt(null);
            otpRepo.save(user);
            MimeMessage message;

            message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setSubject("Reset Password");
            helper.setFrom(new InternetAddress(owner, "Password Reset"));
            helper.setText("Your One Time Password To Reset Password: " + newOTP + "\n"
            + "OTP Will Expire In 30 Minutes");
            helper.setTo(email);
            mailSender.send(message);
            return "OTP SENT";

        }
        return "Account With This Email Does Not Exists";

    }

    public ResponseEntity<String> checkOtp (String email, String userOtp) {
        var otp = otpRepo.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        if(otp.getOTP().equals(userOtp)) {
            return ResponseEntity.ok("Match");
        } else {
            return ResponseEntity.badRequest().body("Does not Match");
        }

    }

    public ResponseEntity<?> changePassword(SecUser user, ChangePasswordDto dto) {
        var userToUpdate = userRepo.findByEmail(user.getUsername()).orElseThrow(() -> new UsernameNotFoundException("User Does Not Exists"));
        if(!passwordEncoder.matches(dto.getOldPassword(), userToUpdate.getPassword())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Old Password is incorrect");
        }

        userToUpdate.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepo.save(userToUpdate);
        return ResponseEntity.status(201).body("Password Changed Successfully");
    }
    public static String generateOTP() {
        Random random = new Random();
        int OTP = 100000 + random.nextInt(900000);
        return String.valueOf(OTP);
    }
}
