package com.cowork.employee.businesscard.model.dto;

import com.cowork.employee.addr.model.dto.MyAddr;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BusinessCard {

	private Integer cardNo;
	private Integer empCode;
	private Integer cardType;
}
