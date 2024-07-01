package com.cowork.admin.authority.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import com.cowork.admin.authority.dto.AuthorityMember;
import com.cowork.admin.authority.model.mapper.AuthorityManageMapper;
import com.cowork.common.utility.model.dto.Pagination;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@PropertySource("classpath:/config.properties")
@Slf4j
public class AuthorityManageSeriveImpl implements AuthorityManageSerive {
	
	private final AuthorityManageMapper mapper;
	
	// 사원별 권한 목록 조회
	@Override
	public Map<String, Object> authorityList(Map<String, Object> paramMap, int cp) {
		
		// 사원 수 조회
		int listCount = mapper.getAuthorityListCount(paramMap);
		
		// paingnation
		Pagination pagination = new Pagination(cp, listCount);
		
		// 지정된 크기 만큼 건너띄고(offset) 제한된 크기(limit)만큼의 행을 조회
		int limit = pagination.getLimit();
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		// 사원별 권한 목록 조회
		List<Employee2> authorityList = mapper.authorityList(paramMap, rowBounds);
		
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("authorityList", authorityList);
		
		return map;
	}

	// 사원별 권한 처리
	@Override
	public int authorityManage(List<Employee2> authorityList) {
		
		int result = 0;
		int index = 0;

		List<AuthorityMember> inputAuthorityD = new ArrayList<>();
		List<AuthorityMember> inputAuthorityI = new ArrayList<>();

		for (Employee2 emp : authorityList) {
		    int empCode = emp.getEmpCode();
		    String attendance = emp.getAttendanceYn(); // 근태관리
		    String function = emp.getFunctionYn(); // 기능관리
		    String teamBoard = emp.getTeamBoardYn(); // 팀게시판

		    // 권한 여부 조회
		    List<AuthorityMember> authorityMember = mapper.authorityDetail(empCode);

		    for (AuthorityMember authority : authorityMember) {
		        AuthorityMember authorityD = new AuthorityMember();
		        authorityD.setEmpCdoe(empCode);

		        // 삭제 조건
		        if ((authority.getAuthorityNo() == 1 && attendance.equals("false")) ||
		            (authority.getAuthorityNo() == 2 && function.equals("false")) ||
		            (authority.getAuthorityNo() == 3 && teamBoard.equals("false"))) {
		        	
		        	
		            
		            authorityD.setAuthorityNo(authority.getAuthorityNo());
		            
		            inputAuthorityD.add(authorityD);
		        }

		        // 권한 상태 업데이트
		        if (authority.getAuthorityNo() == 1 && attendance.equals("true")) {
		            attendance = "Y";
		        } else if (authority.getAuthorityNo() == 2 && function.equals("true")) {
		            function = "Y";
		        } else if (authority.getAuthorityNo() == 3 && teamBoard.equals("true")) {
		            teamBoard = "Y";
		        }

		        
		    }

		    // 추가할 권한 설정
		    if (attendance.equals("true") && authorityMember.stream().noneMatch(a -> a.getAuthorityMemberNo() == 1)) {
		        AuthorityMember insert = new AuthorityMember();
		        insert.setEmpCdoe(empCode);
		        insert.setAuthorityNo(1);
		        inputAuthorityI.add(insert);
		    }
		    if (function.equals("true") && authorityMember.stream().noneMatch(a -> a.getAuthorityMemberNo() == 2)) {
		        AuthorityMember insert = new AuthorityMember();
		        insert.setEmpCdoe(empCode);
		        insert.setAuthorityNo(2);
		        inputAuthorityI.add(insert);
		    }
		    if (teamBoard.equals("true") && authorityMember.stream().noneMatch(a -> a.getAuthorityMemberNo() == 3)) {
		        AuthorityMember insert = new AuthorityMember();
		        insert.setEmpCdoe(empCode);
		        insert.setAuthorityNo(3);
		        inputAuthorityI.add(insert);
		    }
		}
		
		//log.info("inputAuthorityD : " + inputAuthorityD.size());

		if(inputAuthorityD.size() != 0) result = mapper.authorityDelete(inputAuthorityD);
		if(inputAuthorityI.size() != 0) result = mapper.authorityInsert(inputAuthorityI);
		
		return result;
	}

}
