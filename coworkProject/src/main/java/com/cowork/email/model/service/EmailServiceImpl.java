package com.cowork.email.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
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
		
		// 1) 해당 이메일이 DB에 존재하는 경우가 있을 수 있기 때문에
		//    수정(update)을 먼저 진행
		//    -> 1 반환 == 업데이트 성공 == 이미 존재해서 새로 발급받은 인증번호로 변경했다는 사실
		//    -> 0 반환 == 업데이트 실패 == DB에 해당 이메일 존재 X => insert 시도
		int result = mapper.updateAuthKey(map);
		
		// 2) 1번 update 실패 시(result = ) insert 시도
		if(result == 0) {
			result = mapper.insertAuthKey(map);
		}
		
		// 수정, 삽입 후에도 result 가 0 == 실패
		if(result == 0) {
			return null;
		}
		
		// 성공
		return authKey; // 오류없이 완료되면 authKey 반환
	}
	
	// 아이디 찾기 서비스
	@Override
	public int findId(Map<String, Object> map) {
		return mapper.findId(map);
	}

    // 이메일, 인증번호 확인
	@Override
	public int checkAuthKey(Map<String, Object> map) {
		return mapper.checkAuthKey(map);
	}

    // 해당 이메일로 가입된 모든 아이디 조회
	@Override
	public List<Employee2> selectId(Map<String, Object> map) {
		return mapper.selectId(map);
	}
	
	// 비밀번호 찾기(이메일)
	@Override
	public int findPwByEmail(Map<String, Object> map) {
		int result = mapper.findPwByEmail(map);
		if(result == 0) {
			return 0;
		}
		
		return result;
	}
	
	// 이메일 보내기
	@Override
	public int sendEmail(String htmlName, Map<String, Object> map) {
		String empInfo = (String)map.get("empId") + "^^^" + (String)map.get("empEmail");
		
		try {
			// 메일 제목
			String subject = null;
			
			switch(htmlName) {
				case "findPwByEmail" : 
					subject = "[CoWork] 비밀번호 재설정 인증 메일입니다."; break;
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
			
			helper.setTo((String)map.get("empEmail")); // 받는 사람 이메일 지정
			helper.setSubject(subject); // 이메일 제목 지정
			
			helper.setText( loadHtml(empInfo, htmlName), true ); // html 보내기 (변경예정)
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
			return 0;
		}
		
		return 1;
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

/*
	Google SMTP를 이용한 이메일 전송하기
	
	- SMTP(Simple Mail Transfer Protocol, 간단한 메일 전송 규약)
	  -> 이메일 메시지를 보내고 받을 때 사용하는 약속(규약, 방법)
		
	- Google SMTP
	
	Java Mail Sender -> Google SMTP -> 대상에게 이메일 전송
	
	- Java Mail Sender 에 Google SMTP 이용 설정 추가
	  1) config.properties 내용 추가(계정, 앱비밀번호)
	  2) EmailConfig.java
*/