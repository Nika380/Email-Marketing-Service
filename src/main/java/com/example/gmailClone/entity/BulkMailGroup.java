package com.example.gmailClone.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "bulk_mail_group")
public class BulkMailGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "group_name")
    private String groupName;
    @Column(name = "group_owner")
    private String groupOwner;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "bulk_mail_groups_and_mail_lists",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "list_id")
    )
    private List<BulkMailList> bulkMailLists;
}
