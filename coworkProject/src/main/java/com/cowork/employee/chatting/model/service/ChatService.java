package com.cowork.employee.chatting.model.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.cowork.employee.chatting.model.dto.ChatMessage;
import com.cowork.employee.chatting.model.dto.ChatMessageMe;
import com.cowork.employee.chatting.model.dto.ChatRoom;
import com.cowork.employee.chatting.model.dto.Employee;

public interface ChatService {

	List<Employee> empList(String inputData, Integer empCode);

	String makeChat(List<String> empCodeList, String empCode);

	List<ChatRoom> getChattingRooms(String empCode);

	List<ChatMessageMe> getChatMessage(Map<String, String> paramMap);

	Employee insertTextMessage(ChatMessage chatMessage);

	String insertFileMessage(ChatMessage chatMessage) throws IllegalStateException, IOException;

}
