package com.cowork.employee.chatting.model.service;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.common.utility.Utility;
import com.cowork.employee.chatting.model.dto.ChatMessage;
import com.cowork.employee.chatting.model.dto.ChatMessageMe;
import com.cowork.employee.chatting.model.dto.ChatParticipant;
import com.cowork.employee.chatting.model.dto.ChatRoom;
import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.chatting.model.dto.SubscribeAddr;
import com.cowork.employee.chatting.model.mapper.ChatMapper;
import com.cowork.user.model.dto.Employee2;

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
	 * 현재 로그인한 사원이 속한 회사의 부서와 팀을 모두 조회 
	 */
	@Override
	public List<Department> getDeptAndTeam(Employee2 loginEmp) {
		// 회사 테이블 기본키 얻어옴.
		Integer comNo = loginEmp.getComNo();  
		List<Department> deptAndTeam = chatMapper.getDeptAndTeam(comNo);
		return deptAndTeam;
	}
	
	/**
	 *  팀에 소속된 사원들에 대한 리스트를 조회
	 */
	@Override
	public List<Employee2> getTeamEmps(String teamNo, Employee2 loginEmp) {
		
		Integer loginEmpCode = loginEmp.getEmpCode();	
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("loginEmpCode", loginEmpCode);
		paramMap.put("teamNo", teamNo);
		
		// 현재 로그인한 사원을 제외하고, 해당 팀에 소속된 사원들을 조회. 
		List<Employee2> empList = chatMapper.getTeamEmps(paramMap);
		
		// 조회된 해당 팀의 사원들의 부서이름, 팀이름을 바인딩 
		for(Employee2 emp : empList) {
			if(emp.getTeamNo() != null) {
				Employee findEmpDeptTeam = chatMapper.DeptNameTeamNameDetail(emp.getTeamNo());
				emp.setDeptNm(findEmpDeptTeam.getDeptNm());				
				emp.setTeamNm(findEmpDeptTeam.getTeamNm());
			}
		}
		return empList;
	}
	
	/**
	 * 이름으로 사원들을 조회
	 */
	@Override
	public List<Employee2> empList(String inputData, Employee2 loginEmp) {
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("inputData", inputData);
		paramMap.put("empCode", loginEmp.getEmpCode());
		paramMap.put("comNo", loginEmp.getComNo());
		
		List<Employee2> empList = chatMapper.empList(paramMap);
		
		for(Employee2 emp : empList) {
			if(emp.getTeamNo() != null) {
				Employee findEmpDeptTeam = chatMapper.DeptNameTeamNameDetail(emp.getTeamNo());
				emp.setTeamNm(findEmpDeptTeam.getTeamNm());
				emp.setDeptNm(findEmpDeptTeam.getDeptNm());				
			}
		}
		
		return empList;
	}
	
	/**
	 * 채팅 메시지들을 List 자료구조로 가져옴
	 */
	@Override
	public List<ChatMessageMe> getChatMessage(String roomNo) {
		List<ChatMessageMe> messageList = chatMapper.findAllMessageByRoomNo(roomNo);
		return messageList;
	}



	/**
	 * 채팅방을 만든다.
	 */
	@Override
	public String makeChat(List<String> empCodeList, String empCode) {
		
		// 채팅방을 만든 사람을 제외한 인원들의 EMP_NO 값들 
		Integer size = empCodeList.size(); 
		
		// empCodeList 에서 첫번째 사원의 이름을 조회해서 채팅방의 이름으로 사용한다. 
		// ex) 최재준 외 5명 
		String invitedEmpNo = empCodeList.get(0);
		String empNickname = chatMapper.EmpNicknameDetail(invitedEmpNo);
		String roomName = empNickname + "외 " + (size) + "명";
		
		// CHAT_ROOM 테이블에 행을 삽입.
		ChatRoom chatRoom = new ChatRoom();
		chatRoom.setEmpCode(Integer.parseInt(empCode));
		chatRoom.setRoomName(roomName);
		chatMapper.makeChat(chatRoom); 
		
		// CHAT_PARTICIPANT 테이블에 행을 삽입 
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
		
		// 관련된 모든 채팅방들 조회  
		List<ChatRoom> roomList = chatMapper.getChattingRooms(empCode); 
		
		// 마지막 채팅 시각, 마지막 채팅 내용 구하기 
		for(ChatRoom chatRoom : roomList) {
			ChatMessageMe lastChatInfo = chatMapper.getLastSentAt(chatRoom.getRoomNo());
			if(lastChatInfo != null) {
				// 마지막 채팅 내용 
				if(lastChatInfo.getContent() != null) {
					if(lastChatInfo.getContent().length() > 20) {
						chatRoom.setContent( lastChatInfo.getContent().substring(0, 20) + "..." );
					} else {
						chatRoom.setContent(lastChatInfo.getContent()); // 마지막 채팅 내용				
					}				
				}
				// 마지막 채팅 시각 
				String lastSentAt = lastChatInfo.getSentAt();
				String lastSentAtStatus = getTimeAgo(lastSentAt);
				chatRoom.setSentAt(lastSentAtStatus);
			}
	

			List<String> empCodeList = chatMapper.chatRoomEmpCodeList(chatRoom.getRoomNo());
			String firstEmpCode = empCodeList.get(0);
			String exposedEmpCode = firstEmpCode;
			if(firstEmpCode.equals(empCode)) {
				// 내가 만든 방이라면, 다른 사람 보여줘야함.
				exposedEmpCode = empCodeList.get(1);
			}
			
			// 지금 exposedEmpCode 에는 보여질 사원의 EmpCode 가 들어있음. 
			// 이를 이용해서 EMPLOYEE 테이블에서 해당 사원에 대한 정보를 가져와보자. 
			Employee2 findEmp = chatMapper.empDetail(exposedEmpCode);
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





	/**
	 * 채팅 글 저장 
	 */
	@Override
	public Employee2 insertTextMessage(ChatMessage chatMessage) {
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
		
		Employee2 findEmp = chatMapper.empDetail(senderEmpCode);
		return findEmp;
	}

	
	
	/**
	 * 채팅메세지 중 파일을 저장하고 뿌려주는 역할 
	 */
	@Override
	public Map<String, String> insertFileMessage(ChatMessage chatMessage) throws IllegalStateException, IOException {
		
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
		
		Employee2 findEmp = chatMapper.empDetail(chatMessage.getSenderEmpCode());
		
		Map<String, String> paramMap = new HashMap<>();
		paramMap.put("empLastName", findEmp.getEmpLastName());
		paramMap.put("empFirstName", findEmp.getEmpFirstName());
		paramMap.put("updatePath", updatePath);
		
		return paramMap; 
	}
		
	
	/**
	 * 채팅방 나가기 
	 */
	@Override
	public Integer exitChatRoom(String currentRoomNo, Employee2 loginEmp) {
		
		Integer exitEmpCode = loginEmp.getEmpCode();
		
		
		// CHAT_PARTICIPANT 에서만 제거시켜주면 될듯 
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("currentRoomNo", currentRoomNo);
		paramMap.put("exitEmpCode", exitEmpCode);
		
		int result = chatMapper.exitChatRoom(paramMap);				
		return result;
		
	}
	
	/**
	 * 사원들, 사원들의 부서, 사원들의 팀 조회  
	 */
	@Override
	public List<Employee2> getEmpList(List<Integer> empCodeList) {
	
		List<Employee2> empList = new ArrayList<>();
		for(Integer empCode : empCodeList) {
			Employee2 findEmp = chatMapper.empDetail(String.valueOf(empCode));
			empList.add(findEmp);
		}
		
		for(Employee2 emp : empList) {
			if(emp.getTeamNo() != null) {
				Employee findEmpDeptTeam = chatMapper.DeptNameTeamNameDetail(emp.getTeamNo());
				emp.setTeamNm(findEmpDeptTeam.getTeamNm());
				emp.setDeptNm(findEmpDeptTeam.getDeptNm());				
			}
		}
		
		return empList;
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