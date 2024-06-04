package com.cowork.employee.chatting.model.service;

import java.util.List;
import java.util.Map;

import com.cowork.employee.chatting.model.dto.ChatMessageMe;
import com.cowork.employee.chatting.model.dto.ChatRoom;
import com.cowork.employee.chatting.model.dto.Employee;

public interface ChatService {

	List<Employee> empList(String inputData, Integer empCode);

	String makeChat(List<String> empCodeList, String empCode);

	List<ChatRoom> getChattingRooms(String empCode);

	List<ChatMessageMe> getChatMessage(Map<String, String> paramMap, String empNo);

}
