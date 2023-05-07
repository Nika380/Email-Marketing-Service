package com.example.gmailClone.controller;

import com.example.gmailClone.dto.MailGroups.GroupNameChangeDto;
import com.example.gmailClone.dto.MailGroups.ListNameChangeDto;
import com.example.gmailClone.dto.MailGroups.MailGroupDto;
import com.example.gmailClone.dto.MailGroups.MailListDto;
import com.example.gmailClone.entity.BulkMailGroup;
import com.example.gmailClone.entity.BulkMailList;
import com.example.gmailClone.entity.MailRecipient;
import com.example.gmailClone.search.SearchParams;
import com.example.gmailClone.security.SecUser;
import com.example.gmailClone.service.MailGroups.MailGroupsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
public class MailGroupController {
    private final MailGroupsService mailGroupsService;

    @PostMapping("/add-email-address/{email}")
    public ResponseEntity<String> addEmailAddress(@PathVariable String email) {
        return mailGroupsService.addEmailAddress(email);
    }

    @PostMapping("/create-list")
    public ResponseEntity<String> createEmailList(@RequestBody MailListDto dto, @AuthenticationPrincipal SecUser user) {
        return mailGroupsService.createEmailList(dto, user);
    }

    @PostMapping("/create-group")
    public ResponseEntity<String> createGroup(@RequestBody MailGroupDto dto, @AuthenticationPrincipal SecUser secUser) {
        return mailGroupsService.createGroup(dto, secUser);
    }

    @GetMapping("/list")
    public List<BulkMailList> getMailLists(@AuthenticationPrincipal SecUser user) {
        return mailGroupsService.mailLists(user);
    }
    @GetMapping("/groups-list")
    public List<BulkMailGroup> getGroupsList(@AuthenticationPrincipal SecUser user) {
        return mailGroupsService.mailGroupsList(user);
    }

    @GetMapping("/groups-list/paging")
    public Page<BulkMailGroup> getGroupsListWithPaging(@AuthenticationPrincipal SecUser user, SearchParams params) {
        return mailGroupsService.getUsersGroups(user, params);
    }

    @GetMapping("/mails-list/paging")
    public Page<MailRecipient> getMailsListWithPaging(@AuthenticationPrincipal SecUser user, SearchParams params) {
        return mailGroupsService.getUsersGroupsLists(user, params);
    }
    @GetMapping("/mail-list/recipients-list")
    public Page<MailRecipient> getRecipientsListFromBulkMailList(@AuthenticationPrincipal SecUser user, SearchParams params) {
        return mailGroupsService.getMailRecipientsFromEmailLists(user, params);
    }
    @GetMapping("/find-list/{listName}")
    public ResponseEntity<?> findListByListName(@PathVariable String listName,@AuthenticationPrincipal SecUser user) {
        return mailGroupsService.findEmailListByName(listName, user);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<?> findGroupById(@PathVariable int groupId, @AuthenticationPrincipal SecUser user) {
        return mailGroupsService.findGroupById(groupId, user);
    }

    @PostMapping("/change-name/{groupId}")
    public ResponseEntity<?> changeGroupName(@RequestBody GroupNameChangeDto dto, @PathVariable int groupId, @AuthenticationPrincipal SecUser user) {
        return mailGroupsService.changeGroupName(dto, groupId, user);
    }

    @PostMapping("/change-list-name/{listId}")
    public ResponseEntity<?> changeListName(@RequestBody ListNameChangeDto dto, @PathVariable int listId, @AuthenticationPrincipal SecUser user) {
        return mailGroupsService.changeListName(dto, user, listId);
    }

    @DeleteMapping("/delete-group/{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable int groupId, @AuthenticationPrincipal SecUser user) {
        mailGroupsService.deleteGroup(groupId, user);
        return mailGroupsService.deleteGroup(groupId, user);
    }

    @DeleteMapping("/delete-list/{listId}")
    public ResponseEntity<?> deleteList(@AuthenticationPrincipal SecUser user, @PathVariable int listId) {
        return mailGroupsService.deleteList(listId, user);
    }
}
