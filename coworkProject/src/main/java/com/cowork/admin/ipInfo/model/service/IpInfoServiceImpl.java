package com.cowork.admin.ipInfo.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.ipInfo.model.dto.IpInfo;
import com.cowork.admin.ipInfo.model.mapper.IpInfoMapper;
import com.cowork.user.model.dto.Employee2;

import lombok.RequiredArgsConstructor;

@Transactional(rollbackFor = Exception.class)
@Service
@RequiredArgsConstructor
public class IpInfoServiceImpl implements IpInfoService {

	private final IpInfoMapper mapper;

	/** 회사 모든 ip 정보 가져오기
	 * @return selectAllIpInfoList
	 */
	@Override
	public List<IpInfo> selectAllIpInfoList(int comNo) {
		
		// 가져온 정보 중에서 deptNm 이랑 teamNm 합쳐줘야함, 성이랑 이름 합쳐줘야함
		List<IpInfo> selectAllIpInfoList = mapper.selectAllIpInfoList(comNo);
		
		if(selectAllIpInfoList != null) {

			for(int i = 0 ; i < selectAllIpInfoList.size() ; i ++) {

				if(selectAllIpInfoList.get(i).getEmpLastName() != null) {
					
					// 이름 합쳐주기
					String fullName = "";
					
					// 성
					fullName = selectAllIpInfoList.get(i).getEmpLastName();
					
					// 이름
					fullName += selectAllIpInfoList.get(i).getEmpFirstName();

					selectAllIpInfoList.get(i).setFullName(fullName);
					
				} else {
					
					selectAllIpInfoList.get(i).setFullName("등록 안됨");

				}
				
				// deptNm, teamNm 처리
				if(selectAllIpInfoList.get(i).getDeptNm() != null) {
					
					String affiliation = "";
					
					affiliation = selectAllIpInfoList.get(i).getDeptNm();
					
					if(selectAllIpInfoList.get(i).getTeamNm() != null) {
						
						affiliation += ", ";
						
						affiliation += selectAllIpInfoList.get(i).getTeamNm();
					}
					
					selectAllIpInfoList.get(i).setAffiliation(affiliation);
					
				} else {
					
					selectAllIpInfoList.get(i).setAffiliation("부서 없음");
					
				}
				
			}
		}
		
		return selectAllIpInfoList;
	}

	/** 이름 검색 시 일치하는 거
	 * @return selectIpInfoList
	 */
	@Override
	public List<IpInfo> selectIpInfoList(IpInfo inputInfo) {
		// 찾아진 게 있으면 fullName 에 넣어서 돌려주기
		List<IpInfo> selectIpInfoList = mapper.selectIpInfoList(inputInfo);
		
		if(selectIpInfoList != null) {
			for(int i = 0 ; i < selectIpInfoList.size() ; i ++) {
				
				if(selectIpInfoList.get(i).getEmpLastName() != null) {
					String fullName = "";
					fullName = selectIpInfoList.get(i).getEmpLastName();
					fullName += selectIpInfoList.get(i).getEmpFirstName();					
					selectIpInfoList.get(i).setFullName(fullName);
				} else {
					selectIpInfoList.get(i).setFullName("등록 안됨");
				}
				
				if(selectIpInfoList.get(i).getDeptNm() != null) {	
					String affiliation = "";	
					affiliation = selectIpInfoList.get(i).getDeptNm();
					if(selectIpInfoList.get(i).getTeamNm() != null) {
						affiliation += ", ";
						affiliation += selectIpInfoList.get(i).getTeamNm();
					}
					selectIpInfoList.get(i).setAffiliation(affiliation);
				} else {
					selectIpInfoList.get(i).setAffiliation("부서 없음");
				}
			}
			
		}
		return selectIpInfoList;
	}

	/** ip 수정
	 * @return result
	 */
	@Override
	public int updateIpInfo(IpInfo updateIpInfo) {
		
		// ip 중복 검사해야함
		// 중복 ip 존재하면 count 됨
		int count = mapper.duplicationIp(updateIpInfo);
		
		if(count > 0) {
			return -5;
		} else {
			return mapper.updateIpInfo(updateIpInfo);			
		}
		
	}

	/** ip 삭제
	 * @return result
	 */
	@Override
	public int deleteIpInfo(int empCode) {
		
		// 삭제된 회원인지 먼저 검사한 다음에 삭제된 회원이면 삭제해도 됨.
		String check = mapper.selectDelFl(empCode);
		// 삭제된 회원이 아니라면 삭제 할 수 없다고 알려줘야함
		if(check.equals("N")) {
			// 삭제가 안된 경우라면
			return -5;
		} else {
			return mapper.deleteIpInfo(empCode);			
		}
		
	}
	
}
