package com.cowork.employee.chatting.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.employee.chatting.model.dto.ChatMessageMe;
import com.cowork.employee.chatting.model.dto.ChatParticipant;
import com.cowork.employee.chatting.model.dto.ChatRoom;
import com.cowork.employee.chatting.model.dto.Employee;
import com.cowork.employee.chatting.model.dto.SubscribeAddr;

@Mapper
public interface ChatMapper {

	List<Employee> empList(Map<String, Object> paramMap);

	void makeChat(ChatRoom chatRoom);

	String EmpNicknameDetail(String invitedEmpNo);

	void addParticipant(ChatParticipant chatParticipant);

	void addSubscribeAddr(SubscribeAddr subscribeAddrDTO);

	List<ChatRoom> getChattingRooms(String empCode);

	ChatMessageMe getLastSentAt(Integer roomNo);

	Employee findFirstInvited(Integer roomNo);

}
