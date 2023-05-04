package com.example.gmailClone.dto;

import lombok.Data;

import java.util.List;

@Data
public class BulkEmail {
    private String mailSender;
    private String mailBody;
    private String mailSubject;

}
