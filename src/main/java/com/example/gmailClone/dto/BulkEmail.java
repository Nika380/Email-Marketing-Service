package com.example.gmailClone.dto;

import lombok.Data;

import java.util.List;

@Data
public class BulkEmail {
    private List<bulkMailDto> mails;
    private String mailSender;
    private String mailBody;
    private String mailSubject;

    @Data
    public static class bulkMailDto{
        private String mailTo;
    }
}
