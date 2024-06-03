package com.cowork.employee.chatting.model.service;

import java.util.List;

import com.cowork.employee.chatting.model.dto.Employee;

public interface ChatService {

	List<Employee> empList(String inputData, Integer empCode);

	String makeChat(List<String> empNoList, String empNo);

}
