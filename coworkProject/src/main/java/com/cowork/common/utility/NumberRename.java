package com.cowork.common.utility;

public class NumberRename {

	public static String Phonerename(String phone) {
		if(phone != null) {
			if(!phone.substring(0, 2).equals("02")) {
				if(phone.length() == 11) {
					phone = phone.substring(0, 3) + "-" + phone.substring(3, 7) + "-" + phone.substring(7, 11);
				}
			} else {
				if(phone.length() == 9) {
					phone = phone.substring(0, 2) + "-" + phone.substring(2, 5) + "-" + phone.substring(5, 9);
				}
				if(phone.length() == 10) {
					phone = phone.substring(0, 2) + "-" + phone.substring(2, 6) + "-" + phone.substring(6, 10);
				}
			}
		}
		
		return phone;
	}
	
	public static String empTelRaname(String empTel) {
		if(empTel != null) {
			if(!empTel.substring(0, 2).equals("02")) {
				if(empTel.length() == 11) {
					empTel = empTel.substring(0, 3) + "-" + empTel.substring(3, 7) + "-" + empTel.substring(7, 11);
				}
			} else {
				if(empTel.length() == 9) {
					empTel = empTel.substring(0, 2) + "-" + empTel.substring(2, 5) + "-" + empTel.substring(5, 9);
				}
				if(empTel.length() == 10) {
					empTel = empTel.substring(0, 2) + "-" + empTel.substring(2, 6) + "-" + empTel.substring(6, 10);
				}
			}
		}
		
		return empTel;
	}
	
	public static String empBirthRaname(String empBirth) {
		if(empBirth != null && empBirth.length() == 8) {
			empBirth = empBirth.substring(0, 4) + "-" + empBirth.substring(4, 6) + "-" + empBirth.substring(6, 8);
		}
		return empBirth;
	}
		
	public static String hireDateRaname(String hireDate) {
		if(hireDate != null && hireDate.length() == 8) {
			hireDate = hireDate.substring(0, 4) + "-" + hireDate.substring(4, 6) + "-" + hireDate.substring(6, 8);
		}
		return hireDate;
	}
		
	
	
}