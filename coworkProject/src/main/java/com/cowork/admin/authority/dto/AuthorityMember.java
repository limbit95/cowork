package com.cowork.admin.authority.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AuthorityMember {

	private int authorityMemberNo;
	private int authorityNo;
	private int empCdoe;
}
