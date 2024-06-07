package com.cowork.admin.notice.model.exception;

// 파일 삭제 중 문제 발생 시 사용할 사용자 정의 예외
public class BoardFileDeleteException extends RuntimeException {

	public BoardFileDeleteException() {
		super("이미지 삭제 중 예외 발생");
	}
	
	public BoardFileDeleteException(String message) {
		super(message);
	}
}
