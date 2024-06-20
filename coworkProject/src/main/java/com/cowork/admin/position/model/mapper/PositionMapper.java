package com.cowork.admin.position.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.admin.position.model.dto.Position;

@Mapper
public interface PositionMapper {

	/** 회사 모든 직책 조회해오기
	 * @param comNo
	 * @return positionList
	 */
	List<Position> positionSelectAll(int comNo);

	/** 직책 삭제하기
	 * @param positionNo
	 * @return result
	 */
	int positionDelete(int positionNo);

	/** 직책 추가하기
	 * @param inputPosition
	 * @return result
	 */
	int positionInsert(Position inputPosition);

	/** 하위 레벨 직책 리스트
	 * @param position
	 * @return selectLowLevelList
	 */
	List<Position> selectLowLevelList(Position position);

	/** level 변경
	 * @param position
	 * @return result
	 */
	int positionMiddleUpdate(Position updatePosition);

}
