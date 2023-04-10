package com.example.gmailClone.controller;

import com.example.gmailClone.dto.RegisterDto;
import com.example.gmailClone.entity.User;
import com.example.gmailClone.service.User.UserServiceImpl;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserServiceImpl userService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getUsersList() {
        return userService.getUsers();
    }

    @PostMapping("/register")
    @CrossOrigin("*")
    public RegisterDto registerUser(@RequestBody RegisterDto user) throws MessagingException, UnsupportedEncodingException {
        return userService.addUser(user);
    }
}
