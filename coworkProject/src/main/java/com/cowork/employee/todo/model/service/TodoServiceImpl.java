package com.cowork.employee.todo.model.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cowork.common.utility.Utility;
import com.cowork.employee.todo.model.dto.Todo;
import com.cowork.employee.todo.model.dto.TodoFile;
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
	public List<Todo> selectTodoList() {
		
		return mapper.selectTodoList();
		
		
	}

	
	// 할 일 등록 
	@Override
	public int todoInsert(Todo inputTodo, List<MultipartFile> files) throws IllegalStateException, IOException {
		
		
		int result = mapper.todoInsert(inputTodo); 
		
		if(result == 0) {
			
			log.error("todo등록 실패!!");
			return 0; 
		}
		
		log.info("투두 등록 완료 : " + result);
	    log.info("투두 등록 완 번호!! : " + inputTodo.getTodoNo());
		
	    int todoNo = inputTodo.getTodoNo(); 
	    
		result =  mapper.insertTodoManager(inputTodo);
		
		if(result == 0) {
			log.error("투두 담당자 등록 실패!!");
			return 0;
		}
		
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
	@Override
	public int todoUpdate(Todo inputTodo, List<MultipartFile> files) throws IllegalStateException, IOException {
		
		int todoNo = inputTodo.getTodoNo(); 
		int empCode = inputTodo.getEmpCode(); 
		
		int result = mapper.todoUpdate(inputTodo); 
		
		if(result == 0) return 0; 
		
        result = mapper.todoManagerUpdate(inputTodo);
		
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
			return result; 
		}
		
		result = mapper.insertUploadList(uploadList);
		
		if(result == uploadList.size()) {
			for(TodoFile file : uploadList) {
                files.get(file.getFileOrder())
                    .transferTo(new File(folderPath + file.getFileRename()));
               
            }
			
			return result; 
			
		} else {
			return 0; 
		}
			
		
	}


	// 할 일 삭제 
	@Override
	public int todoDelete(List<Integer> todoNos) {
		
		log.info("todoNos :::: " + todoNos.toString());
		
		  try {
	            // 순서대로 삭제
	            mapper.deleteTodoFiles(todoNos);
	            mapper.deleteTodoManager(todoNos);
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




	


	

}
