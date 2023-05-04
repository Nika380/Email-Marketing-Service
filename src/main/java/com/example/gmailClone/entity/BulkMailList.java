package com.example.gmailClone.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
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
    @Column(name = "list_name")
    @NotNull
    private String listName;
    @Column(name = "list_owner")
    private String listOwner;
    @ManyToMany(mappedBy = "bulkMailLists", cascade = CascadeType.PERSIST)
    @JsonIgnore
    private List<BulkMailGroup> bulkMailGroups;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "recipient_addresses_in_mail_list",
            joinColumns = @JoinColumn(name = "list_id"),
            inverseJoinColumns = @JoinColumn(name = "recipient_id")
    )
    private List<MailRecipient> mailRecipients;
}
