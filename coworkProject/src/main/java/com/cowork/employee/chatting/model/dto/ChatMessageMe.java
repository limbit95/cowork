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
	private Integer senderEmpCode; 
	private String messageType; 
	private String content; 
	private String filePath; 
	private String sentAt; 

	// 메세지를 작성한 사람의 프로필 사진과 이름도 필요함. 
	private String empLastName;
	private String empFirstName;
	private String profileImg;
}
