package com.cowork.employee.chatting.model.dto;

import org.springframework.web.multipart.MultipartFile;

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
public class ChatMessageMe {
	private Integer messageId;
	private Integer roomId;
	private Integer senderId; 
	private String messageType; 
	private String content; 
	private String filePath; 
	private String sentAt; 

	// 안 읽은 놈의 개수 
	private String unreadCount;
}
