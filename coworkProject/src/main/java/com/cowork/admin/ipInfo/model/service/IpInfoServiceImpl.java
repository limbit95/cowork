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
		return mapper.selectAllIpInfoList(comNo);
	}
	
}
