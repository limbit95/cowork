package com.cowork.employee.chatting.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder // 인스턴스 쉽게 만들게해줌.
public class ChatRoom {
	private Integer roomNo;
	private String roomName;
	private String createdAt;
	private Integer empCode;
	
	
	
	
	
	
	//------------------------
	private String sentAt; // 마지막 채팅 시각 	
	private String content; // 마지막 채팅 내용 
	private String memberNickname; // 최초 초대자 이름 
	
	private String empLastName;
	private String empFirstName;
	
	private String profileImg; // 최초 초대자 프로필이미지 
	
	private int profileImgFlag; // 최초 초대자 프로필이미지가 있으면 1, 없으면 0 
	
	private String subAddr;
	
	
	//---------------------------
	// 채팅참여자의수 - 1
	private Integer chattingParticipant;
	
}
