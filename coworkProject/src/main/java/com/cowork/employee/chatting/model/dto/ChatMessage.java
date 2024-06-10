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
public class ChatMessage {
	
    private MessageType type; // 온 게 단순한 텍스트인지(CHAT), 파일인지(FILE) 인지 구분하기 위함 
    private String senderEmpCode; //보낸놈의 EMPLOYEE 테이블 EMP_CODE
    private String empNickname; // 보낸놈의 이름 
    private String content; // 보낸 게 단순한 텍스트인 경우의 그 내용 
//    private String chatMessage; // ? 왜 있는지 모르겠음. 
    private String subscribeAddr; // 구독주소 
    private String roomNo; // 채팅방의 기본키 
    
    private MultipartFile file; 
    private String filePath;
    
    

    public enum MessageType {
        CHAT,
        FILE // FILE 타입 추가
    }
    
    // 그 채팅메세지를 쓴 사람의 프로필사진에 대한 게 없음. 
    private String profileImg;
    
    private String empLastName; 
    private String empFirstName;
    
    
    // 번역 관련 필드들 
    private Boolean wantTranslateFlag;
    private String targetLanguage;
    

}
