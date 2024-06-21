package com.cowork.admin.ipInfo.model.service;

import java.util.List;

import com.cowork.admin.ipInfo.model.dto.IpInfo;

public interface IpInfoService {

	/** 회사 모든 ip 정보 가져오기
	 * @param comNo
	 * @return selectAllIpInfoList
	 */
	List<IpInfo> selectAllIpInfoList(int comNo);

}
