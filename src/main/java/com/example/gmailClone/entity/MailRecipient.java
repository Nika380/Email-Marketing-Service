package com.example.gmailClone.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "mail_recipient")
public class MailRecipient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "email_address")
    private String emailAddress;

    @ManyToMany(mappedBy = "mailRecipients")
    @JsonIgnore
    private List<BulkMailList> bulkMailLists;
}
