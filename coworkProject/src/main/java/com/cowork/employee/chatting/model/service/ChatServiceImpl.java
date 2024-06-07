package com.cowork.employee.chatting.model.service;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.common.utility.Utility;
import com.cowork.employee.chatting.model.dto.ChatMessage;
import com.cowork.employee.chatting.model.dto.ChatMessageMe;
import com.cowork.employee.chatting.model.dto.ChatParticipant;
import com.cowork.employee.chatting.model.dto.ChatRoom;
import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.chatting.model.dto.SubscribeAddr;
import com.cowork.employee.chatting.model.mapper.ChatMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Transactional
@Slf4j
@Service
@RequiredArgsConstructor
@PropertySource("classpath:/config.properties")
public class ChatServiceImpl implements ChatService{
	
	@Value("${chatting.file.web-path}")
	private String webPath; // 앞에 붙이는 조각
	
	@Value("${chatting.file.folder-path}")
	private String folderPath; //찐 저장소
	
	private final ChatMapper chatMapper;
	/**
	 * 부서, 팀, 이름 으로 사원들 조회 
	 */
	@Override
	public List<Employee> empList(String inputData, Integer empCode) {
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("inputData", inputData);
		paramMap.put("empCode", empCode);
		
		List<Employee> empList = chatMapper.empList(paramMap);
		
		
		
		for(Employee emp : empList) {
			if(emp.getTeamNo() != null) {
				Employee findEmpDeptTeam = chatMapper.DeptNameTeamNameDetail(emp.getTeamNo());
				emp.setTeamNm(findEmpDeptTeam.getTeamNm());
				emp.setDeptNm(findEmpDeptTeam.getDeptNm());				
			}
		}
		
		
		return empList;
	}

