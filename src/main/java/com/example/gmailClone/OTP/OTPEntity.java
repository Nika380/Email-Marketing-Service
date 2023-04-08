package com.example.gmailClone.OTP;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users_otps")
@NoArgsConstructor
public class OTPEntity {

    public OTPEntity(String userEmail, String OTP) {
        this.userEmail = userEmail;
        this.OTP = OTP;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "user_email")
    private String userEmail;
    @Column(name = "otp")
    private String OTP;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        expiresAt = createdAt.plusMinutes(30);
    }

}
