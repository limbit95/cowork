package com.cowork.admin.addr.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.addr.model.mapper.AdminAddrMapper;
import com.cowork.admin.companyInfo.model.dto.Department;
import com.cowork.admin.companyInfo.model.dto.Team;
import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
@RequiredArgsConstructor
public class AdminAddrServiceImpl implements AdminAddrService {
	
	private final AdminAddrMapper mapper;

	// 회사 주소록 그룹만 조회
	@Override
	public List<Department> selectComAddrList(Employee2 loginEmp) {
		List<Department> selectComAddrList = mapper.selectComAddrList(loginEmp);
		
		return selectComAddrList;
	}

	// 회사별 사원 리스트 조회
	@Override
	public Map<String, Object> selectComList(Employee2 loginEmp, int cp) {
		
		// 회사 전체 사원 수 조회
		int listCount = mapper.getComListCount(loginEmp);
		
		Pagination pagination = new Pagination(cp, listCount);
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Employee2> comList = mapper.selectComList(loginEmp, rowBounds);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("pagination", pagination);
		map.put("comList", comList);
		
		return map;
	}

	// 부서별 사원 리스트 조회
	@Override
	public Map<String, Object> selectDeptList(Map<String, Object> data, int cp) {

		// 부서별 사원 수 조회
		int listCount = mapper.getDeptListCount(data);
		
		Pagination pagination = new Pagination(cp, listCount);
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Employee2> deptList = mapper.selectDeptList(data, rowBounds);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("pagination", pagination);
		map.put("deptList", deptList);
		
		return map;
	}

	// 팀별 사원 리스트 조회
	@Override
	public Map<String, Object> selectTeamList(Map<String, Object> data, int cp) {

		// 팀별 사원 수 조회
		int listCount = mapper.getTeamListCount(data);
		
		Pagination pagination = new Pagination(cp, listCount);
		
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Employee2> teamList = mapper.selectTeamList(data, rowBounds);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("pagination", pagination);
		map.put("teamList", teamList);
		
		return map;
	}

	// 선택한 부서의 하위 팀 리스트만 조회
	@Override
	public List<Team> getTeamList(Map<String, Object> map) {
		return mapper.getTeamList2(map);
	} 
	
	// 회사 주소록 CRUD
	@Override
	public int insertGroupList(List<List<Map<String, Object>>> data, Employee2 loginEmp) {
		// -----------------------------------------------------------------------------
		// -----------------------------------------------------------------------------
		// -----------------------------------------------------------------------------
		// 부서 그룹 CRUD
		
		// 부서 그룹 삭제
		String idx = "";
		for(int i = 0; i < data.get(0).size(); i++) {
			
			if(!data.get(0).get(i).get("deptNo").equals("null")) {
				if(data.get(0).get(i).size() == 1) {
					idx += "'" + data.get(0).get(i).get("deptNo") + "'";
					continue;
				}
				
				if(i == data.get(0).size() - 1) {
					idx += "'" + data.get(0).get(i).get("deptNo") + "'";
					continue;
				}
				idx += "'" + data.get(0).get(i).get("deptNo") + "',";
			}
		}
		// 부서 그룹이 하나 이상 존재할 때
		if(idx.length() > 0) {
			if(idx.charAt(idx.length()-1) == ',') {
				idx = idx.substring(0, idx.length()-1);
			}
			
			data.get(0).get(0).put("groupIdx", idx);
			
			int deleteResult = mapper.deleteDeptGroup(data.get(0).get(0));
		} 
		if(idx.length() == 0) {
			int deleteResult = mapper.deleteAllDeptGroup(loginEmp);
		}
		
		// 부서 그룹 삽입 및 수정
		for(int i = 0; i < data.get(0).size(); i++) {
			// 기존에 있던 부서 그룹이면 이름만 업데이트
			// 기존과 같은 이름이면 같은 이름을 업데이트 하므로 변동사항 없음
			if(!data.get(0).get(i).get("deptNo").equals("null")) {
				int changeResult = mapper.changeDeptName(data.get(0).get(i));
			}
			if(data.get(0).get(i).get("deptNo").equals("null")) {
				int insertResult = mapper.insertDept(data.get(0).get(i));
			}
		}
		
		// -----------------------------------------------------------------------------
		// -----------------------------------------------------------------------------
		// -----------------------------------------------------------------------------
		// 팀 그룹 CRUD 
		
		// 팀 그룹 삭제
		for(int i = 0; i < data.get(0).size(); i++) {
			String idx2 = "";
			
			for(int x = 0; x < data.get(1).size(); x++) {
				if(data.get(1).get(x).get("teamNo").equals("null")) {
					continue;
				}
				if(data.get(0).get(i).get("deptNo").equals(data.get(1).get(x).get("deptNo"))) {
					idx2 += "'" + data.get(1).get(x).get("teamNo") + "',";
				}
			}
			// 팀 그룹이 하나 이상 존재할 때
			if(idx2.length() > 0) {
				idx2 = idx2.substring(0, idx2.length()-1);
				
				Map<String, Object> deleteMap = new HashMap<String, Object>();
				deleteMap.put("deptNo", data.get(0).get(i).get("deptNo"));
				deleteMap.put("groupIdx", idx2);
				
				int deleteResult = mapper.deleteTeamGroup(deleteMap);
			} 
		}
		
		// 팀 그룹 삽입 및 수정
		for(int i = 0; i < data.get(1).size(); i++) {
			// 기존에 있던 팀 그룹이면 이름만 업데이트
			// 기존과 같은 이름이면 같은 이름을 업데이트 하므로 변동사항 없음
			if(!data.get(1).get(i).get("teamNo").equals("null")) {
				int changeResult = mapper.changeTeamName(data.get(1).get(i));
			}
			if(data.get(1).get(i).get("teamNo").equals("null")) {
				int insertResult = mapper.insertTeam(data.get(1).get(i));
			}
		}
		
		return 1;
	}

