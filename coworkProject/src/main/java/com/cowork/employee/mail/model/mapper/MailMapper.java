package com.cowork.employee.mail.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.cowork.employee.mail.model.dto.Mail;
import com.cowork.employee.mail.model.dto.MailFile;
import com.cowork.employee.mail.model.dto.Recipient;
import com.cowork.employee.notice.model.dto.BoardFile;
import com.cowork.user.model.dto.Employee2;

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
	Integer mailCount(int empCode);
	
	/** 전체 메일 리스트 개수 조회 
	 * @param paramMap
	 * @return
	 */
	Integer listCount(Map<String, Object> paramMap);

	/** 안 읽은 메일 개수 조회 
	 * @param empCode
	 * @return
	 */
	Integer noReadCount(int empCode);

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
	Integer sentMailCount(int empCode);
	
	/** 보낸 메일함 안 읽은 메일 개수 
	 * @param empCode
	 * @return
	 */
	Integer sentMailNoReadCount(int empCode);
	
	/** 페이지네이션용 보낸메일함 전체 메일개수 조회 
	 * @param paramMap
	 * @return
	 */
	Integer sentListCount(Map<String, Object> paramMap);

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
	Integer inMailCount(int empCode);

	/** 받은 메일함 안 읽은 메일 개수 
	 * @param empCode
	 * @return
	 */
	Integer inMailNoReadCount(int empCode);

	/** 페이지네이션용 받은 메일함 리스트 조회 
	 * @param paramMap
	 * @return
	 */
	Integer inListCount(Map<String, Object> paramMap);

	/** 사원 검색 
	 * @param comNo
	 * @return
	 */
	List<Employee2> employeeSearch(int comNo);

	/** 사원 리스트 검색 찾기  
	 * @param map
	 * @return
	 */
	List<Employee2> employeeListSearch(Map<String, Object> map);

	/** 메일 정보 입력 
	 * @param inputMail
	 * @return
	 */
	int sendMail(Mail inputMail);

	/** 받는이 / 참조인 insert 
	 * @param recipientList
	 * @return
	 */
	int recipientList(List<Recipient> recipientList);

	/** 메일 파일 업로드 
	 * @param uploadList
	 * @return
	 */
	int mailFileInsert(List<MailFile> uploadList);

	/** 수신자 리스트 
	 * @param mailNo
	 * @return
	 */
	List<Recipient> getRecipients(int mailNo);

	/** 참조자 리스트 
	 * @param mailNo
	 * @return
	 */
	List<Recipient> getReferers(int mailNo);

	/** 휴지통으로 보내기!
	 * @param mailIds
	 */
	void updateMailFlag(@Param("list") List<Integer> mailIds);

	/** 조회 여부 업데이트 
	 * @param mailNo
	 */
	void updateReadFl(int mailNo);

	/** 임시보관함 리스트 개수 
	 * @param paramMap
	 * @return
	 */
	Integer outListCount(Map<String, Object> paramMap);

	/** 임시보관함 리스트 조회 
	 * @param paramMap
	 * @param rowBounds
	 * @return
	 */
	List<Mail> outMailList(Map<String, Object> paramMap, RowBounds rowBounds);

	/** 휴지통 리스트 개수 
	 * @param paramMap
	 * @return
	 */
	int binListCount(Map<String, Object> paramMap);

	/** 휴지통 리스트 조회 
	 * @param paramMap
	 * @param rowBounds
	 * @return
	 */
	List<Mail> binList(Map<String, Object> paramMap, RowBounds rowBounds);

	/** 휴지통 메일 복구하기 
	 * @param mailId
	 * @param c
	 */
	void restoreMail(@Param("mailNo") Integer mailId, @Param("mailFlag") char mailFlag);

	/** 영구 삭제하기 
	 * @param mailId
	 */
	void eliminateMail(Integer mailId);

	/** 받은 사람 영구 삭제 
	 * @param mailId
	 */
	void eliminateRecipient(Integer mailId);

	/** 파일 영구 삭제 
	 * @param mailId
	 */
	void eliminateFile(Integer mailId);

	/** 답장하기 
	 * @param inputMail
	 * @return
	 */
	int replyMail(Mail inputMail);

	/** 파일 업데이트 
	 * @param uploadFile
	 * @return
	 */
	int mailFileUpdate(MailFile uploadFile);

	/** 파일 삭제 
	 * @param map
	 * @return
	 */
	int deleteFile(Map<String, Object> map);

	/** 기존 파일 얻어오기 
	 * @param mailNo
	 * @return
	 */
	List<MailFile> getMailFilesByMailNo(int mailNo);

	/** 임시 저장하기 
	 * @param inputMail
	 * @return
	 */
	int saveMail(Mail inputMail);

	/** 임시저장 메일 수정하기 
	 * @param inputMail
	 * @return
	 */
	int updateSave(Mail inputMail);

	/** 수신인 수정 
	 * @param recipientList
	 * @return
	 */
/*	int updateRecipient(List<Recipient> recipientList); */

	/** 수신인 삭제 (임시보관함 수정/ 전송시) 
	 * @param paramMap
	 * @return
	 */
	int deleteRecipient(Map<String, Object> paramMap);

	/** 수신인 업데이트 (
	 * @param recipients
	 * @return
	 */
	int insertRecipient(Recipient recipients);

	/** 임시저장한 메일 전송 
	 * @param inputMail
	 * @return
	 */
	int outSend(Mail inputMail);

	/** 매치되는 파일찾기 
	 * @param map
	 * @return
	 */
	List<MailFile> getMatchFiles(Map<String, Object> map);

	

	



	

	

	

}
