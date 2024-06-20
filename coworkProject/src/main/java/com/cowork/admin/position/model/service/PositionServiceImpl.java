package com.cowork.admin.position.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cowork.admin.position.model.dto.Position;
import com.cowork.admin.position.model.mapper.PositionMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Transactional(rollbackFor = Exception.class)
@Service
@RequiredArgsConstructor
@Slf4j
public class PositionServiceImpl implements PositionService {
	
	private final PositionMapper mapper;
	
	/** 모든 직책 조회하기
	 * @return positionList
	 */
	@Override
	public List<Position> positionSelectAll(int comNo) {
		return mapper.positionSelectAll(comNo);
	}

	/** 직책 삭제
	 * @return result
	 */
	@Override
	public int positionDelete(int positionNo) {
		
		// positionNo 의 level 을 가져와야함
		
		return mapper.positionDelete(positionNo);
	}

	/** 직책 추가하기
	 * @return result
	 */
	@Override
	public int positionInsert(Position inputPosition) {
		return mapper.positionInsert(inputPosition);
	}

	/** 중간 직책 추가하기
	 * @return result
	 */
	@Override
	public int positionMiddleInsert(Position position) {

		// 같은 level 에 들어있는 리스트 하위 불러오기
		List<Position> selectLowLevelList = mapper.selectLowLevelList(position);
		
		int result = -1;
		
		// 조회된 게 있다면 for 문 돌면서 update 해줘야함 + 1 씩
		if(selectLowLevelList != null) {
			for(int i = 0 ; i < selectLowLevelList.size() ; i ++) {
				
				int temp = selectLowLevelList.get(i).getLevel();
				
				int levelUp = temp + 1;
				
				selectLowLevelList.get(i).setLevelUp(levelUp);
				
				Position updatePosition = selectLowLevelList.get(i);
				
				result = mapper.positionMiddleUpdate(updatePosition);
				
				if(result < 0) {
					return -5;
				}
				
			}
			
		}
		
		result = mapper.positionInsert(position);
		
		return result;
	}

	
	
}
