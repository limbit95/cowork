package com.cowork.admin.ipInfo.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.ipInfo.model.dto.IpInfo;
import com.cowork.admin.ipInfo.model.mapper.IpInfoMapper;

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
				
				IpInfo addIpInfo = new IpInfo();
				
				// 이름 합쳐주기
				String fullName = "";
				
				// 성
				fullName = selectAllIpInfoList.get(i).getEmpLastName();
				
				// 이름
				fullName += selectAllIpInfoList.get(i).getEmpFirstName();

				addIpInfo.setFullName(fullName);
				
				// deptNm, teamNm 처리
				
			}
		}
		
		return selectAllIpInfoList;
	}
	
}
