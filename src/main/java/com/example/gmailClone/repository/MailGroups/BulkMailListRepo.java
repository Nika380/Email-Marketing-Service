package com.example.gmailClone.repository.MailGroups;

import com.example.gmailClone.entity.BulkMailList;
import com.example.gmailClone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BulkMailListRepo extends JpaRepository<BulkMailList, Integer> {

}
