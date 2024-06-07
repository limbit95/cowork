package com.cowork.employee.todo.model.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.employee.todo.model.dto.Todo;
import com.cowork.employee.todo.model.dto.TodoFile;

public interface TodoService {


	/** todo 목록 조회 
	 * @param empCode 
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

	/** 파일 조회 
	 * @param todoNo
	 * @return
	 */
	List<TodoFile> todoFiles(int todoNo);

	/** 할 일 완료 여부 수정 
	 * @param todoNo
	 * @param todoComplete
	 * @return
	 */
	boolean updateTodoComplete(int todoNo, String todoComplete);

	List<Todo> getInChargeTodo(String sortBy);

	List<Todo> getRequestedTodo(String sortBy);

	List<Todo> getCompletedTodo(String sortBy);

	List<Todo> getInProgressTodo(String sortBy); 



	

}
