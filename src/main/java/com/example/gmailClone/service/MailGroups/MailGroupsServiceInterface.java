package com.example.gmailClone.service.MailGroups;


import com.example.gmailClone.dto.MailGroups.MailGroupDto;
import com.example.gmailClone.dto.MailGroups.MailListDto;
import com.example.gmailClone.dto.MailGroups.MailRecipientDto;
import com.example.gmailClone.entity.BulkMailGroup;
import com.example.gmailClone.entity.BulkMailList;
import com.example.gmailClone.entity.MailRecipient;
import com.example.gmailClone.security.SecUser;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface MailGroupsServiceInterface {
    ResponseEntity<String> addEmailAddress(String email);
    ResponseEntity<String> createEmailList(MailListDto mailListDto);

    ResponseEntity<String> createGroup(MailGroupDto mailGroupDto, SecUser secUser);
    List<BulkMailList> mailLists();
    List<MailRecipient> mailRecipientsList();
    List<BulkMailGroup> mailGroupsList();
}
