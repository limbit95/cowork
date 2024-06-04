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


	@Override
	public int todoInsert(Todo inputTodo, List<MultipartFile> files) throws IllegalStateException, IOException {
		
		int result = mapper.todoInsert(inputTodo); 
		
		if(result == 0) return 0; 
		
		int todoNo = inputTodo.getTodoNo(); 
		
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
		} else {
			return 0; 
		}
		
		if (inputTodo.getInChargeEmp() != null && !inputTodo.getInChargeEmp().isEmpty()) {
            mapper.insertTodoManager(inputTodo);
        }
	
		return result; 
		
	}


	// 할 일 상세 조회 
	/*	@Override
	public Todo todoDetail(int todoNo) {
		
		return mapper.todoDetail(todoNo);
	} */

}
