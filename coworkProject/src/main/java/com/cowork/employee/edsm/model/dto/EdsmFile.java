package com.cowork.employee.edsm.model.dto;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.employee.notice.model.dto.BoardFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class EdsmFile {

	private int fileNo;
	private String filePath;
	private String fileOriginName;
	private String fileRename;
	private String fileUploadDate;
	private int fileOrder;
	private int boardNo;
	private String boardNm;
	
	// 게시글 파일 삽입/수정 때 사용
	private MultipartFile uploadFile;
	private String fileOrderUpd; /* 파일순서 변경 */
}
