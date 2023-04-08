package com.example.gmailClone.repository;

import com.example.gmailClone.entity.Permissions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermisionRepo extends JpaRepository<Permissions, String> {
}
