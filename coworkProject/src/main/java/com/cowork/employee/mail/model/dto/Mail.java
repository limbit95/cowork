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
public class Mail {
	
	private int mailNo; 
	private String mailTitle; 
	private String mailContent; 
	private String mailWriteDate; 
	private String mailFlag; 
	private int empCode; 
	private String readFl; //확인 여부 
	private int noReadCount; // 안읽은 메일 개수 
	private int mailCount; //전체메일개수 
	
	private int recipientNo; 
	private String sender; // 보낸 사람 이름
	private String senderMail; 
	private String recipient; // 받는 사람 이름 
	private String recipientMail; 
	private String referer; // 참조인 이름 
	private String refererMail; // 참조인 메일 
	
	private String senderTeamNm; // 보낸 사람 팀이름
	private String recipientTeamNm; // 받은 사람 팀이름 
	private String refererTeamNm; // 참조인 팀이름 
	private int comNo; //회사 식별키
	
	private List<MailFile> fileList; 
	private List<String> recieverList; // 받는 사람 리스트 
	private List<String> refererList; // 참조인 리스트 
	
	

}
