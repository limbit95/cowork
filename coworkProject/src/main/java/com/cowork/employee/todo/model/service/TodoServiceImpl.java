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
import com.cowork.employee.notice.model.dto.BoardFile;
import com.cowork.employee.todo.model.dto.Todo;
import com.cowork.employee.todo.model.dto.TodoFile;
import com.cowork.employee.todo.model.exception.TodoDeleteException;
import com.cowork.employee.todo.model.exception.TodoInsertException;
import com.cowork.employee.todo.model.mapper.TodoMapper;

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
	@Override
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


	// 할 일 상세 조회 
	@Override
	public Todo todoDetail(Map<String, Integer> map) {
		
		return mapper.todoDetail(map);
	}


	// 할 일 수정 
/*	@Override
	public int todoUpdate(Todo inputTodo, List<MultipartFile> files, List<String> inChargeEmpList) throws IllegalStateException, IOException {
		
		
		int result = mapper.todoUpdate(inputTodo); 
		
		if(result == 0) {
			log.error("수정 실패..");
			return 0; 
		}
		
		int todoNo = inputTodo.getTodoNo(); 
		int empCode = inputTodo.getEmpCode(); 
		String empName = mapper.getEmpName(empCode);
		
		// requestEmp 값이 비어 있는 경우
		if (inputTodo.getRequestEmp() == null || inputTodo.getRequestEmp().isEmpty()) {
		    inputTodo.setRequestEmp(empName);
		    log.info("requestEmp 설정: " + inputTodo.getRequestEmp());
		}
		
		// 담당자 수정일 경우 먼저 등록되어있는 담당자 삭제 
		mapper.deleteTodoManagerOne(todoNo);
		
		 if(result > 0 ) {
	    	for(String inChargeEmps : inChargeEmpList) {
	    		
	    		Map<String, Object> map = new HashMap<>(); 
	    		map.put("todoNo", todoNo); 
	    		map.put("inChargeEmp", inChargeEmps); 
	    		
	    		result = mapper.insertTodoManagerList(map);
	    	}
	    }
        
        if(result == 0) {
        	
        	log.error("담당자 업데이트 실패..");
        	return 0; 
        }
		
        log.info("담당자 수정 완료 : " + result); 
        
        // 파일 처리 로직
        List<TodoFile> existingFiles = mapper.todoFiles(todoNo);
        log.info("기존 파일들  : " + existingFiles);
        
        // 업로드할 파일 리스트
        List<TodoFile> uploadList = new ArrayList<>();
        
        for(int i = 0; i < files.size(); i++) {
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
        
        log.info("업로드할 파일들 : " + uploadList);
        
        // 기존 파일과 비교하여 삭제할 파일 결정
        List<TodoFile> filesToDelete = new ArrayList<>();
        for(TodoFile existingFile : existingFiles) {
            if(!uploadList.contains(existingFile.getFileOriginName())) {
                filesToDelete.add(existingFile);
            }
        }
        
        log.info("삭제할 파일들 : " + filesToDelete);
        
        // 파일 삭제
        for(TodoFile fileToDelete : filesToDelete) {
            mapper.deleteOriginFile(fileToDelete.getFileNo());
            new File(folderPath + fileToDelete.getFileRename()).delete();
        }
        
       log.info("파일 삭제 후 uploadList : " + uploadList);
        
        
        // 새로운 파일 추가
        if(!uploadList.isEmpty()) {
            result = mapper.insertUploadList(uploadList);
            
            if(result == uploadList.size()) {
                for(TodoFile file : uploadList) {
                    files.get(file.getFileOrder())
                        .transferTo(new File(folderPath + file.getFileRename()));
                }
                log.info("파일 업데이트 완료");
            } else {
                log.error("파일 등록 실패.." + uploadList.size() + " 얻은 결과 : " + result);
                return 0;
            }
        } else {
            log.info("등록할 파일 없음 : " + result);
            mapper.deleteOriginTodoFiles(todoNo);
        }

        return result;
	} 
	*/
	
	//@Override
