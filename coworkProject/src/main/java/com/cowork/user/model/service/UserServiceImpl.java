package com.cowork.user.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.companyInfo.model.dto.Company;
import com.cowork.user.model.dto.Employee2;
import com.cowork.user.model.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	
	private final UserMapper mapper;
	
	@Autowired
	private BCryptPasswordEncoder bcrypt;
	
	// 아이디 중복 검사
	@Override
	public int checkId(String empId) {
		return mapper.checkId(empId);
	}

	// 회원가입 서비스
	@Override
	public int signup(Employee2 inputEmp, String[] empAddress) {
		// 주소가 입력되지 않으면
		// inputMember.getMemberAddress() -> ",,"
		// memberAddress -> [,,]
		
		// 주소가 입력된 경우
		if(!inputEmp.getEmpAddress().equals(",,")) {
			// String.join("구분자", 배열)
			// -> 배열의 모든 요소 사이에 "구분자"를 추가하여
			// 하나의 문자열로 만들어 반환하는 메서드
			
			// 구분자로 "^^^" 사용 이유 : 
			// -> 주소, 상세주소에 없는 특수문자 작성
			// -> 나중에 다시 3분할 할 때 구분자를 이용해 나눌 예정
			String address = String.join("^^^", empAddress);
			
			// inputMember 주소로 합쳐진 주소를 세팅
			inputEmp.setEmpAddress(address);
		} else { // 주소 입력 X
			inputEmp.setEmpAddress(null); // null 저장
		}
		
		// 비밀번호 암호화하여 inputMember에 세팅
		String encPw = bcrypt.encode(inputEmp.getEmpPw());
		inputEmp.setEmpPw(encPw);
		
		// 회원 가입 mapper 메서드 호출
		return mapper.signup(inputEmp);
	}

	// 로그인 서비스
	@Override
	public Employee2 login(Employee2 inputEmp) {

		Employee2 loginEmp = new Employee2();
		
		int userType = mapper.selectUserType(inputEmp);
		
		// 관리자용 로그인
		if(userType == 1) {
			int domainExist = mapper.domainExist(inputEmp);
			loginEmp = mapper.tempEmp(inputEmp.getEmpId());
			
			if(domainExist == 0) {
				loginEmp.setComNm("없음");
				return loginEmp;
			} 
			
			loginEmp = mapper.adminLogin(inputEmp.getEmpId());
			
			// 일치하는 아이디가 없어서 조회 결과가 null 인 경우
			if(loginEmp == null) {
				return null;
			} 
			
			// 일치하지 않으면
			if( !bcrypt.matches(inputEmp.getEmpPw(), loginEmp.getEmpPw()) ) {
				return null;
			} 

			return loginEmp;
		} 
		
		// 아이디가 일치하면서 탈퇴하지 않은 회원 조회
		loginEmp = mapper.login(inputEmp.getEmpId());
		
		// 일치하는 아이디가 없어서 조회 결과가 null 인 경우
		if(loginEmp == null) {
			return null;
		} 
		
		// 일치하지 않으면
		if( !bcrypt.matches(inputEmp.getEmpPw(), loginEmp.getEmpPw()) ) {
			return null;
		} 
		
		// 로그인 결과에서 비밀번호 제거
		loginEmp.setEmpPw(null);
		

		return loginEmp;
	}

	// 도메인 중복 검사
	@Override
	public int checkDomain(String inputDomain) {
		return mapper.checkDomain(inputDomain);
	}

	// 기업 정보 등록
	@Override
	public int registCompanyInfo(Company inputCompany, String[] comAddr, int empCode) {
		if(!inputCompany.getComAddr().equals(",,")) {
			String address = String.join("^^^", comAddr);
			
			inputCompany.setComAddr(address);
		} else { 
			inputCompany.setComAddr(null); 
		}
		
		int result = mapper.registCompanyInfo(inputCompany);
		
		if(result == 0) {
			return 0;
		} 

		int comNo = mapper.selectCompany(inputCompany.getDomain());
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("comNo", comNo);
		map.put("empCode", empCode);
		
		// 등록한 회사의 번호를 회원가입한 관리자에게 부여
		result = mapper.registAdminCompany(map);
		
		if(result == 0) {
			return 0;
		}
		
		// 등록한 회사에 전자결재 기본 양식 부여
		result = mapper.registDraft(map);
		
		if(result == 0) {
			return -1;
		}
		
		// 회원가입한 관리자에게 전체 권한 부여 
		result = mapper.registAuthority(map);
		
		if(result == 0) {
			return -1;
		}
		
		// 등록한 회사에 기본 직책 레벨 부여
//		return mapper.registPosition(map);
		return result;
	}

	// 비밀번호 재설정 시 갱신된 인증번호와 대조
	@Override
	public int checkAuthKey(Map<String, Object> map) {
		return mapper.checkAuthKey(map);
	}

	// 비밀번호 재설정
	@Override
	public int resetPw(Employee2 inputEmp) {

		String encPw = bcrypt.encode(inputEmp.getEmpPw());
		inputEmp.setEmpPw(encPw);
		
		int result = mapper.resetPw(inputEmp);
		
		log.info("test : awefafaewfawe");
		if(result == 0) {
			 return 0;
		}

		String authKey = createAuthKey();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("authKey", authKey);
		map.put("email", inputEmp.getEmpEmail());
		
		result = mapper.updateAuthKey(map);
		
		if(result == 0) {
			return -1;
		}
		
		return result;
	}

	// 회원가입 성공 이후 회원가입한 empCode 조회
	@Override
	public int selectEmpCode(String empId) {
		return mapper.selectEmpCode(empId);
	}

	// 최초 관리자 회원가입 시 구성원을 초대할 때 사용할 인증키 생성
	@Override
	public int createInviteAuthkey(String inviterEmail, int empCode) {
		String authKey =  createAuthKey();
		inviterEmail += empCode;
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("authKey", authKey);
		data.put("inviterEmail", inviterEmail);
		data.put("empCode", empCode);
		
		int createInviteAuthKey = storeAuthKey(data);
//		int createInviteAuthKey = mapper.createInviteAuthkey(data);
		
		if(createInviteAuthKey == 0) {
			return 0;
		}
		
		// 관리자용 초대링크 인증키 해당 회원의 DB Employee 테이블 INVITE_AUTH_KEY 컬럼에 수정 삽입
		int result = mapper.insertInviteAuthKey(data);
		
		if(result == 0) {
			return 0;
		}
		
		return 1;
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public int storeAuthKey(Map<String, Object> data) {
		
		int createInviteAuthKey = mapper.createInviteAuthkey(data);
		
		if(createInviteAuthKey == 0) {
			return 0;
		}
		
		return 1;
	}
	
	

	// 초대 받은 링크의 인증번호가 유효한지 확인
	@Override
	public int checkInviteAuthKey(Map<String, Object> data) {
		String email = "cowork@invite.authKey." + data.get("empCode");
		data.put("email", email);
		
		return mapper.checkInviteAuthKey(data);
	}
		
	// 초대 받은 사람의 회원가입
	@Override
	public int inviteSignUp(Map<String, Object> data) {
		String encPw = bcrypt.encode((String)data.get("empPw"));
		data.put("empPw", encPw);
		
		return mapper.inviteSignUp(data);
	}
	
	// 로그인한 회원의 ip가 DB에 존재하지는지 확인
	@Override
	public String loginEmpGetIp(Employee2 loginEmp) {
		return mapper.loginEmpGetIp(loginEmp);
	}
	
	// 최초 로그인 시 ip 저장
	@Override
	public int firstInsertIp(Employee2 loginEmp) {
		return mapper.firstInsertIp(loginEmp);
	}
	
	/**
	 *비즈니스 카드 관련 로직 
	 */
	@Override
	public Integer businessCardProcess(int empCode) {
		
		int count = mapper.countRow(empCode);
		if(count == 0) {
			// 최초 로그인 시 
			mapper.insertRow(empCode);
		}
		
		int businessCardFl = mapper.cardTypeDetail(empCode);
		
		
		return businessCardFl;
	}
	
	@Override
	public int validatePhoneNum(String empId, String phoneNum) {
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("empId", empId);
		paramMap.put("phoneNum", phoneNum);
		log.debug("empId=={}", empId);
		log.debug("phoneNum=={}", phoneNum);
		
		int result = mapper.validatePhoneNum(paramMap);
		
		if(result == 0) {
			return 0;
		}
		
		return 1;
	}
	
	/**
	 *COOLSMS 인증키 저장 로직 
	 */
	@Override
	public void addAuth(String phoneNum, int randomNum) {		
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("phoneNum", phoneNum);
		paramMap.put("randomNum", randomNum);
		mapper.addAuth(paramMap);
		
		
	}

	@Override
	public int verifyAuth(String phoneNum, String authKey) {
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("phoneNum", phoneNum);
		paramMap.put("authKey", authKey);
		
		int result = mapper.verifyAuth(paramMap);
		return result;
	}
  
	@Override
	public void resetPwPhoneVersion(String empId, String empPw) {
		String encodedPw = bcrypt.encode(empPw);
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("empId", empId);
		paramMap.put("empPw", empPw);
		mapper.resetPwPhoneVersion(paramMap);
	}
  
  
  

	
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
	
	// 빠른 로그인
	@Override
	public Employee2 quickLogin(String empId) {
		String encPw = bcrypt.encode("qwer1234!");
		log.info("password : " + encPw);
		return mapper.login(empId);
	}

}