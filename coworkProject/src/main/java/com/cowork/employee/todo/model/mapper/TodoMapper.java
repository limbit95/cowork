package com.cowork.employee.todo.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.employee.todo.model.dto.Todo;
import com.cowork.employee.todo.model.dto.TodoFile;

@Mapper
public interface TodoMapper {

	/** todoList 조회 
	 * @param empCode 
	 * @return
	 */
	List<Todo> selectTodoList();

	/** 할 일 등록 
	 * @param inputTodo
	 * @return
	 */
	int todoInsert(Todo inputTodo);

	/** 파일 등록 
	 * @param uploadList
	 * @return 
	 */
	int insertUploadList(List<TodoFile> files);

	/** 담당자 지정시 등록 
	 * @param inputTodo
	 * @return 
	 */
	int insertTodoManager(Todo inputTodo);

	/** 할 일 상세 조회 
	 * @param map
	 * @return
	 */
	Todo todoDetail(Map<String, Integer> map);

	/** 할 일 수정 
	 * @param inputTodo
	 * @return
	 */
	int todoUpdate(Todo inputTodo);

	/** 담당자 수정 
	 * @param inputTodo
	 * @return 
	 */
	int todoManagerUpdate(Todo inputTodo);


	/** 파일 삭제 
	 * @param todoNos
	 */
	void deleteTodoFiles(@Param("todoIds") List<Integer> todoNos);

	/** 할 일 삭제 
	 * @param todoNos
	 * @return
	 */
	int deleteTodos(@Param("todoIds") List<Integer> todoNos);

	/** 담당자 삭제 
	 * @param todoNos
	 */
	void deleteTodoManager(@Param("todoIds") List<Integer> todoNos);

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
	int updateTodoComplete(@Param("todoNo") int todoNo, @Param("todoComplete") String todoComplete);

	List<Todo> todoInCharge(String sortBy);

	List<Todo> todoRequested(String sortBy);

	List<Todo> todoCompleted(String sortBy);

	List<Todo> todoInProgress(String sortBy);

	int updateUploadList(List<TodoFile> uploadList);

	/** 수정시 기존 파일 삭제 
	 * @param inputTodo
	 */
	void deleteOriginTodoFiles(int todoNo);

	

	

}
