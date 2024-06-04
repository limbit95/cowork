package com.cowork.employee.chatting.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
public class ChatServiceImpl implements ChatService{
	
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
		
		log.debug("empList={}", empList);
		
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
	
	String roomName = empNickname + "외 " + (size+1) + "명";
	
	// CHAT_ROOM 테이블에 행을 삽입. 이때, PK 값 가져와야 함. 
	ChatRoom chatRoom = new ChatRoom();
	chatRoom.setEmpNo(Integer.parseInt(empCode));
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
			chatRoom.setContent(lastChatInfo.getContent()); // 마지막 채팅 내용
			chatRoom.setSentAt(lastChatInfo.getSentAt()); // 마지막 채팅 시각 
		}

		
		// CHAT_PARTICIPANT 테이블에서 해당 채팅방과관련된 놈들을 모두 조회해서 그 중 PARTICIPANT_NO 값이 두번째로 작은놈의 
		// 이름과 프로필사진을 가져올거임. 첫번째는 방을 만든 놈이니까. 
		Employee emp = chatMapper.findFirstInvited(chatRoom.getRoomNo());
		if(emp != null) {
			chatRoom.setMemberNickname(emp.getMemberNickname());
			if(emp.getProfileImg() == null) {
				chatRoom.setProfileImg(emp.getMemberNickname().substring(0, 1));
				chatRoom.setProfileImgFlag(0);
			
			}else {
				chatRoom.setProfileImg(emp.getProfileImg());			
				chatRoom.setProfileImgFlag(1);

			}

			
		}
		if(chatRoom.getRoomName() == null || chatRoom.getRoomName().equals("")) {
			chatRoom.setRoomName(member.getMemberNickname());
		}
		
		
		
	}
	
	
	
	
	return roomList;
	
	
	
	
}
	
	
	
}
