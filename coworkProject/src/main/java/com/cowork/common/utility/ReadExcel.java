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

public class ReadExcel {

	public static List<Map<String, String>> readExcel(String fileRename, String folderPath) {
		
		List<Map<String, String>> employeeList = new ArrayList<Map<String, String>>();
		List<String> column = new ArrayList<String>();
		
		try {
			FileInputStream file = new FileInputStream(folderPath + fileRename); 
			Workbook workbook = WorkbookFactory.create(file);
			Sheet sheet = workbook.getSheetAt(0);
			
			for(int x = 0; x <= sheet.getLastRowNum(); x++) {
				Map<String, String> employee = new HashMap<String, String>();
				employee.put("empName", null);
				employee.put("empId", null);
				employee.put("empEmail", null);
				employee.put("empNickname", null);
				employee.put("empTel", null);
				employee.put("empBirth", null);
				employee.put("empNo", null);
				
				// 행 값 지웠는데 있는 걸로 인식할 때 첫 번째 셀 값이 null이면 해당 로우 건너뛰기
				if(String.valueOf(sheet.getRow(x).getCell(0)).equals("null")) {
					continue;
				}
				
				for(int i = 0; i < sheet.getRow(x).getLastCellNum(); i++) {
					// 해당 셀의 분류 값을 자동으로 인식해서 넣게끔하려 했지만 일일이 지정해서 넣는게 더 관리하기 편해서 65번~71번줄 처럼 대체 변경함
					if(x == 0) {
						column.add(String.valueOf(sheet.getRow(x).getCell(i)));
					}
					
					if(x > 0) {
						// String 형 19950516 -> 1995-05-16으로 변환하는 코드인데 19950516도 DB TO_DATE 변환으로 삽입 가능해서 주석처리함
//						if(i == 5 && sheet.getRow(x).getCell(i) != null) {
//							String date = String.valueOf(sheet.getRow(x).getCell(i));
//							String year = date.substring(0, 4);
//							String month = date.substring(4, 6);
//							String day = date.substring(6, 8);
//							date = year + "-" + month + "-" + day;
//							employee.put(column.get(i), date);
//						}
//						System.out.println(String.valueOf(sheet.getRow(x).getCell(i)));
						employee.put(column.get(i), String.valueOf(sheet.getRow(x).getCell(i)));
					}
				}
				
				if(x > 0) {
					employeeList.add(employee);
				}
				System.out.println();
			}
			file.close();
			
		} catch(IOException e) {
			e.printStackTrace();
		} 
		
//		System.out.println(employeeList);
		
		return employeeList;
	}
	
}