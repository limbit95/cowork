package com.cowork.admin.ipInfo.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.ipInfo.model.dto.IpInfo;

@Mapper
public interface IpInfoMapper {

	/** 회사 모든 ip 정보
	 * @param comNo
	 * @return selectAllIpInfoList
	 */
	List<IpInfo> selectAllIpInfoList(int comNo);

}
