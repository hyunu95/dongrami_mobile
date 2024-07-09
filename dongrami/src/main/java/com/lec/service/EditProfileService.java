package com.lec.service;

import com.lec.dto.MemberDTO;
import com.lec.entity.Member;
import com.lec.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.Optional;

@Service
public class EditProfileService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public MemberDTO getMemberDTO(String userId) {
        Optional<Member> memberOptional = memberRepository.findByUserId(userId);
        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            MemberDTO memberDTO = new MemberDTO();
            memberDTO.setEmail(member.getEmail());
            memberDTO.setNickname(member.getNickname());
            memberDTO.setPhoneNumber(member.getPhoneNumber());
            // Split birthDate into year, month, day
            if (member.getBirthDate() != null) {
                String[] birthDateParts = member.getBirthDate().toString().split("-");
                memberDTO.setBirthYear(birthDateParts[0]);
                memberDTO.setBirthMonth(birthDateParts[1]);
                memberDTO.setBirthDay(birthDateParts[2]);
            }
            return memberDTO;
        }
        return null; // Handle the case where member is not found
    }

    public void updateMemberDTO(MemberDTO memberDTO, String userId) {
        Optional<Member> memberOptional = memberRepository.findByUserId(userId);
        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            if (memberDTO.getPassword() != null && !memberDTO.getPassword().isEmpty()) {
                member.setPassword(passwordEncoder.encode(memberDTO.getPassword()));
            }
            member.setNickname(memberDTO.getNickname());
            member.setPhoneNumber(memberDTO.getPhoneNumber());
            // Combine birthYear, birthMonth, birthDay into birthDate
            String birthDateStr = memberDTO.getBirthYear() + "-" + memberDTO.getBirthMonth() + "-" + memberDTO.getBirthDay();
            member.setBirthDate(Date.valueOf(birthDateStr));
            memberRepository.save(member);
        }
    }

    public void deleteMember(String userId) {
        memberRepository.deleteById(userId);
    }
}
