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
	 * @param empCode 
	 * @return
	 */
	List<Todo> selectTodoList(int empCode);

	/** 할 일 등록 
	 * @param inputTodo
	 * @param files 
	 * @param inChargeEmpList 
	 * @return
	 */
	int todoInsert(Todo inputTodo, List<MultipartFile> files, List<String> inChargeEmpList) throws IllegalStateException, IOException;

	/** 할 일 상세 조회 
	 * @param map
	 * @return
	 */
	Todo todoDetail(Map<String, Integer> map);

	/** 할 일 수정 
	 * @param inputTodo
	 * @param files
	 * @param inChargeEmpList 
	 * @param deletedFileList 
	 * @param newFileList 
	 * @param uploadedFileList 
	 * @return
	 */
	int todoUpdate(Todo inputTodo, List<MultipartFile> files, List<String> inChargeEmpList, 
			List<TodoFile> uploadedFileList, List<TodoFile> newFileList, List<TodoFile> deletedFileList) throws IllegalStateException, IOException; 

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

	/** 검색한 경우 투두리스트 
	 * @param todoQuery
	 * @param empCode 
	 * @return
	 */
	List<Todo> todoQueryList(String todoQuery, int empCode);

	/** 조건별 조회 
	 * @param filters
	 * @return
	 */
	List<Todo> getFilteredTodos(Map<String, Object> filters);

	/** 담당자 여러명인 경우 
	 * @param todoNo
	 * @return
	 */
	List<String> getEmpList(int todoNo);

	
		


}
