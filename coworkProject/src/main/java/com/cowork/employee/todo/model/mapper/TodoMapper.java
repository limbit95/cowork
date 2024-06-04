package com.cowork.employee.todo.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.employee.todo.model.dto.Todo;

@Mapper
public interface TodoMapper {

	/** todoList 조회 
	 * @return
	 */
	List<Todo> selectTodoList();

	/** 할 일 상세 조회 
	 * @param todoNo
	 * @return
	 */
/*	Todo todoDetail(int todoNo); */

}
