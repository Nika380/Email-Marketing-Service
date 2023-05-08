package com.example.gmailClone.service.MailGroups;

import com.example.gmailClone.dto.MailGroups.ListNameChangeDto;
import com.example.gmailClone.dto.MailGroups.GroupNameChangeDto;
import com.example.gmailClone.dto.MailGroups.MailGroupDto;
import com.example.gmailClone.dto.MailGroups.MailListDto;
import com.example.gmailClone.entity.*;
import com.example.gmailClone.repository.MailGroups.BulkMailGroupRepo;
import com.example.gmailClone.repository.MailGroups.BulkMailListRepo;
import com.example.gmailClone.repository.MailGroups.MailRecipientRepo;
import com.example.gmailClone.repository.UserRepo;
import com.example.gmailClone.search.SearchParams;
import com.example.gmailClone.security.SecUser;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
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
public class MailGroupsService {
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
        if (!check.getStatusCode().equals(HttpStatus.BAD_REQUEST)) {
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
        for (BulkMailGroup group : checkGroup) {
            if (Objects.equals(group.getGroupName(), mailGroupDto.getGroupName())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Group With This Name Already Exists");
            }
        }

        bulkGroup.setGroupName(mailGroupDto.getGroupName());
        bulkGroup.setGroupOwner(secUser.getUsername());
        bulkGroup.setUser(user);

        mailGroupDto.getMailListIds().forEach(bulkMailList -> {
            var listItem = listRepo.findById(bulkMailList.getId())
                    .orElseThrow(() -> new NotFoundException("List Not Found"));
            if (listItem.getListOwner().equals(secUser.getUsername())) {
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
        if (!group.getGroupOwner().equals(user.getUsername())) {
            return ResponseEntity.status(400).body("Group Does Not Belongs To User");
        }
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(group);

    }

    public ResponseEntity<String> changeGroupName(GroupNameChangeDto dto, int id, SecUser user) {
        var group = groupRepo.findById(id).orElseThrow(() -> new NotFoundException("Group Does Not Exists"));
        if (!group.getGroupOwner().equals(user.getUsername())) {
            return ResponseEntity.status(400).body("Group Does Not Belongs To User");
        }
        var userGroupList = groupRepo.findAllBulkMailGroupByGroupOwner(user.getUsername());
        for(BulkMailGroup group1 : userGroupList) {
            if(group1.getGroupName().equals(dto.getNewGroupName())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Group With This Name Already Exists");
            }
        }
        try {
            group.setGroupName(dto.getNewGroupName());
            groupRepo.save(group);
            return ResponseEntity.status(201).body("Name Changed Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Something Wrong Happened");
        }
    }

    public ResponseEntity<String> changeListName(ListNameChangeDto dto, SecUser user, int id) {
        var list = listRepo.findById(id).orElseThrow(() -> new NotFoundException("List With This Id Does Not Exists"));
        if(!list.getListOwner().equals(user.getUsername())) {
            return ResponseEntity.status(400).body("List Does Not Belong To This User");
        }
        var listsArray = listRepo.findBulkMailListByListOwner(user.getUsername());
        for(BulkMailList list1 : listsArray) {
            if(list1.getListName().equals(dto.getNewListName())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("List With This Name Already Exists");
            }
        }
        try {
            list.setListName(dto.getNewListName());
            listRepo.save(list);
            return ResponseEntity.status(201).body("List Name Changed Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Something Went Wrong");
        }
    }

    public ResponseEntity<?> deleteGroup(int groupId, SecUser user) {
        var groupToDelete = groupRepo.findById(groupId).orElseThrow();
        if (!groupToDelete.getGroupOwner().equals(user.getUsername())) {
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

    public Page<BulkMailGroup> getUsersGroups(SecUser user, SearchParams params) {
        Specification<BulkMailGroup> spec = (root, query, cb) -> cb.equal(root.get(BulkMailGroup_.GROUP_OWNER), user.getUsername());
        return groupRepo.findAll(spec, PageRequest.of(params.getPageNumber(), params.getPageSize()));
    }
    public Page<MailRecipient> getUsersGroupsLists(SecUser user, SearchParams params) {
        return recipientRepo.findAll((root, query, cb) -> {
            Join<MailRecipient, BulkMailList> recipientListJoin = root.join(MailRecipient_.BULK_MAIL_LISTS);
            Join<BulkMailList, BulkMailGroup> listGroupJoin = recipientListJoin.join(BulkMailList_.BULK_MAIL_GROUPS);
            Predicate predicate = cb.equal(listGroupJoin.get(BulkMailGroup_.groupOwner), user.getUsername());
            predicate = cb.and(predicate, cb.equal(listGroupJoin.get(BulkMailGroup_.id), params.getGroupId()));
            query.distinct(true); // to avoid duplicates
            return predicate;
        }, PageRequest.of(params.getPageNumber(), params.getPageSize()));
    }

    public Page<MailRecipient> getMailRecipientsFromEmailLists(SecUser user, SearchParams params) {
        return recipientRepo.findAll((root, query, cb) -> {
            Join<MailRecipient, BulkMailList> listJoin = root.join(MailRecipient_.BULK_MAIL_LISTS);
            Predicate predicate = cb.equal(listJoin.get(BulkMailList_.LIST_OWNER), user.getUsername());
            predicate = cb.and(predicate, cb.equal(listJoin.get(BulkMailList_.id), params.getListId()));
            return predicate;
        }, PageRequest.of(params.getPageNumber(), params.getPageSize()));
    }

    public ResponseEntity<?> deleteList(int id, SecUser user) {
        var list = listRepo.findById(id).orElseThrow();
        if (list.getListOwner().equals(user.getUsername())) {
            List<MailRecipient> recipientsCopy = new ArrayList<>(list.getMailRecipients());
            for (MailRecipient recipient : recipientsCopy) {
                recipient.getBulkMailLists().remove(list);
                list.getMailRecipients().remove(recipient);
                recipientRepo.save(recipient);
            }
            List<BulkMailGroup> groups = new ArrayList<>(list.getBulkMailGroups());
            for (BulkMailGroup group : groups) {
                group.getBulkMailLists().remove(list);
                list.getBulkMailGroups().remove(group);
                groupRepo.save(group);
            }
            listRepo.delete(list);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("List Deleted Successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("List Does Not Belong To This User");
        }
    }

    public ResponseEntity<String> addEmailAddressToList(SecUser user, int listId, String emailAddress) {
        var list = listRepo.findById(listId).orElseThrow(() -> new NotFoundException("List Does Not Exists"));
        if(!list.getListOwner().equals(user.getUsername())) {
            return ResponseEntity.status(400).body("List Does Not Belong To This User");
        }
        addEmailAddress(emailAddress);
        var email = recipientRepo.findMailRecipientByEmailAddress(emailAddress).orElseThrow();
        var listRecipients = list.getMailRecipients();

        for(MailRecipient recipient : listRecipients) {
            if(recipient.getEmailAddress().equals(emailAddress)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email Is Already In The List");
            }
        }
        listRecipients.add(email);
        list.setMailRecipients(listRecipients);
        listRepo.save(list);
        return ResponseEntity.status(HttpStatus.CREATED).body("Email Added To List");
    }

    public ResponseEntity<String> addListToGroup(SecUser user, int groupId, int listId) {
        var group = groupRepo.findById(groupId).orElseThrow(() -> new NotFoundException("Group Does Not Exists"));
        var list = listRepo.findById(listId).orElseThrow(() -> new NotFoundException("List Does Not Exists"));

        if(!(list.getListOwner().equals(user.getUsername())) || !(group.getGroupOwner().equals(user.getUsername()))) {
            return ResponseEntity.status(400).body("List Or Group Does Not Belong To User");
        }

        var groupLists = group.getBulkMailLists();
        for(BulkMailList list1 : groupLists) {
            if(list1.equals(list)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("List Is Already In Group");
            }
        }
        groupLists.add(list);
        group.setBulkMailLists(groupLists);
        groupRepo.save(group);
        return ResponseEntity.status(HttpStatus.CREATED).body("List Added To Group");
    }


}
