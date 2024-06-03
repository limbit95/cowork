package com.cowork.employee.chatting.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.cowork.employee.chatting.model.dto.Employee;

@Mapper
public interface ChatMapper {

	List<Employee> empList(Map<String, Object> paramMap);

}
