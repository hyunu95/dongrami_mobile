package com.lec.service;

import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Random;

import com.lec.dto.MemberDTO;
import com.lec.entity.Member;

public interface MemberService {
	
	Member join(MemberDTO memberDTO)throws ParseException;
	Date getCurrentDate() throws ParseException;
	String generateString();
	String generateRandomString(String source, int length, Random random);
	List<Member> findByNickname(String nickname);
	boolean findPassword(String email);
	

}
