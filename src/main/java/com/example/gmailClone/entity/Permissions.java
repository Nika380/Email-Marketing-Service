package com.example.gmailClone.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "permissions")
public class Permissions {

    @Id
    @Column(name = "permission_name")
    private String permissionName;

    @ManyToMany(mappedBy = "permissions")
    @JsonIgnore
    private List<User> users;
}
