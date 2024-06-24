package com.cowork.employee.businesscard.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.employee.businesscard.model.dto.BusinessCard;
@Mapper
public interface BusinessCardMapper {

	BusinessCard findRow(Integer empCode);

	void insertRow(Map<String, Object> paramMap);

	void updateRow(Map<String, Object> paramMap);


}
