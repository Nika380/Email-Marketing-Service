package com.example.gmailClone.repository.MailGroups;

import com.example.gmailClone.entity.MailRecipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MailRecipientRepo extends JpaRepository<MailRecipient, Integer>, JpaSpecificationExecutor<MailRecipient> {
    Optional<MailRecipient> findMailRecipientByEmailAddress(String email);
}
