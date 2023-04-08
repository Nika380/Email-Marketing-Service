package com.example.gmailClone.dto;

import lombok.Data;

@Data
public class MailDto {
    private String mailTo;
    private String subject;
    private String body;
}
