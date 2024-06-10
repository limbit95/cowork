package com.cowork.employee.mail.model.dto;

import java.util.List;

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
public class MailFile {
	
	private int fileNo; 
	private String filePath; 
	private String fileOriginName; 
	private String fileRename; 
	private String fileUploadDate; 
	private int fileOrder; 
	
	private int mailNo; 
	private MultipartFile uploadFile; 
}
