package com.lec.service;

import com.lec.dto.MemberDTO;
import com.lec.entity.Member;
import com.lec.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.Optional;

@Service
public class EditProfileService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReplyRepository replyRepository;
    private final VoteResultRepository voteResultRepository;
    private final SavedResultRepository savedResultRepository;
    private final ReviewRepository reviewRepository;

    @Autowired
    public EditProfileService(MemberRepository memberRepository, PasswordEncoder passwordEncoder,
                              ReplyRepository replyRepository, VoteResultRepository voteResultRepository,
                              SavedResultRepository savedResultRepository, ReviewRepository reviewRepository) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.replyRepository = replyRepository;
        this.voteResultRepository = voteResultRepository;
        this.savedResultRepository = savedResultRepository;
        this.reviewRepository = reviewRepository;
    }

    public MemberDTO getMemberDTO(String userId) {
        Optional<Member> memberOptional = memberRepository.findByUserId(userId);
        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            MemberDTO memberDTO = new MemberDTO();
            memberDTO.setEmail(member.getEmail());
            memberDTO.setNickname(member.getNickname());
            memberDTO.setPhoneNumber(member.getPhoneNumber());
            if (member.getBirthDate() != null) {
                String[] birthDateParts = member.getBirthDate().toString().split("-");
                memberDTO.setBirthYear(birthDateParts[0]);
                memberDTO.setBirthMonth(birthDateParts[1]);
                memberDTO.setBirthDay(birthDateParts[2]);
            }
            return memberDTO;
        }
        return null;
    }

    @Transactional
    public void updateMemberDTO(MemberDTO memberDTO, String userId) {
        Optional<Member> memberOptional = memberRepository.findByUserId(userId);
        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            if (memberDTO.getPassword() != null && !memberDTO.getPassword().isEmpty()) {
                member.setPassword(passwordEncoder.encode(memberDTO.getPassword()));
            }
            member.setNickname(memberDTO.getNickname());
            member.setPhoneNumber(memberDTO.getPhoneNumber());
            String birthDateStr = memberDTO.getBirthYear() + "-" + memberDTO.getBirthMonth() + "-" + memberDTO.getBirthDay();
            member.setBirthDate(Date.valueOf(birthDateStr));
            memberRepository.save(member);
        }
    }

    @Transactional
    public void deleteMember(String userId) {
        Optional<Member> memberOptional = memberRepository.findByUserId(userId);
        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            // Delete associated data in order: review -> saved_result -> reply -> vote_result
            deleteReviewsByUserId(userId);
            deleteSavedResultsByUserId(userId);
            deleteRepliesByUserId(userId);
            deleteVoteResultsByUserId(userId);
            // Finally delete the member itself
            memberRepository.delete(member);
        }
    }

    @Transactional
    public void deleteReviewsByUserId(String userId) {
        reviewRepository.deleteByMemberUserId(userId);
    }

    @Transactional
    public void deleteRepliesByUserId(String userId) {
        replyRepository.deleteByMemberUserId(userId);
    }

    @Transactional
    public void deleteVoteResultsByUserId(String userId) {
        voteResultRepository.deleteByMemberUserId(userId);
    }

    @Transactional
    public void deleteSavedResultsByUserId(String userId) {
        savedResultRepository.deleteByMemberUserId(userId);
    }
}
