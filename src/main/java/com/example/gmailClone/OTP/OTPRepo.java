package com.example.gmailClone.OTP;

import com.example.gmailClone.OTP.OTPEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OTPRepo extends JpaRepository<OTPEntity, Integer> {
    Optional<OTPEntity> findByUserEmail(String email);
}
