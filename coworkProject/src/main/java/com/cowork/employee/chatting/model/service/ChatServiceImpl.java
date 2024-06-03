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
		// TODO Auto-generated method stub
		return null;
	}

	
	
}
