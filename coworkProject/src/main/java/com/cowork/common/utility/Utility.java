package com.cowork.common.utility;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Random;

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

	public static void copyFile(File sourceFile, File destFile) throws IOException {
        
		 if (!sourceFile.exists()) {
	            throw new IOException("Source file does not exist: " + sourceFile.getAbsolutePath());
	        }

	        if (destFile.getParentFile() != null && !destFile.getParentFile().exists()) {
	            if (!destFile.getParentFile().mkdirs()) {
	                throw new IOException("Failed to create destination directory: " + destFile.getParentFile().getAbsolutePath());
	            }
	        }

	        Files.copy(sourceFile.toPath(), destFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
	    }
	
	// 06_23 재준 CoolSMS
	public static int phoneAuth() {
        Random random = new Random();
        
        // 1000 (포함)과 10000 (미포함) 사이의 랜덤 숫자 생성
        int fourDigitNumber = 1000 + random.nextInt(9000);
        
        return fourDigitNumber;
		
	}

}
