package com.cowork.employee.todo.model.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.admin.notice.model.exception.BoardFileDeleteException;
import com.cowork.admin.notice.model.exception.BoardInsertException;
import com.cowork.common.utility.Utility;
import com.cowork.employee.mail.model.exception.MailFileDeleteException;
import com.cowork.employee.notice.model.dto.BoardFile;
import com.cowork.employee.todo.model.dto.Todo;
import com.cowork.employee.todo.model.dto.TodoFile;
import com.cowork.employee.todo.model.exception.TodoDeleteException;
import com.cowork.employee.todo.model.exception.TodoInsertException;
import com.cowork.employee.todo.model.mapper.TodoMapper;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@PropertySource("classpath:/config.properties")
@Transactional(rollbackFor=Exception.class)
@Slf4j
@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService{
	
	private final TodoMapper mapper;
	
	@Value("${todo.file.web-path}")
	private String webPath; 
	
	@Value("${todo.file.folder-path}")
	private String folderPath; 



	// 할 일 목록 조회 
	@Override
	public List<Todo> selectTodoList(int empCode) {
		
		return mapper.selectTodoList(empCode); 
		
	}

	
	// 할 일 등록 
/*	@Override
	public int todoInsert(Todo inputTodo, List<MultipartFile> files, List<String> inChargeEmpList) throws IllegalStateException, IOException {
		
		int result = mapper.todoInsert(inputTodo); 
		
		if(result == 0) {
			
			log.error("todo등록 실패!!");
			return 0; 
		}
		log.info("투두 등록 완료 : " + result);
	    log.info("투두 등록 완 번호!! : " + inputTodo.getTodoNo());
	   
	    int todoNo = inputTodo.getTodoNo();		
		int empCode = inputTodo.getEmpCode(); 
		String empName = mapper.getEmpName(empCode);
		
		log.info("empCode로 가져온 이름: " + empName);
		
		log.info("초기 inputTodo: " + inputTodo.toString());
	    
		// requestEmp 값이 비어 있는 경우
		if (inputTodo.getRequestEmp() == null || inputTodo.getRequestEmp().isEmpty()) {
		    inputTodo.setRequestEmp(empName);
		    log.info("requestEmp 설정: " + inputTodo.getRequestEmp());
		}
	    
	    log.info("최종 inputTodo: " + inputTodo.toString());

	    if(result > 0 && inChargeEmpList != null && !inChargeEmpList.isEmpty()) {
	    	
	        for(String inChargeEmp : inChargeEmpList) {
	            if(inChargeEmp != null && !inChargeEmp.isEmpty()) {
	                Map<String, Object> map = new HashMap<>(); 
	                map.put("todoNo", todoNo); 
	                map.put("inChargeEmp", inChargeEmp); 
	                map.put("loginEmp", empCode);
	                log.info("담당자 등록: " + map);

	                result = mapper.insertTodoManagerList(map); 

	                if(result == 0) {
	                    log.error("투두 담당자 등록 실패!! 담당자: " + inChargeEmp);
	                    return 0;
	                }
	            }
	        }
	    }	    
		//result =  mapper.insertTodoManager(inputTodo);
		
		log.info("투두 담당자 등록 완료 : " + result);
		
		List<TodoFile> uploadList = new ArrayList<>();
		
		for(int i=0; i<files.size(); i++) {
			if(!files.get(i).isEmpty()) {
				String originalName = files.get(i).getOriginalFilename(); 
				String rename = Utility.fileRename(originalName); 
				TodoFile todoFile = TodoFile.builder()
									.fileOriginName(originalName)
									.fileRename(rename)
									.filePath(webPath)
									.todoNo(todoNo)
									.fileOrder(i)
									.uploadFile(files.get(i))
									.build(); 
									
				uploadList.add(todoFile); 
			}
		}
		
		if(uploadList.isEmpty()) {
			
			log.info("등록된 파일 없음!! : " + result);
			return result; 
		}
		
		log.info("등록할 파일리스트 : " + uploadList.size());
		result = mapper.insertUploadList(uploadList);
		
		if(result == uploadList.size()) {
			for(TodoFile file : uploadList) {
                files.get(file.getFileOrder())
                    .transferTo(new File(folderPath + file.getFileRename()));
            }
			
			log.info("투두 파일들 등록 완료!!");
			
		} else {
			
			log.error("파일 등록 실패.. : " + uploadList.size() + ", !! 얻은 결과 !! : " + result);
			return 0; 
		}
		
		return result; 
		
	} 
	*/


	// 할 일 상세 조회 
	@Override
	public Todo todoDetail(Map<String, Integer> map) {
		
		return mapper.todoDetail(map);
	}

	// 할 일 삭제 
	@Override
	public int todoDelete(List<Integer> todoNos) {
		
		log.info("todoNos :::: " + todoNos.toString());
		
		  try {
	            // 순서대로 삭제
	            mapper.deleteTodoFiles(todoNos);
	            mapper.deleteTodoManagers(todoNos);
	            return mapper.deleteTodos(todoNos);
	            
	        } catch (Exception e) {
	            System.err.println("Error deleting todos: " + e.getMessage());
	            
	            e.printStackTrace();
	            return 0;
	        }
	}


	// 파일 조회 
	@Override
	public List<TodoFile> todoFiles(int todoNo) {
		
		return mapper.todoFiles(todoNo);
	}


	// 할 일 완료 여부 변경 
	@Override
	public boolean updateTodoComplete(int todoNo, String todoComplete) {
		
		int result = mapper.updateTodoComplete(todoNo, todoComplete);
		
		return result > 0;
	}


	// 검색한 경우 조회 
	@Override
	public List<Todo> todoQueryList(String todoQuery, int empCode) {
		
		//int listCount = mapper.getSearchCount(todoQuery); 		
		
		List<Todo> todoList = mapper.todoQueryList(todoQuery, empCode);
		
		return todoList;
	}

	// 조건별 조회 
	@Override
	public List<Todo> getFilteredTodos(Map<String, Object> filters) {
		
		return mapper.getFilteredTodos(filters);
	}


	// 담당자 여러명인 경우 조회 
	@Override
	public List<Map<String, Object>> getEmpList(int todoNo) {
	    List<Map<String, Object>> empList = mapper.getEmpList(todoNo);
	    log.info("getEmpList 결과: " + empList);
	    return empList;
	}


	// 할 일 수정 
	@Override
	public int todoUpdate(Todo inputTodo, List<MultipartFile> files, String deleteOrder, String updateOrder, List<String> inChargeEmpList)
	        throws FileNotFoundException, IOException {

	    int todoNo = inputTodo.getTodoNo();

	    // 할 일 업데이트
	    int result = mapper.todoUpdate(inputTodo);

	    if (result == 0) {
	        log.error("투두 업데이트 실패!!");
	        return 0;
	    }

	    // 기존 담당자 가져오기
	    List<Map<String, Object>> originInChargeEmpData = mapper.getEmpList(todoNo);
	    if (originInChargeEmpData == null) {
	        originInChargeEmpData = new ArrayList<>();
	    }

	    log.info("originInChargeEmpData: " + originInChargeEmpData);
	    
	    List<String> originInChargeEmpList = new ArrayList<>();
	    for (Map<String, Object> empData : originInChargeEmpData) {
	    	log.info("empData: " + empData);
	    	
	    	if (empData.get("EMPCODE") != null) { // "empCode" 대신 "EMPCODE"로 수정
	            originInChargeEmpList.add(empData.get("EMPCODE").toString());
	        }
	    }
	    
	    log.info("기존 담당자: " + originInChargeEmpList);

	    // 기존 담당자와 새로운 담당자 비교하여 삭제할 것과 추가할 것 결정
	    List<String> toDelete = new ArrayList<>(originInChargeEmpList);
	    toDelete.removeAll(inChargeEmpList);

	    List<String> toAdd = new ArrayList<>(inChargeEmpList);
	    toAdd.removeAll(originInChargeEmpList);

	    // 삭제할 담당자 처리
	    for (String emp : toDelete) {
	        if (emp != null && !emp.isEmpty()) {
	            Map<String, Object> map = new HashMap<>();
	            map.put("todoNo", todoNo);
	            map.put("inChargeEmp", emp);
	            log.info("담당자 삭제: " + map);

	            result = mapper.deleteTodoManager(map);

	            if (result == 0) {
	                log.error("투두 담당자 삭제 실패!! 담당자: " + emp);
	                return 0;
	            }
	        }
	    }

	    // 추가할 담당자 처리
	    for (String emp : toAdd) {
	        if (emp != null && !emp.isEmpty()) {
	            Map<String, Object> map = new HashMap<>();
	            map.put("todoNo", todoNo);
	            map.put("inChargeEmp", emp);
	            log.info("담당자 등록: " + map);

	            result = mapper.insertTodoManagerList(map);

	            if (result == 0) {
	                log.error("투두 담당자 등록 실패!! 담당자: " + emp);
	                return 0;
	            }
	        }
	    }


	    // 기존 파일 목록 가져오기
	   // List<TodoFile> originFiles = mapper.todoFiles(todoNo);

	    // 삭제할 파일 처리
	    if (deleteOrder != null && !deleteOrder.equals("")) {
		    Map<String, Object> map = new HashMap<>();
		    map.put("deleteOrder", deleteOrder);
		    map.put("todoNo", todoNo);

		    result = mapper.deleteOriginFile(map);

		    if (result == 0) throw new MailFileDeleteException();
		    
	    }
	   

	    // 파일 순서 업데이트 처리
	    if (updateOrder != null && !updateOrder.isEmpty()) {
	        String[] updateArr = updateOrder.split(",");
	        
	        int order = 0; 
	        for(String fileOrder : updateArr) {
	        	if(!deleteOrder.contains(fileOrder)) {
	        		  TodoFile updateFile = TodoFile.builder()
			                    .fileOrder(order++) // 새로운 파일 순서!
			                    .todoNo(todoNo)
			                    .updateFileOrder(fileOrder) // 기존 순서 
			                    .build();

		            result = mapper.fileOrderUpdate(updateFile);
	        	}
	        }
	      
	    }

	    // 새 파일 추가
	    if (files != null && !files.isEmpty()) {
	        List<TodoFile> uploadList = new ArrayList<>();
	        int fileOrder = 0; 
	        
	        if (updateOrder != null && !updateOrder.equals("")) {
		    	String[] updateArr = updateOrder.split(",");
		        fileOrder = updateArr.length;
		    }

	        for (int i = 0; i < files.size(); i++) {
	            if (!files.get(i).isEmpty()) {
	                String originalName = files.get(i).getOriginalFilename(); // 원본명
	                String rename = Utility.fileRename(originalName);

	                TodoFile file = TodoFile.builder()
	                        .filePath(webPath)
	                        .fileOriginName(originalName)
	                        .fileRename(rename)
	                        .fileOrder(fileOrder++)
	                        .todoNo(todoNo)
	                        .uploadFile(files.get(i))
	                        .build();
	                uploadList.add(file);
	            }
	        }

	        if (!uploadList.isEmpty()) {
	        
	        	result = mapper.insertUploadList(uploadList);
	        	
	        	if(result == uploadList.size()) {
	        		for(TodoFile file : uploadList) {
	        			file.getUploadFile().transferTo(new File (folderPath + file.getFileRename()));
	        		}
	        	} else {
	        		throw new BoardInsertException("파일이 정상 삽입되지 않음"); 
	        	}
	        }
	    } 
	       
	    return result;
	}



	// 사원 검색 
	@Override
	public List<Employee2> todoEmpSearch(String empName, int comNo) {
		
		List<Employee2> employeeList = new ArrayList<>(); 
		
		if(empName.equals("")) {
			employeeList = mapper.employeeSearch(comNo); 
		} else {
			Map<String, Object> map = new HashMap<>(); 
			
			map.put("empName", empName); 
			map.put("comNo", comNo); 
			
			employeeList = mapper.employeeListSearch(map); 
		}
		
		log.info("empName : " + empName);
		
		return employeeList;
		
	}


	@Override
	public int todoInsert(Todo inputTodo, List<MultipartFile> files, List<String> inChargeEmpList)
			throws IllegalStateException, IOException {
		
		int result = mapper.todoInsert(inputTodo); 
	    
	    if(result == 0) {
	        log.error("todo 등록 실패!!");
	        return 0; 
	    }

	    log.info("투두 등록 완료 : " + result);
	    log.info("투두 등록 완료 번호!! : " + inputTodo.getTodoNo());

	    int todoNo = inputTodo.getTodoNo();		
	    int empCode = inputTodo.getEmpCode(); 
	    String empName = mapper.getEmpName(empCode);
	    
	    log.info("empCode로 가져온 이름: " + empName);
	    log.info("초기 inputTodo: " + inputTodo.toString());
	    
	    // requestEmp 값이 비어 있는 경우
	    if (inputTodo.getRequestEmp() == null || inputTodo.getRequestEmp().isEmpty()) {
	        inputTodo.setRequestEmp(empName);
	        log.info("requestEmp 설정: " + inputTodo.getRequestEmp());
	    }
	    
	    log.info("최종 inputTodo: " + inputTodo.toString());

	    // 담당자 등록
	    if(inChargeEmpList != null && !inChargeEmpList.isEmpty()) {
	        for(String inChargeEmp : inChargeEmpList) {
	            if(inChargeEmp != null && !inChargeEmp.isEmpty()) {
	                Map<String, Object> map = new HashMap<>(); 
	                map.put("todoNo", todoNo); 
	                map.put("inChargeEmp", Integer.parseInt(inChargeEmp));  
	                map.put("loginEmp", empCode);
	                log.info("담당자 등록: " + map);

	                result = mapper.insertTodoManagerList(map); 

	                if(result == 0) {
	                    log.error("투두 담당자 등록 실패!! 담당자: " + inChargeEmp);
	                    return 0;
	                }
	            }
	        }
	    }	    
	    log.info("투두 담당자 등록 완료 : " + result);
	    
	    // 파일 업로드 처리
	    List<TodoFile> uploadList = new ArrayList<>();
	    
	    if(files != null && !files.isEmpty()) {
	    for(int i=0; i< files.size(); i++) {
	        if(!files.get(i).isEmpty()) {
	            String originalName = files.get(i).getOriginalFilename(); 
	            String rename = Utility.fileRename(originalName); 
	            TodoFile todoFile = TodoFile.builder()
	                                .fileOriginName(originalName)
	                                .fileRename(rename)
	                                .filePath(webPath)
	                                .todoNo(todoNo)
	                                .fileOrder(i)
	                                .uploadFile(files.get(i))
	                                .build(); 
	                                
	            uploadList.add(todoFile); 
	        }
	    }
	    
	    }
	    
	    if(uploadList.isEmpty()) {
	        log.info("등록된 파일 없음!! : " + result);
	        return result; 
	    }
	    
	    log.info("등록할 파일 리스트 : " + uploadList.size());
	    result = mapper.insertUploadList(uploadList);
	    
	    if(result == uploadList.size()) {
	        for(TodoFile file : uploadList) {
	            files.get(file.getFileOrder()).transferTo(new File(folderPath + file.getFileRename()));
	        }
	        log.info("투두 파일들 등록 완료!!");
	    } else {
	        log.error("파일 등록 실패.. : " + uploadList.size() + ", !! 얻은 결과 !! : " + result);
	        return 0; 
	    }
	    
	    return result; 
		
	}


	@Override
	public List<Todo> userMainTodoList(int empCode) {
		
		return mapper.userMainTodoList(empCode);
	}
	


}
	






	


	


