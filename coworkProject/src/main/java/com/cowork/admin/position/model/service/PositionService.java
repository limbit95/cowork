package com.cowork.admin.position.model.service;

import java.util.List;

import com.cowork.admin.position.model.dto.Position;

public interface PositionService {

	/** 모든 직책 조회
	 * @param comNo
	 * @return positionList
	 */
	List<Position> positionSelectAll(int comNo);

	/** 직책 삭제
	 * @param positionNo
	 * @return result
	 */
	int positionDelete(int positionNo);

	/** 직책 추가
	 * @param positionNm
	 * @return result
	 */
	int positionInsert(Position inputPosition);

	/** 중간 직책 추가
	 * @param position
	 * @return result
	 */
	int positionMiddleInsert(Position position);

}