/*	public int todoUpdate(	Todo inputTodo, 
							@RequestParam List<MultipartFile> files, 
							List<String> inChargeEmpList,
							List<TodoFile> uploadedFileList, List<TodoFile> newFileList, List<TodoFile> deletedFileList) throws IllegalStateException, IOException {

	    int result = mapper.todoUpdate(inputTodo);

	    if(result == 0) {
	        log.error("수정 실패..");
	        return 0;
	    }

	    int todoNo = inputTodo.getTodoNo();
	    int empCode = inputTodo.getEmpCode();
	    String empName = mapper.getEmpName(empCode);
	    
	    log.info("업로드 리스트트트트트트트 : " + uploadedFileList); 
	    log.info("새파일 리스트트트트트트트 : " + newFileList); 
	    log.info("삭제 리스트트트트트트트 : " + deletedFileList); 
	    
	    // requestEmp 값이 비어 있는 경우
	    if (inputTodo.getRequestEmp() == null || inputTodo.getRequestEmp().isEmpty()) {
	        inputTodo.setRequestEmp(empName);
	        log.info("requestEmp 설정: " + inputTodo.getRequestEmp());
	    }

	    // 담당자 수정일 경우 먼저 등록되어있는 담당자 삭제
	    mapper.deleteTodoManagerOne(todoNo);

	    if(result > 0 ) {
	        for(String inChargeEmp : inChargeEmpList) {
	            if(inChargeEmp != null && !inChargeEmp.isEmpty()) {
	                Map<String, Object> map = new HashMap<>();
	                map.put("todoNo", todoNo);
	                map.put("inChargeEmp", inChargeEmp);
	                log.info("담당자 등록: " + map);

	                result = mapper.insertTodoManagerList(map);

	                if(result == 0) {
	                    log.error("투두 담당자 등록 실패!! 담당자: " + inChargeEmp);
	                    return 0;
	                }
	            }
	        }
	    }
	    
	    // 기존 파일 처리
	    List<TodoFile> originFiles = mapper.todoFiles(todoNo);
	    
	    // 기존 파일과의 비교 후 삭제 및 추가 로직
	    if (uploadedFileList != null) {
	        for (TodoFile originFile : originFiles) {
	            boolean fileExists = uploadedFileList.stream()
	                .anyMatch(uploadFile -> uploadFile.getFileOriginName().equals(originFile.getFileOriginName()));

	            if (!fileExists) {
	                // 기존 파일 목록에서 사라진 경우 삭제
	                result = mapper.deleteOriginFile(originFile.getFileNo(), todoNo);

	                if (result > 0) {
	                    File fileToDelete = new File(folderPath + originFile.getFileRename());
	                    if (fileToDelete.exists()) {
	                        fileToDelete.delete();
	                    }
	                }
	            }
	        }
	    }

	    // 새로 추가된 파일 처리
	    if (newFileList != null && !newFileList.isEmpty()) {
	        result = mapper.insertNewFiles(newFileList, todoNo);
	        for (MultipartFile newFile : files) {
	            String originalName = newFile.getOriginalFilename();
	            String rename = Utility.fileRename(originalName);
	            File dest = new File(folderPath + rename);
	            newFile.transferTo(dest);
	        }
	    }

	    // 삭제된 파일 처리
	    if (deletedFileList != null && !deletedFileList.isEmpty()) {
	        for (TodoFile deletedFile : deletedFileList) {
	            result = mapper.deleteOriginFile(deletedFile.getFileNo(), todoNo);
	            if (result > 0) {
	                File fileToDelete = new File(folderPath + deletedFile.getFileRename());
	                if (fileToDelete.exists()) {
	                    fileToDelete.delete();
	                }
	            }
	        }
	    }

	    return result;

	}
*/

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
	public List<String> getEmpList(int todoNo) {
		
		return mapper.getEmpList(todoNo);
	}


