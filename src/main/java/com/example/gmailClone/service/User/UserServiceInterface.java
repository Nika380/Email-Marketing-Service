package com.example.gmailClone.service.User;

import com.example.gmailClone.dto.RegisterDto;
import com.example.gmailClone.entity.User;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface UserServiceInterface {
    RegisterDto addUser(RegisterDto registerDto) throws MessagingException, UnsupportedEncodingException;
    List<User> getUsers();
}
