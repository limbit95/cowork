package com.cowork.employee.todo.model.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.employee.todo.model.dto.Todo;

public interface TodoService {


	/** todo 목록 조회 
	 * @return
	 */
	List<Todo> selectTodoList();

	/** 할 일 등록 
	 * @param inputTodo
	 * @param files 
	 * @return
	 */
	int todoInsert(Todo inputTodo, List<MultipartFile> files) throws IllegalStateException, IOException;

	/** 할 일 상세 조회 
	 * @param map
	 * @return
	 */
	Todo todoDetail(Map<String, Integer> map);

	/** 할 일 수정 
	 * @param inputTodo
	 * @param files
	 * @return
	 */
	int todoUpdate(Todo inputTodo, List<MultipartFile> files) throws IllegalStateException, IOException;

	/** 할 일 삭제 
	 * @param todoNoList
	 * @return
	 */
	int todoDelete(List<Integer> todoNoList);



	

}
