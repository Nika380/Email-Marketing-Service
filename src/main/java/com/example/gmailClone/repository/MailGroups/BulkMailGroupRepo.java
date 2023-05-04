package com.example.gmailClone.repository.MailGroups;

import com.example.gmailClone.entity.BulkMailGroup;
import com.example.gmailClone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BulkMailGroupRepo extends JpaRepository<BulkMailGroup, Integer> {
    List<BulkMailGroup> findAllBulkMailGroupByGroupOwner(String email);
}
