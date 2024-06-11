package com.cowork.employee.todo.model.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TodoFile {

	private int fileNo; 
	private String filePath; 
	private String fileOriginName; 
	private String fileRename; 
	private String fileUploadDate; 
	private int fileOrder; 
	
	private int todoNo; 
	private MultipartFile uploadFile; 
	
	private String updateFileOrder; 
}
