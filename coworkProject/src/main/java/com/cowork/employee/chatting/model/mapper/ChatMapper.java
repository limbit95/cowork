package com.cowork.employee.chatting.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.employee.chatting.model.dto.ChatMessage;
import com.cowork.employee.chatting.model.dto.ChatMessageMe;
import com.cowork.employee.chatting.model.dto.ChatParticipant;
import com.cowork.employee.chatting.model.dto.ChatRoom;
import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.chatting.model.dto.SubscribeAddr;
import com.cowork.user.model.dto.Employee2;

@Mapper
public interface ChatMapper {

	List<Employee2> empList(Map<String, Object> paramMap);

	void makeChat(ChatRoom chatRoom);

	String EmpNicknameDetail(String invitedEmpNo);

	void addParticipant(ChatParticipant chatParticipant);

	void addSubscribeAddr(SubscribeAddr subscribeAddrDTO);

	List<ChatRoom> getChattingRooms(String empCode);

	ChatMessageMe getLastSentAt(Integer roomNo);

	Employee findFirstInvited(Integer roomNo);


	List<ChatMessageMe> findAllMessageByRoomNo(String roomNo);

	void insertMessage(Map<String, Object> paramMap);

	int insertFileMessage(ChatMessage chatMessage);

	Employee DeptNameTeamNameDetail(Integer teamNo);

	List<String> chatRoomEmpCodeList(Integer roomNo);

	Employee2 empDetail(String empCode);



}
