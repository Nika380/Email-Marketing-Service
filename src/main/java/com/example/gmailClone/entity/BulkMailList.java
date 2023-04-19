package com.example.gmailClone.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "bulk_mail_list")
public class BulkMailList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @ManyToMany(mappedBy = "bulkMailLists")
    @JsonIgnore
    private List<BulkMailGroup> bulkMailGroups;

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "recipient_addresses_in_mail_list",
            joinColumns = @JoinColumn(name = "list_id"),
            inverseJoinColumns = @JoinColumn(name = "recipient_id")
    )
    private List<MailRecipient> mailRecipients;
}
