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
			
			int flag = 0;
			
			int whileIndex = 0;
			int rowIndex = 0;
			
			while(whileIndex < sheet.getPhysicalNumberOfRows()) {

				if(sheet.getRow(rowIndex) == null) {
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
					if(sheet.getRow(rowIndex).getCell(i) == null) {
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