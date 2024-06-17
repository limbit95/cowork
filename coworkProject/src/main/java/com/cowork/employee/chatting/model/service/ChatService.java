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

	List<Employee2> empList(String inputData, Integer empCode);

	String makeChat(List<String> empCodeList, String empCode);

	List<ChatRoom> getChattingRooms(String empCode);

	List<ChatMessageMe> getChatMessage(Map<String, String> paramMap);

	Employee2 insertTextMessage(ChatMessage chatMessage);

	Map<String, String> insertFileMessage(ChatMessage chatMessage) throws IllegalStateException, IOException;

	Integer exitChatRoom(String currentRoomNo, Employee2 loginEmp);

	List<Department> getDeptAndTeam(Employee2 loginEmp);

	List<Employee2> getTeamEmps(String teamNo, Employee2 loginEmp );

	List<Employee2> getEmpList(List<Integer> empCodeList);
	
}
