package com.cowork.employee.mail.model.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.cowork.employee.mail.model.dto.Mail;
import com.cowork.employee.mail.model.dto.MailFile;
import com.cowork.user.model.dto.Employee2;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

/**
 * 
 */
public interface MailService {

	/** 전체 메일함 조회 
	 * @param empCode
	 * @param cp 
	 * @return
	 */
	Map<String, Object> mailList(Map<String, Object> paramMap, int cp);

	/** 메일 상세 조회 
	 * @param mailNo
	 * @return
	 */
	Map<String, Object> mailDetail(int mailNo);

	/** 전체 메일 개수 조회 
	 * @param paramMap
	 * @return
	 */
	int mailCount(int empCode);

	/** 안 읽은 메일 개수 조회 
	 * @param empCode
	 * @return
	 */
	int noReadCount(int empCode);

	/** 파일 조회 
	 * @param mailNo
	 * @return
	 */
	List<MailFile> getMailFiles(int mailNo);

	/** 보낸 메일 리스트 
	 * @param paramMap 
	 * @param empCode
	 * @return
	 */
	Map<String, Object> sentMailList(Map<String, Object> paramMap, int cp);

	/** 보낸 메일 전체 개수 
	 * @param empCode
	 * @return
	 */
	int sentMailCount(int empCode);

	/** 받은 메일 리스트 조회 
	 * @param paramMap 
	 * @param empCode
	 * @return
	 */
	Map<String, Object> inMailList(Map<String, Object> paramMap, int cp);
	
	/** 보낸 메일 안 읽은 개수 
	 * @param empCode
	 * @return
	 */
	int sentMailNoReadCount(int empCode);

	/** 받은 메일 전체 개수 
	 * @param empCode
	 * @return
	 */
	int inMailCount(int empCode);

	/** 받은 메일 안 읽은 메일 개수 
	 * @param empCode
	 * @return
	 */
	int inMailNoReadCount(int empCode);

	/** 사원 검색 - 받는이, 참조 
	 * @param empName
	 * @param comNo
	 * @return
	 */
	List<Employee2> mailEmpSearch(String empName, int comNo);

	/** 메일 전송 
	 * @param inputMail
	 * @param files
	 * @param recipient
	 * @param referer
	 * @return
	 */
	int sendMail(Mail inputMail, List<MultipartFile> files, String recipient, String referer) throws IllegalStateException, IOException;

	/** 휴지통으로 옮기기 
	 * @param mailIds
	 * @return
	 */
	boolean toBin(List<Integer> mailIds);

	/** 임시 보관함 
	 * @param paramMap
	 * @param cp
	 * @return
	 */
	Map<String, Object> outMailList(Map<String, Object> paramMap, int cp);

	/** 휴지통 
	 * @param paramMap
	 * @param cp
	 * @return
	 */
	Map<String, Object> binList(Map<String, Object> paramMap, int cp);

	/** 휴지통 메일 복구하기 
	 * @param mailIds
	 */
	void restoreMails(List<Integer> mailIds);

	/** 메일 영구 삭제하기 
	 * @param mailIds
	 */
	void eliminateMails(List<Integer> mailIds);

	/** 답장하기 
	 * @param inputMail
	 * @param files
	 * @param recipient
	 * @param referer
	 * @return
	 */
	int reply(Mail inputMail, List<MultipartFile> files, String recipient, String referer) throws IllegalStateException, IOException;

	/** 임시저장하기 
	 * @param inputMail
	 * @param files
	 * @param recipient
	 * @param referer
	 * @return
	 */
	int saveMail(Mail inputMail, List<MultipartFile> files, String recipient, String referer) throws IllegalStateException, IOException;


	/** 임시저장 메일 수정 다시 임시보관 
	 * @param inputMail
	 * @param files
	 * @param recipient
	 * @param referer
	 * @param deleteOrder
	 * @param updateOrder
	 * @param existingFiles
	 * @return
	 */
	int outUpdate(Mail inputMail, List<MultipartFile> files, String recipient, String referer, String deleteOrder,
			String updateOrder) throws IllegalStateException, IOException;

	/** 임시보관함에서 전송하기 (수정 후 전송 가능) 
	 * @param inputMail
	 * @param files
	 * @param recipient
	 * @param referer
	 * @param deleteOrder
	 * @param updateOrder
	 * @return
	 */
	int outSend(Mail inputMail, List<MultipartFile> files, String recipient, String referer, String deleteOrder,
			String updateOrder) throws IllegalStateException, IOException;

	/**
	 * @param inputMail
	 * @param files
	 * @param recipient
	 * @param referer
	 * @param updateOrder
	 * @param deleteOrder
	 * @param mailNo 
	 * @return
	 */
	int forward(Mail inputMail, List<MultipartFile> files, String recipient, String referer, String updateOrder,
			String deleteOrder, int mailNo) throws IllegalStateException, IOException;




	

}