	// 초대 링크 인증키 삭제
	@Override
	public int updateInviteAuthKey(int empCode) {
		String authKey = createAuthKey();
		String email = "cowork@invite.authKey." + empCode;
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("authKey", authKey);
		data.put("email", email);
		
		return mapper.updateInviteAuthKey(data);
	}
	
	// TB_AUTH_KEY의 인증키와 EMPLOYEE의 인증키 비교
	@Override
	public int checkInviteAuthKey(Employee2 loginEmp) {
		String email = "cowork@invite.authKey." + loginEmp.getEmpCode();
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("email", email);
		data.put("comNo", loginEmp.getComNo());
		data.put("empCode", loginEmp.getEmpCode());
		
		String tbAuthKey = mapper.getTbAuthKey(data);
		String empAuthKey = mapper.getEmpAuthKey(data);
		
		log.info(tbAuthKey);
		log.info(empAuthKey);
		
		if(!tbAuthKey.equals(empAuthKey)) {
			return 0;
		}
		
		return 1;
	}

	// 업데이트 된 초대 링크 인증키를 EMPLOYEE 테이블의 INVITE_AUTHKEY 컬럼에 업데이트 
	@Override
	public Employee2 updateEmpInviteAuthKey(Employee2 loginEmp) {
		String email = "cowork@invite.authKey." + loginEmp.getEmpCode();
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("email", email);
		data.put("comNo", loginEmp.getComNo());
		data.put("empCode", loginEmp.getEmpCode());
		
		String tbAuthKey = mapper.getTbAuthKey(data);
		data.put("authKey", tbAuthKey);
		
		int result = mapper.updateEmpInviteAuthKey(data);
		
		if(result == 0) {
			return null;
		}
		
		return mapper.getUpdateEmp(data);
	}
	
	// 사원 찾기(이름으로)
	@Override
	public List<Employee2> findEmp(String name, Employee2 loginEmp) {
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("name", name);
		data.put("comNo", loginEmp.getComNo());
		
		return mapper.findEmp(data);
	}
	
	// 사원 조직 이동
	@Override
	public int groupChange(List<Map<String, Object>> data) {
		
		for(int i = 0; i < data.size(); i++) {
			int result = mapper.groupChange(data.get(i));
			
			if(result == 0) {
				return 0;
			}
		}
		
		return 1;
	}

	// 회사별 직급 리스트 조회
	@Override
	public List<Map<String, Object>> getpositionList(Employee2 loginEmp) {
		return mapper.getpositionList(loginEmp);
	}

	// 구성원 정보 수정
	@Override
	public int employeeUpdate(Map<String, Object> data) {
		return mapper.employeeUpdate(data);
	}

	// 부서에 사원이 한 명이라도 존재하는지 확인
	@Override
	public int empInDeptIsEmpty(Map<String, Object> data) {
		
		// 사용자가 페이지 소스에서 임의로 부서 식별키를 변경해 그룹 삭제를 시도할 때
		// 먼저 바뀐 부서 식별키 값이 해당 회사에 있는지 없는지 먼저 확인
		// 없으면 잘못된 요청이라고 alert()
		// 있으면 이제 그 부서에 구성원이 있는지 없는지 검사
		int result = mapper.deptIsEmpty(data);
		
		if(result == 0) {
			return -1;
		}
		
		return mapper.empInDeptIsEmpty(data);
	}

	// 팀에 사원이 한 명이라도 존재하는지 확인
	@Override
	public int empInTeamIsEmpty(Map<String, Object> data) {
		
		int result = mapper.deptIsEmpty(data);
		
		if(result == 0) {
			return -1;
		}
		
		// 사용자가 페이지 소스에서 임의로 팀 식별키를 변경해 그룹 삭제를 시도할 때
		// 먼저 바뀐 팀 식별키 값이 해당 회사에 있는지 없는지 먼저 확인
		// 없으면 잘못된 요청이라고 alert()
		// 있으면 이제 그 팀에 구성원이 있는지 없는지 검사
		result = mapper.teamIsEmpty(data);
		
		if(result == 0) {
			return -1;
		}
		
		return mapper.empInTeamIsEmpty(data);
	}
	
	// 선택한 구성원 삭제
	@Override
	public int deleteEmployee(List<Map<String, Object>> data) {
		int result = 0;
		
		for(int i = 0; i < data.size(); i++) {
			result = mapper.deleteEmployee(data.get(i));
		}
		
		return result;
	}
	
	// 구성원 복구
	@Override
	public int restore(Map<String, Object> data) {
		return mapper.restore(data);
	}

	// 구성원 영구 삭제
	@Override
	public int permanentDeletion(Map<String, Object> data) {
		return mapper.permanentDeletion(data);
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