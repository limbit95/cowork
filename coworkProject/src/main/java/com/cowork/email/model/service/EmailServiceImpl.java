package com.cowork.email.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.cowork.email.model.mapper.EmailMapper;
import com.cowork.user.model.dto.Employee2;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService{
	
	// EmailConfig 설정이 적용된 객체(메일 보내기 기능)
	private final JavaMailSender mailSender;
	
	// thymeleaf(템플릿 엔진)을 이용해서 html 코드 -> java로 변환
	private final SpringTemplateEngine templateEngine;
	
	// Mapper 의존성 주입
	private final EmailMapper mapper;

	// 이메일 보내기
	@Override
	public String sendEmail(String htmlName, String email) {
		// 6자리 난수(인증 코드) 생성
		String authKey = createAuthKey();
		
		try {
			// 메일 제목
			String subject = null;
			
			switch(htmlName) {
				case "signup" : 
					subject = "[CoWork] 회원 가입 인증번호 입니다."; break;
				case "findId" : 
					subject = "[CoWork] 아이디 찾기 인증번호 입니다."; break;
			}
			
			// 인증 메일 보내기
			
			// MimeMessage : Java 메일을 보내는 객체
			MimeMessage mimeMessgae = mailSender.createMimeMessage(); 
			
			// MimeMessageHelper : 
			// Spring에서 제공하는 메일 발송 도우미 (간단 + 타임리프)
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessgae, true, "UTF-8");
			// 1번 매개변수 : MimeMessage
			// 2번 매개변수 : 파일 전송 사용할 것인지 true / false 지정 가능
			// 3번 매개변수 : 문자 인코딩 지정
			
			helper.setTo(email); // 받는 사람 이메일 지정
			helper.setSubject(subject); // 이메일 제목 지정
			
			helper.setText( loadHtml(authKey, htmlName), true ); // html 보내기 (변경예정)
			// HTML 코드 해석 여부 true (innerHTML 해석)
			
			// CID(Content-ID)를 이용해 메일에 이미지 첨부
			// (파일첨부와는 다름, 이메일 내용 자체에 사용할 이미지 첨부
			// logo 추가 예정
			helper.addInline("logo", new ClassPathResource("static/images/coworkLogo.png"));
			// -> 로고 이미지를 메일 내용에 첨부하는데
			//    사용하고 싶으면 "logo" 라는 id를 작성해라
			
			// 메일 보내기
			mailSender.send(mimeMessgae);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
		// 이메일 + 인증 번호를 "TB_AUTH_KEY" 테이블 저장
		Map<String, String> map = new HashMap<String, String>();
		map.put("authKey", authKey);
		map.put("email", email);
		
		// 1) 해당 이메일이 DB에 존재하는 경우 수정(update)
		int result = mapper.updateAuthKey(map);
		
		boolean isStored = false;
		
		if(result == 0) {
			// 트랜잭션을 분리하여 데이터베이스 작업 수행
			isStored = storeAuthKey(map);
		}
		
		return isStored ? authKey : null; // 오류없이 완료되면 authKey 반환
	}
	
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public boolean storeAuthKey(Map<String, String> map) {

		// 2) 업데이트 실패 시 삽입 시도
		int result = mapper.insertAuthKey(map);
		
		return result > 0;
	}
	
	
	// 아이디 찾기 서비스
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public int findId(Map<String, Object> map) {
		return mapper.findId(map);
	}

    // 이메일, 인증번호 확인
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public int checkAuthKey(Map<String, Object> map) {
		return mapper.checkAuthKey(map);
	}

    // 해당 이메일로 가입된 모든 아이디 조회
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public List<Employee2> selectId(Map<String, Object> map) {
		return mapper.selectId(map);
	}
	
	// 비밀번호 찾기(이메일)
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public int findPwByEmail(Map<String, Object> map) {
		int result = mapper.findPwByEmail(map);
		if(result == 0) {
			return 0;
		}
		
		return result;
	}
	
	// 비밀번호 재설정 이메일 보내기
	@Override
	public int sendEmail(String htmlName, Map<String, Object> map) {
		String authKey = createAuthKey();
		String empInfo = (String)map.get("empId") + "," + (String)map.get("empEmail")  + "," + authKey;
		
		try {
			// 메일 제목
			String subject = null;
			
			switch(htmlName) {
				case "findPwByEmail" : 
					subject = "[CoWork] 비밀번호 재설정 인증 메일입니다."; break;
			}
			
			MimeMessage mimeMessgae = mailSender.createMimeMessage(); 
			
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessgae, true, "UTF-8");
			
			helper.setTo((String)map.get("empEmail"));
			helper.setSubject(subject);
			
			helper.setText( loadHtml(empInfo, htmlName), true );
			helper.addInline("logo", new ClassPathResource("static/images/coworkLogo.png"));
			
			mailSender.send(mimeMessgae);
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
		
		Map<String, String> map2 = new HashMap<String, String>();
		map2.put("authKey", authKey);
		map2.put("email", (String)map.get("empEmail"));
		
		// 트랜잭션을 분리하여 데이터베이스 작업 수행
		boolean isStored = storeAuthKey2(map2);
		return isStored ? 1 : 0; // 오류없이 완료되면 authKey 반환
		
//		int result = mapper.updateAuthKey(map2);
//		
//		if(result == 0) {
//			if(map2.get("authKey") == null || map2.get("email") == null) {
//				return -1;
//			}
//			result = mapper.insertAuthKey(map2);
//		}
//		
//		if(result == 0) {
//			return -1;
//		}
//		
//		return 1;
	}
	
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public boolean storeAuthKey2(Map<String, String> map2) {
		int result = mapper.updateAuthKey(map2);
		
		if(result == 0) {
			if(map2.get("authKey") == null || map2.get("email") == null) {
				return false;
			}
			result = mapper.insertAuthKey(map2);
		}
		
		if(result == 0) {
			return false;
		}
		
		return true;
	}
	
	
	
	// 구성원 초대 메일 발송
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public String registYourself(String[] emailList, Employee2 loginEmp) {
		String sender = loginEmp.getEmpLastName() + loginEmp.getEmpFirstName();
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("authKey", loginEmp.getInviteAuthKey());
		data.put("comNo", loginEmp.getComNo());
		data.put("domain", loginEmp.getDomain());
		data.put("empCode", loginEmp.getEmpCode());
		data.put("sender", sender);
		
		try {
			MimeMessage mimeMessgae = mailSender.createMimeMessage(); 
			
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessgae, true, "UTF-8");
			
			helper.setTo(emailList); // 받는 사람 이메일 지정
			helper.setSubject(sender + "님이 당신을 COWORK에 초대하였습니다."); // 이메일 제목 지정
			
			helper.setText( loadHtml2(data, "inviteEmail"), true ); // html 보내기 (변경예정)
			// HTML 코드 해석 여부 true (innerHTML 해석)
			
			helper.addInline("logo", new ClassPathResource("static/images/coworkLogo.png"));
			// -> 로고 이미지를 메일 내용에 첨부하는데
			//    사용하고 싶으면 "logo" 라는 id를 작성해라
			
			// 메일 보내기
			mailSender.send(mimeMessgae);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
		// 2) 1번 update 실패 시(result = ) insert 시도
		if(loginEmp.getInviteAuthKey() == null) {
			return null;
		}
		
		return loginEmp.getInviteAuthKey();
	}
	
	
	
	
	// HTML 파일을 읽어와 String 으로 변환 (thymeleaf 적용)
	private String loadHtml(String item, String htmlName) {
		// org.thymeleaf.Context 선택
		Context context = new Context();
		
		// thymeleaf 가 적용된 HTML에서 사용할 값 추가
		context.setVariable("item", item);
		
		// templates/email 폴더에서 htmlName과 같은 
		// ~.html 파일 내용을 읽어와 String으로 변환
		return templateEngine.process("email/" + htmlName, context);
	}
	
	// HTML 파일을 읽어와 Map 으로 변환 (thymeleaf 적용)
	private String loadHtml2(Map<String, Object> data, String htmlName) {
		Context context = new Context();
		
		context.setVariable("data", data);
		
		return templateEngine.process("email/" + htmlName, context);
	}

	// 인증번호 생성 (영어 대문자 + 소문자 + 숫자 6자리)
	public String createAuthKey() {
   		String key = "";
   	
   		for(int i=0 ; i< 6 ; i++) {
	        int sel1 = (int)(Math.random() * 3); // 0:숫자 / 1,2:영어
	      
	        if(sel1 == 0) {
	          
	            int num = (int)(Math.random() * 10); // 0~9
	            key += num;
	          
	        }else {
	        	char ch = (char)(Math.random() * 26 + 65); // A~Z
	          
	            int sel2 = (int)(Math.random() * 2); // 0:소문자 / 1:대문자
	          
	            if(sel2 == 0) {
	                ch = (char)(ch + ('a' - 'A')); // 대문자로 변경
	            }
	          
	            key += ch;
	        }
          
   		}
        return key;
	}

}

