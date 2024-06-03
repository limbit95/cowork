package com.cowork.employee.todo.model.service;

import java.util.List;
import java.util.Map;

import com.cowork.employee.todo.model.dto.Todo;

public interface TodoService {


	/** todo 목록 조회 
	 * @return
	 */
	List<Todo> selectTodoList();

	/** 할 일 상세 조회 
	 * @param todoNo
	 * @return
	 */
	/*Todo todoDetail(int todoNo); */

}
