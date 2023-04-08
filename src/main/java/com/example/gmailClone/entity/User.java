package com.example.gmailClone.entity;


import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "user_name")
    private String userName;
    @Column(name = "email")
    private String email;
    @Column(name = "password")
    private String password;
    @Column(name = "birth_date")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate birthDate;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @Column(name = "active")
    private Boolean active;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        active = false;
    }

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_and_permissions",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_name")
    )
    private List<Permissions> permissions;

}
