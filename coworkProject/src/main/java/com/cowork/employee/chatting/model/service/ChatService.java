package com.cowork.employee.chatting.model.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.employee.chatting.model.dto.ChatMessage;
import com.cowork.employee.chatting.model.dto.ChatMessageMe;
import com.cowork.employee.chatting.model.dto.ChatRoom;
import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.user.model.dto.Employee2;

public interface ChatService {
	
	/** 현재 로그인한 사원이 속한 회사의 부서와 팀을 모두 조회 
	 * @param loginEmp
	 * @return
	 */
	List<Department> getDeptAndTeam(Employee2 loginEmp);
	
	
	/** 팀에 소속된 사원들에 대한 리스트를 조회 
	 * @param teamNo
	 * @param loginEmp
	 * @return
	 */
	List<Employee2> getTeamEmps(String teamNo, Employee2 loginEmp );


	/** 이름으로 사원들을 조회
	 * @param inputData
	 * @param loginEmp
	 * @return
	 */
	List<Employee2> empList(String inputData, Employee2 loginEmp);

	/** 채팅 메시지들을 List 자료구조로 가져옴
	 * @param paramMap
	 * @return
	 */
	List<ChatMessageMe> getChatMessage(String roomNo);

	/** 채팅방을 만든다.
	 * @param empCodeList
	 * @param empCode
	 * @return
	 */
	String makeChat(List<String> empCodeList, String empCode);
	
	
	/** 채팅방들을 가져오는 메서드
	 * @param empCode
	 * @return
	 */
	List<ChatRoom> getChattingRooms(String empCode);


	/** 채팅 글 저장 
	 * @param chatMessage 
	 * @return
	 */
	Employee2 insertTextMessage(ChatMessage chatMessage);

	/** 채팅메세지 중 파일을 저장 
	 * @param chatMessage
	 * @return
	 * @throws IllegalStateException
	 * @throws IOException
	 */
	Map<String, String> insertFileMessage(ChatMessage chatMessage) throws IllegalStateException, IOException;

	
	/** 채팅방 나가기 
	 * @param currentRoomNo
	 * @param loginEmp
	 * @return
	 */
	Integer exitChatRoom(String currentRoomNo, Employee2 loginEmp);


	/** 사원들, 사원들의 부서, 사원들의 팀 조회 
	 * @param empCodeList
	 * @return
	 */
	List<Employee2> getEmpList(List<Integer> empCodeList);
	
}
