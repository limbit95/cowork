package com.cowork.employee.mail.model.service;

import java.util.List;
import java.util.Map;

import com.cowork.employee.mail.model.dto.Mail;
import com.cowork.employee.mail.model.dto.MailFile;
import com.cowork.user.model.dto.Employee2;

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



	

}
