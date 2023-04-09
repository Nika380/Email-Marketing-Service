package com.example.gmailClone.service.User;

import com.example.gmailClone.dto.MailDto;
import com.example.gmailClone.dto.RegisterDto;
import com.example.gmailClone.entity.Permissions;
import com.example.gmailClone.entity.User;
import com.example.gmailClone.repository.UserRepo;
import com.example.gmailClone.service.EmailVerification.EmailVerificationService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserServiceInterface {

    private final UserRepo userRepo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    @Override
    public RegisterDto addUser(RegisterDto user) throws MessagingException, UnsupportedEncodingException {

        var checkUser = userRepo.findByEmail(user.getEmail()).isPresent();

        MailDto mailDto = new MailDto();
        mailDto.setMailTo(user.getEmail());
        mailDto.setSubject("Account Verification");
        emailVerificationService.sendMail(mailDto);
        if(!checkUser) {

            User userEntity = new User(
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPassword(),
                    user.getBirthDate(),
                    user.getPermissions()
            );

            userEntity.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepo.save(userEntity);
        }

        return user;
    }

    @Override
    public List<User> getUsers() {
        return userRepo.findAll();
    }
}
