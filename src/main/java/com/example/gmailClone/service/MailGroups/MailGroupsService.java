package com.example.gmailClone.service.MailGroups;

import com.example.gmailClone.dto.MailGroups.MailGroupDto;
import com.example.gmailClone.dto.MailGroups.MailListDto;
import com.example.gmailClone.entity.BulkMailGroup;
import com.example.gmailClone.entity.BulkMailList;
import com.example.gmailClone.entity.MailRecipient;
import com.example.gmailClone.repository.MailGroups.BulkMailGroupRepo;
import com.example.gmailClone.repository.MailGroups.BulkMailListRepo;
import com.example.gmailClone.repository.MailGroups.MailRecipientRepo;
import com.example.gmailClone.repository.UserRepo;
import com.example.gmailClone.security.SecUser;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;

import java.util.ArrayList;
import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
public class MailGroupsService implements MailGroupsServiceInterface{
    private final BulkMailGroupRepo groupRepo;
    private final BulkMailListRepo listRepo;
    private final MailRecipientRepo recipientRepo;
    private final UserRepo userRepo;
    @Override
    @Transactional
    public ResponseEntity<String> addEmailAddress(String email) {
        if (recipientRepo.findMailRecipientByEmailAddress(email).isPresent()) {
            return ResponseEntity.status(400).body("Email already exists");
        }

        var recipient = new MailRecipient();
        recipient.setEmailAddress(email);
        recipientRepo.save(recipient);
        return ResponseEntity.status(201).body(recipient.toString());
    }

    @Override
    @Transactional
    public ResponseEntity<String> createEmailList(MailListDto mailListDto) {
        var mailList = new BulkMailList();
        var mailRecipients = new ArrayList<MailRecipient>();

        mailListDto.getMailRecipients().forEach(mailRecipientDto -> {
            var recipientMail = new MailRecipient();
            var checkMail = recipientRepo.findMailRecipientByEmailAddress(mailRecipientDto.getEmailAddress()).isPresent();

            if (checkMail) {
                // Email already exists, add to list directly
                recipientMail = recipientRepo.findMailRecipientByEmailAddress(mailRecipientDto.getEmailAddress()).get();
            } else {
                // Email does not exist, add it to MailRecipient table first
                try {
                    var response = addEmailAddress(mailRecipientDto.getEmailAddress());
                    if (response.getStatusCode() == HttpStatus.CREATED) {
                        recipientMail = recipientRepo.findMailRecipientByEmailAddress(mailRecipientDto.getEmailAddress()).get();
                    } else {
                        throw new Exception("Error adding email address");
                    }
                } catch (Exception e) {
                    // Handle the exception here
                    e.printStackTrace();
                    // You can also return a ResponseEntity with an error message here
                }
            }

            mailRecipients.add(recipientMail);
        });

        mailList.setMailRecipients(mailRecipients);
        listRepo.save(mailList);
        return ResponseEntity.status(201).body("Added");
    }


    @Override
    @Transactional
    public ResponseEntity<String> createGroup(MailGroupDto mailGroupDto, SecUser secUser) {
        var bulkGroup = new BulkMailGroup();
        var user = userRepo.findByEmail(secUser.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        List<BulkMailList> listIds = new ArrayList<>();

        bulkGroup.setGroupName(mailGroupDto.getGroupName());
        bulkGroup.setGroupOwner(secUser.getUsername());
        bulkGroup.setUser(user);

        mailGroupDto.getMailListIds().forEach(bulkMailList -> {
            var listItem = listRepo.findById(bulkMailList.getId())
                    .orElseThrow(() -> new NotFoundException("List Not Found"));

            listIds.add(listItem);

        });
        bulkGroup.setBulkMailLists(listIds);

        groupRepo.save(bulkGroup);
        return ResponseEntity.status(HttpStatus.CREATED).body("Group Created");
    }


    @Override
    public List<BulkMailList> mailLists() {
        return listRepo.findAll();
    }

    @Override
    public List<MailRecipient> mailRecipientsList() {
        return recipientRepo.findAll();
    }

    @Override
    public List<BulkMailGroup> mailGroupsList() {
        return groupRepo.findAll();
    }
}
