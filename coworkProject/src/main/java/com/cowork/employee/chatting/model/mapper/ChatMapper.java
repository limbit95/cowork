package com.cowork.employee.chatting.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.employee.chatting.model.dto.ChatMessage;
import com.cowork.employee.chatting.model.dto.ChatMessageMe;
import com.cowork.employee.chatting.model.dto.ChatParticipant;
import com.cowork.employee.chatting.model.dto.ChatRoom;
import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.chatting.model.dto.SubscribeAddr;
import com.cowork.user.model.dto.Employee2;

@Mapper
public interface ChatMapper {
	
	/** 현재 로그인한 사원이 속한 회사의 부서와 팀을 모두 조회 
	 * @param comNo
	 * @return
	 */
	List<Department> getDeptAndTeam(Integer comNo);
	
	/** 현재 로그인한 사원을 제외하고, 해당 팀에 소속된 사원들을 조회
	 * @param paramMap
	 * @return
	 */
	List<Employee2> getTeamEmps(Map<String, Object> paramMap);
	
	/** 사원들의 부서이름, 팀이름을 조회
	 * @param teamNo
	 * @return
	 */
	Employee DeptNameTeamNameDetail(Integer teamNo);


	/** 이름으로 사원들을 조회
	 * @param paramMap
	 * @return
	 */
	List<Employee2> empList(Map<String, Object> paramMap);
	
	/** 특정 채팅방에 있는 모든 채팅메시지를 가져옴 
	 * @param roomNo
	 * @return
	 */
	List<ChatMessageMe> findAllMessageByRoomNo(String roomNo);


	/** empCode 로 사원의 이름을 조회 
	 * @param invitedEmpNo
	 * @return
	 */
	String EmpNicknameDetail(String invitedEmpNo);

	
	/** CHAT_ROOM 테이블에 행 삽입(채팅방을 만듦)
	 * @param chatRoom
	 */
	void makeChat(ChatRoom chatRoom);


	/** CHAT_PARTICIPANT 테이블에 행 삽입(채팅 참여자 기록)
	 * @param chatParticipant
	 */
	void addParticipant(ChatParticipant chatParticipant);

	
	/** 구독주소 삽입 
	 * @param subscribeAddrDTO
	 */
	void addSubscribeAddr(SubscribeAddr subscribeAddrDTO);

	
	/** 특정 empCode와 관련된 채팅방들 조회 
	 * @param empCode
	 * @return
	 */
	List<ChatRoom> getChattingRooms(String empCode);
	
	
	/** 마지막 채팅 내용, 마지막 채팅시각 조회 
	 * @param roomNo
	 * @return
	 */
	ChatMessageMe getLastSentAt(Integer roomNo);

	
	/**	특정 채팅방과 관련된 모든 사원들을 조회
	 * @param roomNo
	 * @return
	 */
	List<String> chatRoomEmpCodeList(Integer roomNo);
	

	/** 채팅 글 저장 
	 * @param paramMap
	 */
	void insertMessage(Map<String, Object> paramMap);	
	
	/** 채팅메세지 중 파일을 저장하고 뿌려주는 역할 
	 * @param chatMessage
	 * @return
	 */
	int insertFileMessage(ChatMessage chatMessage);

	
	/** 채팅방 나가기 
	 * @param paramMap
	 * @return
	 */
	int exitChatRoom(Map<String, Object> paramMap);	
	
	/** 사원 찾기 
	 * @param empCode
	 * @return
	 */
	Employee2 empDetail(String empCode);
	
	//Employee findFirstInvited(Integer roomNo);









}
