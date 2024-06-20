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
	public int positionDelete(int positionNo, int comNo) {
		
		// positionNo 의 level 을 가져와야함 1이라면
		int level = mapper.selectLevel(positionNo);
		
		// 지우려는 레벨보다 낮은 레벨을 조회해와야함 2레벨부터 가지고오기
		int selectLevel = level+1;
		
		// level 하위 리스트 불러오기	 comNo level 필요함 2레벨이 setting 됨
		Position position = Position.builder()
				.comNo(comNo)
				.level(selectLevel)
				.build();
		
		// 2와 같거나 큰 애들이 조회됨
		List<Position> selectLowLevelList = mapper.selectLowLevelList(position);
		
		int result = 0;
		
		// 조회된 게 있을 때 레벨을 -1 해줘야함
		if(selectLowLevelList != null) {
			for(int i = 0 ; i < selectLowLevelList.size() ; i ++) {
				
				int temp = selectLowLevelList.get(i).getLevel();
				
				// 2인 애가 1이 됨
				int levelDown = temp - 1;
				
				selectLowLevelList.get(i).setLevelTemp(levelDown);
				
				Position updatePosition = selectLowLevelList.get(i);
				
				result = mapper.positionMiddleUpdate(updatePosition);
				
				if(result < 0) {
					return -5;
				}
				
			}
			
		}
		
		result = mapper.positionDelete(positionNo);
		
		return result;
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
		
		int result = 0;
		
		// 조회된 게 있다면 for 문 돌면서 update 해줘야함 + 1 씩
		if(selectLowLevelList != null) {
			for(int i = 0 ; i < selectLowLevelList.size() ; i ++) {
				
				int temp = selectLowLevelList.get(i).getLevel();
				
				int levelUp = temp + 1;
				
				selectLowLevelList.get(i).setLevelTemp(levelUp);
				
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

	/** 직책 이름 수정
	 * @return result
	 */
	@Override
	public int positionUpdate(Position position) {
		return mapper.positionUpdate(position);
	}

	
	
}