	// 새로운 채팅방을 만들어. 
	@Override
	public String makeChat(List<String> empCodeList, String empCode) {
		
		// 채팅방을 만든 사람을 제외한 인원들의 EMP_NO 값들 
		Integer size = empCodeList.size(); 
		
		// EMPLOYEE 테이블에서 현재 empNoList 의 첫번째 사원의 이름을 가져온다. 
		// 최종 목적 : "최재준" 외 5명 을 CHAT_ROOM 의 ROOM_NAME 컬럼값으로 만드는것. 
		
		String invitedEmpNo = empCodeList.get(0);
		String empNickname = chatMapper.EmpNicknameDetail(invitedEmpNo);
		log.debug("empNickname == {}", empNickname);
		
		String roomName = empNickname + "외 " + (size) + "명";
		
		// CHAT_ROOM 테이블에 행을 삽입. 이때, PK 값 가져와야 함. 
		ChatRoom chatRoom = new ChatRoom();
		chatRoom.setEmpCode(Integer.parseInt(empCode));
		chatRoom.setRoomName(roomName);
		chatMapper.makeChat(chatRoom); 
		
		// CHAT_PARTICIPANT 테이블에 행을 삽입 
		// 본인 삽입
		// participant 에 뭘 넣어야 함? 
		// 1. PARTICIPANT_NO : 시퀀스 값 
		// 2. JOINED_AT : SYSDATE 
		// 3. ROOM_NO : chatRoom 객체에 들어있는 roomNo
		// 4. EMP_CODE : 참여하는 사람의 EMP_CODE  
		ChatParticipant chatParticipant = new ChatParticipant();
		chatParticipant.setRoomNo(chatRoom.getRoomNo());
		chatParticipant.setEmpCode(empCode);
		chatMapper.addParticipant(chatParticipant);
		
		// 본인 제외 나머지 삽입 
		for(String empNo2 : empCodeList) {
			ChatParticipant chatParticipant2 = new ChatParticipant();
			chatParticipant.setRoomNo(chatRoom.getRoomNo());
			chatParticipant.setEmpCode(empNo2);
			chatMapper.addParticipant(chatParticipant);
		}
		
	    // 난수 생성 및 SUBSCRIBE_ADDR 에 행 삽입. 그리고 그 난수(구독주소)를 리턴
		String subscribeAddr = UUID.randomUUID().toString();
		SubscribeAddr subscribeAddrDTO = new SubscribeAddr();
		subscribeAddrDTO.setRoomNo(chatRoom.getRoomNo());
		subscribeAddrDTO.setSubAddr(subscribeAddr);
		
		chatMapper.addSubscribeAddr(subscribeAddrDTO);
		return subscribeAddr;
	}

/**
 * 채팅방들 가져오는 메서드 
 */
@Override
public List<ChatRoom> getChattingRooms(String empCode) {
	// 일단 이놈과 관련된 모든 채팅방들을 가져오도록 한다.
	// 가져와야 하는 건, 해당 채팅방의 나를 제외한 놈들 중 CHAT_PARTICIPANT 테이블의 시퀀스값이 제일 작은놈의 프로필사진(없으면 그놈의 성) 
	// 그리고 그놈의 이름
	// 그리고 그 채팅방의 참여자의 수
	// 그리고 그 채팅방의 마지막 채팅 시각
	List<ChatRoom> roomList = chatMapper.getChattingRooms(empCode); // memberNo 가 참여한 채팅방들을 가져옴 
		
	// 여기에는 채팅방이 생성된 시각이 들어있지. 
	// 근데 지금 필요한 건 그 시각이 아니라, 마지막 채팅의 시각이야. 
	for(ChatRoom chatRoom : roomList) {
		ChatMessageMe lastChatInfo = chatMapper.getLastSentAt(chatRoom.getRoomNo());
		if(lastChatInfo != null) {
			if(lastChatInfo.getContent() != null) {
				if(lastChatInfo.getContent().length() > 20) {
					chatRoom.setContent( lastChatInfo.getContent().substring(0, 20) + "..." );
				} else {
					chatRoom.setContent(lastChatInfo.getContent()); // 마지막 채팅 내용				
				}				
			}
			
			

			
			String lastSentAt = lastChatInfo.getSentAt();
			
			String lastSentAtStatus = getTimeAgo(lastSentAt);
			
			chatRoom.setSentAt(lastSentAtStatus); // 마지막 채팅 시각 
		}

		// CHAT_PARTICIPANT 테이블에서 해당 채팅방과관련된 놈들을 모두 조회해서 그 중 PARTICIPANT_NO 값이 두번째로 작은놈의 
		// 이름과 프로필사진을 가져올거임. 첫번째는 방을 만든 놈이니까. 
		// 현재 채팅방에 속한 사람들의 EMP_CODE 들을 모두 가져온다. 
		List<String> empCodeList = chatMapper.chatRoomEmpCodeList(chatRoom.getRoomNo());
		String firstEmpCode = empCodeList.get(0);
		String exposedEmpCode = firstEmpCode;
		if(firstEmpCode.equals(empCode)) {
			// 내가 만든 방이라면, 다른 사람 보여줘야함.
			exposedEmpCode = empCodeList.get(1);
		}
		
		// 지금 exposedEmpCode 에는 보여질 사원의 EmpCode 가 들어있음. 
		// 이를 이용해서 EMPLOYEE 테이블에서 해당 사원에 대한 정보를 가져와보자. 
		Employee findEmp = chatMapper.empDetail(exposedEmpCode);
		chatRoom.setEmpLastName(findEmp.getEmpLastName());
		chatRoom.setEmpFirstName(findEmp.getEmpFirstName());

		if(findEmp.getProfileImg() != null) {
			chatRoom.setProfileImg(findEmp.getProfileImg());
			chatRoom.setProfileImgFlag(1);
		} else {
			chatRoom.setProfileImg(findEmp.getEmpLastName());
			chatRoom.setProfileImgFlag(0);
		}
		
		chatRoom.setChattingParticipant(empCodeList.size() - 1);
		
	}
	
	return roomList;
}

@Override
public List<ChatMessageMe> getChatMessage(Map<String, String> paramMap) {
	
	// 현재 로그인한 멤버의 해당 채팅방 현재 시각 이전의 메세지들은 읽은거로 처리해야함.
	String roomNo = paramMap.get("roomNo");
	
// 만약, 해당 채팅방에 글이 있다면,(chat_message 테이블에 해당 채팅방과 관련된 행이 존재하는지 확인)
// 해당 채팅방의 모든 글을 현재 fetch 요청 보낸 사용자가 읽었다고 표시해줘야 함. 
	
//	List<String> messageIdList = chatMapper.findMessageIds(roomNo); //현재 클릭된 채팅방과 관련된 메세지들의 MESSSGE_ID 값을 List자료구조에 담아옴 
//	if(messageIdList.size() != 0) {// 그 채팅방에 쓰여진 글이 있다면 
//		for(String messageId : messageIdList) { // 메세지 아이디를 하나씩 돌면서 
//			Map<String, Object> paramMap2 = new HashMap<>();
//			paramMap2.put("messageId", messageId);
//			paramMap2.put("memberNo", memberNo);
//			int result = chatMapper.updateReadFl(paramMap2); //현재 채팅방을 클릭한 멤버가 모든 글을 봤다고 표시함 
//		}
//	}
//	
// 해당 채팅방에 쓰여진 메세지들을 모두 가져온다. List<ChatMessage> 타입으로 가져오면 되고,
// 그걸 return 해주면 됨. 
// 각 메세지들을 몇명이 읽었는지를 조회해와야 함 
	List<ChatMessageMe> messageList = chatMapper.findAllMessageByRoomNo(roomNo);
//	for(ChatMessageMe message: messageList) {
//		String count = chatMapper.findUnreadCount(message.getMessageId());
//		message.setUnreadCount(count);
//	}
	
	
	return messageList;
}



/**
 * 메세지 쓰면 그 메세지를 저장하는 역할을 하는 메서드 
 */
@Override
public Employee insertTextMessage(ChatMessage chatMessage) {
	//ROOM_ID 필요
	String roomNo = chatMessage.getRoomNo();
	String senderEmpCode = chatMessage.getSenderEmpCode();
	String content = chatMessage.getContent();
	
	Map<String, Object> paramMap = new HashMap<>();
	paramMap.put("roomNo", roomNo);
	paramMap.put("senderEmpCode", senderEmpCode);
	paramMap.put("content", content);
	paramMap.put("messageType", 1);
	chatMapper.insertMessage(paramMap);	
	
	Employee findEmp = chatMapper.empDetail(senderEmpCode);
	return findEmp;
}

@Override
public String insertFileMessage(ChatMessage chatMessage) throws IllegalStateException, IOException {
	
	MultipartFile file = chatMessage.getFile();
	
	String updatePath = null; 
	String rename = null;
	
	if(!file.isEmpty()) {
		rename = Utility.fileRename(file.getOriginalFilename());
		updatePath = webPath + rename; // 고유키 앞에 조각을 붙임 
	}
	
	chatMessage.setFilePath(updatePath);
	int result = chatMapper.insertFileMessage(chatMessage);
	
	if(result >  0) {
		if(!file.isEmpty()) {
			file.transferTo(new File(folderPath + rename));
		}
	}
	
	return updatePath; 
}
	


public static String getTimeAgo(String pastTime) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    LocalDateTime pastDateTime = LocalDateTime.parse(pastTime, formatter);
    LocalDateTime now = LocalDateTime.now();
    
    Duration duration = Duration.between(pastDateTime, now);

    long seconds = duration.getSeconds();
    long minutes = seconds / 60;
    long hours = minutes / 60;
    long days = hours / 24;

    if (days > 0) {
        return days + "일 전";
    } else if (hours > 0) {
        return hours + "시간 전";
    } else if (minutes > 0) {
        if (minutes >= 5) {
            return "5분 전";
        } else if (minutes >= 3) {
            return "3분 전";
        } else {
            return "1분 전";
        }
    } else {
        return "방금 전";
    }
}
	
}