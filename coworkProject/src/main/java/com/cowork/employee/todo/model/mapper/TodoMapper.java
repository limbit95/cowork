package com.cowork.employee.todo.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.employee.todo.model.dto.Todo;
import com.cowork.employee.todo.model.dto.TodoFile;
import com.cowork.user.model.dto.Employee2;

@Mapper
public interface TodoMapper {

	/** todoList 조회 
	 * @param empCode 
	 * @param empCode 
	 * @return
	 */
	List<Todo> selectTodoList(int empCode);

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
	 * @param inChargeEmps 
	 * @return 
	 */
//	int insertTodoManager(Todo inputTodo, String inChargeEmps);

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


	/** 파일 삭제 (삭제시 투두 파일들 전부 삭제하게)
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
	 * @return 
	 */
	int deleteTodoManagers(@Param("todoIds") List<Integer> todoNos);

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

	/** 파일 업로드 
	 * @param uploadList
	 * @return
	 */
	int updateUploadList(List<TodoFile> uploadList);  

	/** 수정시 기존 파일 삭제 
	 * @param inputTodo
	 * @return 
	 */
	int deleteOriginTodoFiles(int todoNo);

	/** 검색한 경우 투두리스트 
	 * @param todoQuery
	 * @return
	 */
	List<Todo> todoQueryList(@Param("todoQuery") String todoQuery, @Param("empCode") int empCode);

	/** 조건별 할 일 목록 조회 
	 * @param filters
	 * @return
	 */
	List<Todo> getFilteredTodos(Map<String, Object> filters);

	/** empCode로 사원 이름 불러오기 
	 * @param empCode
	 * @return
	 */
	String getEmpName(int empCode);

	/** 담당자 여러명 등록 
	 * @param map
	 * @return
	 */
	int insertTodoManagerList(Map<String, Object> map);

	/** 담당자 여러명 조회 
	 * @param todoNo
	 * @return
	 */
	List<Map<String, Object>> getEmpList(int todoNo);

	/** 담당자 여러명인 경우 수정시 삭제 
	 * @param todoNo
	 */
	void deleteTodoManagerOne(int todoNo);
	
	 
    /** 파일 수정시 삭제 
     * @param map
     * @return
     */
    int deleteOriginFile(Map<String, Object> map);

	
	/** 파일 수정시 업로드 
	 * @param todoFile
	 * @return
	 */
	int updateUploadList(TodoFile todoFile);

	int deleteTodoFile(int fileNo);

	int deleteTodoManager(Map<String, Object> map);

	int fileOrderUpdate(TodoFile updateFile);

	int deleteFiles(Map<String, Object> map);

	/** 사원 검색 
	 * @param comNo
	 * @return
	 */
	List<Employee2> employeeSearch(int comNo);

	/** 사원 검색 
	 * @param map
	 * @return
	 */
	List<Employee2> employeeListSearch(Map<String, Object> map);
	
	




	

	

}
