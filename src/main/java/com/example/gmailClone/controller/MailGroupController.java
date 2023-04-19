package com.example.gmailClone.controller;

import com.example.gmailClone.dto.MailGroups.MailGroupDto;
import com.example.gmailClone.dto.MailGroups.MailListDto;
import com.example.gmailClone.entity.BulkMailGroup;
import com.example.gmailClone.entity.BulkMailList;
import com.example.gmailClone.security.SecUser;
import com.example.gmailClone.service.MailGroups.MailGroupsService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<String> createEmailList(@RequestBody MailListDto dto) {
        return mailGroupsService.createEmailList(dto);
    }

    @PostMapping("/create-group")
    public ResponseEntity<String> createGroup(@RequestBody MailGroupDto dto, @AuthenticationPrincipal SecUser secUser) {
        return mailGroupsService.createGroup(dto, secUser);
    }

    @GetMapping("/list")
    public List<BulkMailList> getMailLists() {
        return mailGroupsService.mailLists();
    }
    @GetMapping("/groups-list")
    public List<BulkMailGroup> getGroupsList() {
        return mailGroupsService.mailGroupsList();
    }
}
