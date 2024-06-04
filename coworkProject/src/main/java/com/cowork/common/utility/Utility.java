package com.cowork.common.utility;

import java.text.SimpleDateFormat;

public class Utility {
	
	public static int seqNum = 1;
	
	public static String fileRename(String originalFileName) {

		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		
		String date = sdf.format(new java.util.Date());
		
		String number = String.format("%05d", seqNum);
		
		seqNum++; 
		if(seqNum == 100000) seqNum = 1;
		
		String ext =
				originalFileName.substring(originalFileName.lastIndexOf("."));
		
		return date + "_" + number + ext;
	}

}
