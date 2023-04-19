package com.example.gmailClone.dto.MailGroups;

import com.example.gmailClone.entity.BulkMailList;
import lombok.Data;

import java.util.List;

@Data
public class MailGroupDto {
    private String groupName;
    private List<BulkMailList> mailListIds;

}
