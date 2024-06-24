package com.cowork.common.utility;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ReadExcel {

	public static List<Map<String, Object>> readExcel(String fileRename, String folderPath) {
		
		List<Map<String, Object>> employeeList = new ArrayList<Map<String, Object>>();
		
		List<String> draft = new ArrayList<String>();
		draft.add("성");
		draft.add("이름");
		draft.add("ID");
		draft.add("전화번호");
		draft.add("이메일");
		draft.add("생일");
		draft.add("부서");
		draft.add("팀");
		draft.add("직급");
		draft.add("계약형태");
		draft.add("근무처");
		draft.add("내선번호");
		draft.add("입사일");
		draft.add("사번");
		
		try {
			FileInputStream file = new FileInputStream(folderPath + fileRename); 
			Workbook workbook = WorkbookFactory.create(file);
			Sheet sheet = workbook.getSheetAt(0);
			
			int whileIndex2 = 0;
			int rowIndex2 = 0;
			
			int rowCount = 0;
			
			while(whileIndex2 < sheet.getPhysicalNumberOfRows()) {
				
				if(sheet.getRow(rowIndex2) == null) {
					rowIndex2++;
					continue;
				}
				
				boolean check1 = false;
				for(int i = 0; i < 14; i++) {
					if(sheet.getRow(rowIndex2).getCell(i) != null) {
						String getCell = sheet.getRow(rowIndex2).getCell(i).getStringCellValue();
						if(!getCell.equals("")) {
							check1 = true;
						}
					}
				}
				if(!check1) {
					whileIndex2++;
					rowIndex2++;
				} else {
					whileIndex2++;
					rowIndex2++;
					rowCount++;
				}
			}
			
			log.info("진짜 행 개수 : " + rowCount);
			
			if(rowCount == 0) {
				Map<String, Object> flagMap = new HashMap<String, Object>();
				flagMap.put("error1", "등록하려는 파일이 유효하지 않습니다.");
				employeeList.add(flagMap);
				return employeeList; 
			}
			if(rowCount == 1) {
				Map<String, Object> flagMap = new HashMap<String, Object>();
				flagMap.put("error1", "구성원 정보가 존재하지 않습니다.");
				employeeList.add(flagMap);
				return employeeList; 
			}
			
			int flag = 0;
			
			int whileIndex = 0;
			int rowIndex = 0;
			
			
			while(whileIndex < sheet.getPhysicalNumberOfRows()) {
				
				// 엑셀 파일에서 행이 존재하지 않으면 다음으로 넘어가는데
				// while문은 실제 행의 개수만큼 반복해야하기 때문에
				// 존재하지 않는 행의 인덱스를 조회했을 때 while의 카운트는 그대로지만
				// 엑셀에서의 행 인덱스는 다음으로 넘어가야하기 때문에 rowIndex에만 1을 증가시킨다
				if(sheet.getRow(rowIndex) == null) {
					rowIndex++;
					continue;
				}

				// 엑셀 파일에서의 문제가 하나 발생한다
				// 파일 내에서 왼쪽 숫자로 나열되어 있는 행을 직접 드래그 하고 삭제하지 않고
				// 셀 자체만 드래그 해서 삭제시 우리 눈에는 해당 행의 셀의 값이 하나도 없어도
				// 자바에서는 행은 존재하나 셀의 값만 없다고 판단하여 해당 행의 셀들을 조회하려고 한다
				// 그래서 실제 셀만 드래그 해서 삭제 후 서비스에서 파일 업로드 하면 빈 값들로
				// 구성원 일괄 추가 화면에 나타나게 된다
				// 분명히 셀을 지웠는데 행을 읽고 행의 셀의 값이 없는 그대로 업로드 시켜버린 것
				// 그래서 행은 있는데 셀의 값이 하나도 없을 경우를 검사하는 코드를 짰고
				// 그래서 아래 코드는 만약 행의 셀의 값이 하나도 존재하지 않으면 그 행은 넘어가라는 코드다
				boolean check1 = false;
				for(int i = 0; i < 14; i++) {
					if(sheet.getRow(rowIndex).getCell(i) != null) {
						String getCell = sheet.getRow(rowIndex).getCell(i).getStringCellValue();
						if(!getCell.equals("")) {
							check1 = true;
						}
					}
				}
				if(!check1) {
					whileIndex++;
					rowIndex++;
					continue;
				}
				
				boolean flag2 = false;
				
				Map<String, Object> employee = new HashMap<String, Object>();
				employee.put("성", "null");
				employee.put("이름", "null");
				employee.put("ID", "null");
				employee.put("전화번호", "null");
				employee.put("이메일", "null");
				employee.put("생일", "null");
				employee.put("부서", "null");
				employee.put("팀", "null");
				employee.put("직급", "null");
				employee.put("계약형태", "null");
				employee.put("근무처", "null");
				employee.put("내선번호", "null");
				employee.put("입사일", "null");
				employee.put("사번", "null");
				
				if(flag == 1) {
					Map<String, Object> flagMap = new HashMap<String, Object>();
					flagMap.put("error1", "등록하려는 파일이 유효하지 않습니다.");
					employeeList.add(flagMap);
					return employeeList; 
				}
				
				for(int i = 0; i < draft.size(); i++) {
					String column = "null";
					
					// 셀 값이 비어있으면 해당 구성원의 정보 항목에는 null 값 담기
					if(sheet.getRow(rowIndex).getCell(i) == null && rowIndex > 0) {
						continue;
					} else {
						column = String.valueOf(sheet.getRow(rowIndex).getCell(i));
						flag2 = true;
					}
					
					// 0번째 행은 정보 항목이기 때문에 구성원 정보인 1번째 행부터 값을 담는다
					if(rowIndex > 0) {
						employee.put(draft.get(i), column);
					}
					
					// 헤드 양식 변경 됐을 경우
					if(rowIndex == 0) {
						if(!draft.get(i).equals(column)) {
							flag = 1;
							break;
						}
					}
				}
				
				// 행의 첫 번째 행은 정보 항목이기에 employee 리스트에 담을 필요 없음
				if(rowIndex == 0) {
					whileIndex++;
					rowIndex++;
					continue;
				}
				
				
				if(!flag2) {
					if(15 <= sheet.getRow(rowIndex).getLastCellNum()) {
						whileIndex++;
					}
					rowIndex++;
				} else {
					whileIndex++;
					rowIndex++;
					employeeList.add(employee);
				}
				
			}
			
			file.close();
			
		} catch(IOException e) {
			e.printStackTrace();
		} 
		
		return employeeList;
	}
	
}