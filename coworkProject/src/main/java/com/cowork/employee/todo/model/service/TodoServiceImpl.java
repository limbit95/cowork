package com.cowork.employee.todo.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.cowork.employee.todo.model.dto.Todo;
import com.cowork.employee.todo.model.mapper.TodoMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService{
	
	private final TodoMapper mapper;


	// 할 일 목록 조회 
	@Override
	public List<Todo> selectTodoList() {
		
		return mapper.selectTodoList();
		
		
	}


	// 할 일 상세 조회 
	/*	@Override
	public Todo todoDetail(int todoNo) {
		
		return mapper.todoDetail(todoNo);
	} */

}
