package com.cowork.employee.mail.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Recipient {
	
	private int recipientNo; 
	private String recipient; // 받는 사람 이름 
	private String recipientMail; 
	private String referer; // 참조인 이름 
	private String refererMail; // 참조인 메일 
	private String recipientTeamNm; // 받은 사람 팀이름 
	private String refererTeamNm; // 참조인 팀이름 
	private String referenceFl; 
	
	private int empCode; 
	private int mailNo; 
	
}
