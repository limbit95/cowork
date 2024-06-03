package com.cowork.employee.chatting.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.employee.chatting.model.dto.Employee;
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
	public String makeChat(List<String> empNoList, String empNo) {
		
		
		return null;
	}
	
	/*
	@Override
	public String makeChat(List<String> memberNoList, String memberNo) {
		
		
		Integer size = memberNoList.size();
		
		//chat_room 테이블에 행을 삽입
		ChatRoom chatRoom = new ChatRoom();	
		chatMapper.addChatRoom(chatRoom);
		// chatRoom 이라는 객체의 roomId 에 마이바티스에 의해 삽입된 행의 pk 값이 들어가 있음. 
		
		// CHAT_PARTICIPANT 테이블에 행을 삽입 
		// 1) 본인을 삽입 
		ChatParticipant part1 = new ChatParticipant();
		part1.setMemberNo(memberNo);
		part1.setRoomId(chatRoom.getRoomId());
		chatMapper.addParticipantMaker(part1);
		
		// 2) 본인 제외 나머지 놈들 삽입 
		for(int i=0; i<size; i++) {
			String participantMemberNo = memberNoList.get(i);
			ChatParticipant part2 = new ChatParticipant();
			part2.setMemberNo(participantMemberNo);
			part2.setRoomId(chatRoom.getRoomId());
			chatMapper.addParticipantInvited(part2);
		}
		
		// 난수 생성 및 SUBSCRIBE_ADDR 에 행 삽입. 그리고 그 난수(구독주소)를 리턴
        String subscribeAddr = UUID.randomUUID().toString();
        SubscribeAddr subscribeAddrDTO = new SubscribeAddr();
        subscribeAddrDTO.setRoomId(chatRoom.getRoomId());
        subscribeAddrDTO.setSubscribeAddr(subscribeAddr);
        
        chatMapper.addSubscribeAddr(subscribeAddrDTO);
        return subscribeAddr;
	}
	*/
	
	
}
