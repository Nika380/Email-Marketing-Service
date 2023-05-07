package com.example.gmailClone.search;

import lombok.Data;

@Data
public class SearchParams {
    private Integer pageNumber = 0;
    private Integer pageSize = 5;
    private Integer groupId;
    private Integer listId;
}
