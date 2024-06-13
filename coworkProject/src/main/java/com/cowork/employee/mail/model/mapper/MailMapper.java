package com.cowork.employee.mail.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.cowork.employee.mail.model.dto.Mail;
import com.cowork.employee.mail.model.dto.MailFile;

@Mapper
public interface MailMapper {

	/** 전체 메일함 조회 
	 * @param paramMap
	 * @param rowBounds 
	 * @return
	 */
	List<Mail> mailList(Map<String, Object> paramMap, RowBounds rowBounds);

	/** 메일 상세 조회 
	 * @param mailNo
	 * @return
	 */
	Mail mailDetail(int mailNo);

	/** 전체 메일 개수 조회 
	 * @param paramMap
	 * @return
	 */
	int mailCount(int empCode);
	
	/** 전체 메일 리스트 개수 조회 
	 * @param paramMap
	 * @return
	 */
	int listCount(Map<String, Object> paramMap);

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

	/** 상세 파일 조회 
	 * @param fileMap
	 * @return
	 */
	List<MailFile> fileList(Map<String, Object> fileMap);

	/** 보낸 메일 리스트 조회 
	 * @param paramMap
	 * @param rowBounds 
	 * @return
	 */
	List<Mail> sentMailList(Map<String, Object> paramMap, RowBounds rowBounds);

	/** 보낸 메일함 전체 개수 조회 
	 * @param empCode
	 * @return
	 */
	int sentMailCount(int empCode);
	
	/** 보낸 메일함 안 읽은 메일 개수 
	 * @param empCode
	 * @return
	 */
	int sentMailNoReadCount(int empCode);
	
	/** 페이지네이션용 보낸메일함 전체 메일개수 조회 
	 * @param paramMap
	 * @return
	 */
	int sentListCount(Map<String, Object> paramMap);

	/** 받은 메일함 조회
	 * @param paramMap
	 * @param rowBounds
	 * @return
	 */
	List<Mail> inMailList(Map<String, Object> paramMap, RowBounds rowBounds);

	/** 받은 메일함 전체 개수 
	 * @param empCode
	 * @return
	 */
	int inMailCount(int empCode);

	/** 받은 메일함 안 읽은 메일 개수 
	 * @param empCode
	 * @return
	 */
	int inMailNoReadCount(int empCode);

	/** 페이지네이션용 받은 메일함 리스트 조회 
	 * @param paramMap
	 * @return
	 */
	int inListCount(Map<String, Object> paramMap);

	

	

	

}
