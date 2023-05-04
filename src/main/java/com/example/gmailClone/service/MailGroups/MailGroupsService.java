package com.example.gmailClone.service.MailGroups;

import com.example.gmailClone.dto.MailGroups.GroupNameChangeDto;
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
import java.util.Objects;


@Slf4j
@Service
@RequiredArgsConstructor
public class MailGroupsService{
    private final BulkMailGroupRepo groupRepo;
    private final BulkMailListRepo listRepo;
    private final MailRecipientRepo recipientRepo;
    private final UserRepo userRepo;
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

    @Transactional
    public ResponseEntity<String> createEmailList(MailListDto mailListDto, SecUser user) {

        var check = findEmailListByName(mailListDto.getListName(), user);
        if(!check.getStatusCode().equals(HttpStatus.BAD_REQUEST)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("List With This Name Already Exists");
        }
        var mailList = new BulkMailList();
        var mailRecipients = new ArrayList<MailRecipient>();
        mailList.setListName(mailListDto.getListName());
        mailList.setListOwner(user.getUsername());

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

    public ResponseEntity<?> findEmailListByName(String listName, SecUser user) {
        var lists = listRepo.findBulkMailListByListOwner(user.getUsername());
        for (BulkMailList list : lists) {
            if (Objects.equals(list.getListName(), listName)) {
                return ResponseEntity.status(202).body(list);
            }
        }
        return ResponseEntity.status(400).body("List Does Not Exist");
    }



    @Transactional
    public ResponseEntity<String> createGroup(MailGroupDto mailGroupDto, SecUser secUser) {
        var bulkGroup = new BulkMailGroup();
        var user = userRepo.findByEmail(secUser.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        List<BulkMailList> listIds = new ArrayList<>();
        var checkGroup = groupRepo.findAllBulkMailGroupByGroupOwner(secUser.getUsername());
        for(BulkMailGroup group : checkGroup) {
            if(Objects.equals(group.getGroupName(), mailGroupDto.getGroupName())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Group With This Name Already Exists");
            }
        }

        bulkGroup.setGroupName(mailGroupDto.getGroupName());
        bulkGroup.setGroupOwner(secUser.getUsername());
        bulkGroup.setUser(user);

        mailGroupDto.getMailListIds().forEach(bulkMailList -> {
            var listItem = listRepo.findById(bulkMailList.getId())
                    .orElseThrow(() -> new NotFoundException("List Not Found"));
            if(listItem.getListOwner().equals(secUser.getUsername())) {
                listIds.add(listItem);
            }

        });
        bulkGroup.setBulkMailLists(listIds);

        groupRepo.save(bulkGroup);
        return ResponseEntity.status(HttpStatus.CREATED).body("Group Created");
    }


    public List<BulkMailList> mailLists(SecUser user) {
        return listRepo.findBulkMailListByListOwner(user.getUsername());
    }

    public List<MailRecipient> mailRecipientsList() {
        return recipientRepo.findAll();
    }

    public List<BulkMailGroup> mailGroupsList(SecUser user) {
        return groupRepo.findAllBulkMailGroupByGroupOwner(user.getUsername());
    }
    
    
    public ResponseEntity<?> findGroupById(int id, SecUser user) {
        var group = groupRepo.findById(id).orElseThrow();
        if(!group.getGroupOwner().equals(user.getUsername())) {
            return ResponseEntity.status(400).body("Group Does Not Belongs To User");
        }
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(group);

    }

    public ResponseEntity<String> changeGroupName(GroupNameChangeDto dto, int id, SecUser user) {
        var group = groupRepo.findById(id).orElseThrow(() -> new NotFoundException("Group Does Not Exists"));
        if(!group.getGroupOwner().equals(user.getUsername())) {
            return ResponseEntity.status(400).body("Group Does Not Belongs To User");
        }
        try {
            group.setGroupName(dto.getNewGroupName());
            groupRepo.save(group);
            return ResponseEntity.status(201).body("Name Changed Successfully");
        }  catch (Exception e) {
            return ResponseEntity.status(400).body("Something Wrong Happened");
        }
    }

    public ResponseEntity<?> deleteGroup(int groupId, SecUser user) {
        var groupToDelete = groupRepo.findById(groupId).orElseThrow();
        if(!groupToDelete.getGroupOwner().equals(user.getUsername())) {
            return ResponseEntity.status(400).body("Group Does Not Belong To This Account");
        }

        // Remove the association between the group and its mail lists
        try {
            groupToDelete.getBulkMailLists().forEach(list -> {
                list.getBulkMailGroups().remove(groupToDelete);
                groupToDelete.getBulkMailLists().remove(list);
                listRepo.save(list);
                groupRepo.save(groupToDelete);
            });

            // Delete the group
            groupRepo.delete(groupToDelete);
            return ResponseEntity.status(201).body("Group Deleted Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error Occurred");
        }
    }

}
