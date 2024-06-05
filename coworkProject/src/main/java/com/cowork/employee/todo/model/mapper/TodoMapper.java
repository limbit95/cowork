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
	 */
	void insertTodoManager(Todo inputTodo);

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



	void deleteTodoFiles(@Param("todoIds") List<Integer> todoNos);

	int deleteTodos(@Param("todoIds") List<Integer> todoNos);

	void deleteTodoManager(@Param("todoIds") List<Integer> todoNos);

	

	

}