/*	@Override
	public int todoUpdate(Todo inputTodo, List<TodoFile> newFileList, List<TodoFile> uploadedFileList,
			List<TodoFile> deletedFileList) throws FileNotFoundException, IOException {
		
		 int result = mapper.todoUpdate(inputTodo);

		    if(result == 0) {
		        log.error("수정 실패..");
		        return 0;
		    }

		    int todoNo = inputTodo.getTodoNo();
		    int empCode = inputTodo.getEmpCode();
		    String empName = mapper.getEmpName(empCode);

		    log.info("업로드 리스트 : " + uploadedFileList); 
		    log.info("새 파일 리스트 : " + newFileList); 
		    log.info("삭제 리스트 : " + deletedFileList); 
		    
		    if (inputTodo.getRequestEmp() == null || inputTodo.getRequestEmp().isEmpty()) {
		        inputTodo.setRequestEmp(empName);
		        log.info("requestEmp 설정: " + inputTodo.getRequestEmp());
		    }

		    // inChargeEmpList가 null인 경우 빈 리스트로 초기화
		    if (inputTodo.getInChargeEmpList() == null) {
		        inputTodo.setInChargeEmpList(new ArrayList<>());
		    }

		    mapper.deleteTodoManagerOne(todoNo);

		    if(result > 0 ) {
		        for(String inChargeEmp : inputTodo.getInChargeEmpList()) {
		            if(inChargeEmp != null && !inChargeEmp.isEmpty()) {
		                Map<String, Object> map = new HashMap<>();
		                map.put("todoNo", todoNo);
		                map.put("inChargeEmp", inChargeEmp);
		                log.info("담당자 등록: " + map);

		                result = mapper.insertTodoManagerList(map);

		                if(result == 0) {
		                    log.error("투두 담당자 등록 실패!! 담당자: " + inChargeEmp);
		                    return 0;
		                }
		            }
		        }
		    }

		   
		 // 새로운 파일 저장
		    if (!newFileList.isEmpty()) {
		        for (TodoFile newFile : newFileList) {
		            byte[] fileData = Base64.getDecoder().decode(newFile.getFileData().split(",")[1]);
		            String originalName = newFile.getFileOriginName();
		            String rename = Utility.fileRename(originalName);
		            String filePath = "/images/todo/";

		            // 파일 저장 로직 추가
		            File file = new File(filePath + rename);
		            try (FileOutputStream fos = new FileOutputStream(file)) {
		                fos.write(fileData);
		            }

		            newFile.setFilePath(filePath);
		            newFile.setFileRename(rename);
		            newFile.setTodoNo(todoNo);
		        }
		        result = mapper.insertNewFiles(newFileList);
		    }

		    if (newFileList != null && !newFileList.isEmpty()) {
		    	
		        for (TodoFile file : newFileList) {
		            file.setTodoNo(todoNo);
		            file.setFilePath("/images/todo/");
		            file.setFileRename(UUID.randomUUID().toString() + "_" + file.getFileOriginName());
		            mapper.insertNewFile(file);
		            file.getUploadFile().transferTo(new File(file.getFilePath() + file.getFileRename()));
		        }
		    }
		    // 삭제된 파일 처리
		    // 기존 파일 삭제 로직
		    for (TodoFile file : deletedFileList) {
		        result = mapper.deleteOriginFile(file.getFileNo());
		        if (result > 0) {
		            File fileToDelete = new File(file.getFilePath() + file.getFileRename());
		            if (fileToDelete.exists()) {
		                fileToDelete.delete();
		            }
		        }
		    }
		            

		    return result;
	}*/


	@Override
	public int todoUpdate(Todo inputTodo, List<MultipartFile> files, String deleteOrder, String updateOrder,List<String> inChargeEmpList)
			throws FileNotFoundException, IOException {
		
		int todoNo = inputTodo.getTodoNo();
		
		log.info("inChargeEmpList : " + inChargeEmpList);
		if (inChargeEmpList == null) {
            inChargeEmpList = new ArrayList<>();
        }
        List<String> oldInChargeEmpList = mapper.getEmpList(todoNo);
        if (oldInChargeEmpList == null) {
            oldInChargeEmpList = new ArrayList<>();
        }

        // 기존 담당자와 새로운 담당자 비교하여 삭제할 것과 추가할 것 결정
        List<String> toDelete = new ArrayList<>(oldInChargeEmpList);
        toDelete.removeAll(inChargeEmpList);

        List<String> toAdd = new ArrayList<>(inChargeEmpList);
        toAdd.removeAll(oldInChargeEmpList);

        // 삭제할 담당자 처리
        for (String emp : toDelete) {
            Map<String, Object> map = new HashMap<>();
            map.put("todoNo", todoNo);
            map.put("inChargeEmp", emp);
            log.info("담당자 삭제: " + map);

            int result = mapper.deleteTodoManager(map);

            if (result == 0) {
                log.error("투두 담당자 삭제 실패!! 담당자: " + emp);
                return 0;
            }
        }

        // 추가할 담당자 처리
        for (String emp : toAdd) {
            if (emp != null && !emp.isEmpty()) {
                Map<String, Object> map = new HashMap<>();
                map.put("todoNo", todoNo);
                map.put("inChargeEmp", emp);
                log.info("담당자 등록: " + map);

                int result = mapper.insertTodoManagerList(map);

                if (result == 0) {
                    log.error("투두 담당자 등록 실패!! 담당자: " + emp);
                    return 0;
                }
            }
        }

        // 할 일 업데이트
        int result = mapper.todoUpdate(inputTodo);
        
        if (result == 0) {
            log.error("투두 업데이트 실패!!");
            return 0;
        }

        // 기존 파일 목록 가져오기
        List<TodoFile> existingFiles = mapper.todoFiles(todoNo);

        // 삭제할 파일 처리
   /*     if (deleteOrder != null && !deleteOrder.isEmpty()) {
            List<Integer> deleteFileOrders = Arrays.stream(deleteOrder.split(","))
                    .map(Integer::parseInt)
                    .collect(Collectors.toList());
            for (TodoFile file : existingFiles) {
                if (deleteFileOrders.contains(file.getFileOrder())) {
                    mapper.deleteTodoFile(file.getFileNo());
                }
            }
        } */
        
        if(deleteOrder != null && !deleteOrder.equals("")) {
        	Map<String, Object> map = new HashMap<>(); 
        	
        	map.put("deleteOrder", deleteOrder); 
        	map.put("todoNo", todoNo); 
        	
        	result = mapper.deleteFiles(map); 
        	
        	if(result == 0) throw new TodoDeleteException(); 
             
             if(updateOrder != null && !updateOrder.equals("")) {
            	 
            	 String[] updateArr = updateOrder.split(","); 
            	 
            	 for(int i=0; i<updateArr.length; i++) {
            		 TodoFile updateFile = TodoFile.builder()
 							.fileOrder(i)
 							.todoNo(todoNo)
 							.updateFileOrder(updateArr[i])
 							.build();
            		 
            		 result = mapper.fileOrderUpdate(updateFile); 
            	 }
             }
        	
        }
             
        // 새로운 파일 업로드 처리
        if (files != null && !files.isEmpty()) {
        	
            List<TodoFile> uploadList = new ArrayList<>();
            
            int fileOrder = 0; 
            
            String[] updateArr = null; 
            
            if(updateOrder != null && updateOrder.equals("")) {
            	updateArr = updateOrder.split(",");
            	fileOrder = updateArr.length; 
            }
            
            for (int i = 0; i < files.size(); i++) {
            	
            	if(updateOrder != null ) fileOrder +=1; 
            	else fileOrder = i;
            	
            	if(!files.get(i).isEmpty()) {
            	String originalName = files.get(i).getOriginalFilename(); // 원본명
				String rename = Utility.fileRename(originalName);
				
				TodoFile file = TodoFile.builder()
						.filePath(webPath)
						.fileOriginName(originalName)
						.fileRename(rename)
						.fileOrder(fileOrder)
						.todoNo(todoNo)
						.uploadFile(files.get(i))
						.build();
				uploadList.add(file);
		}
	}
                
                if(uploadList.isEmpty()) return todoNo; 
                
                result = mapper.insertUploadList(uploadList); 

                if(result == uploadList.size()) {
                	for(TodoFile file : uploadList) {
                		file.getUploadFile().transferTo(new File(folderPath + file.getFileRename()));
                	}
                } else {
                	throw new TodoInsertException("파일 업로드 중 예외 발생"); 
                }
            }
        
        return result;
        
	}	
	

}
	



	



	


	


