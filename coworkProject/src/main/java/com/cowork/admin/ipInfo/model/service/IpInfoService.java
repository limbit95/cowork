package com.cowork.admin.ipInfo.model.service;

import java.util.List;

import com.cowork.admin.ipInfo.model.dto.IpInfo;

public interface IpInfoService {

	/** 회사 모든 ip 정보 가져오기
	 * @param comNo
	 * @return selectAllIpInfoList
	 */
	List<IpInfo> selectAllIpInfoList(int comNo);

	/** 이름 검색 결과 돌려주기
	 * @param inputInfo
	 * @return selectIpInfoList
	 */
	List<IpInfo> selectIpInfoList(IpInfo inputInfo);

	/** ip 수정
	 * @param updateIpInfo
	 * @return updateIpInfo
	 */
	int updateIpInfo(IpInfo updateIpInfo);

	/** ip 실패
	 * @param empCode
	 * @return result
	 */
	int deleteIpInfo(int empCode);

}
