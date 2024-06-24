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

	/** 검색한 이름 조회
	 * @param inputInfo
	 * @return selectIpInfoList
	 */
	List<IpInfo> selectIpInfoList(IpInfo inputInfo);

	/** ip 수정
	 * @param updateIpInfo
	 * @return result
	 */
	int updateIpInfo(IpInfo updateIpInfo);

	/** ip 삭제
	 * @param empCode
	 * @return result
	 */
	int deleteIpInfo(int empCode);

	/** 삭제된 회원인지 조회
	 * @param empCode
	 * @return N / Y
	 */
	String selectDelFl(int empCode);

	/** IP 중복 확인
	 * @param updateIpInfo
	 * @return count
	 */
	int duplicationIp(IpInfo updateIpInfo);

}
