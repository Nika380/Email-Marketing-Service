package com.example.gmailClone.dto.MailGroups;

import com.example.gmailClone.entity.MailRecipient;
import lombok.Data;

import java.util.List;

@Data
public class MailListDto {

    private List<MailRecipient> mailRecipients;
}
