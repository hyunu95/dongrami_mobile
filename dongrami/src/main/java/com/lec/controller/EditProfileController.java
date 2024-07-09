package com.lec.controller;

import com.lec.dto.MemberDTO;
import com.lec.service.EditProfileService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Controller
@RequestMapping("/editprofile")
public class EditProfileController {

    private final EditProfileService editProfileService;

    @Autowired
    public EditProfileController(EditProfileService editProfileService) {
        this.editProfileService = editProfileService;
    }

    @GetMapping
    public String editProfileForm(Model model, Principal principal) {
        if (principal == null) {
            // 인증되지 않은 경우 로그인 페이지로 리디렉션
            return "redirect:/login";
        }

        String userId = principal.getName(); // 사용자 이름 가져오기
        System.out.println("Authenticated user: " + userId);
        MemberDTO memberDTO = editProfileService.getMemberDTO(userId);
        if (memberDTO != null) {
            model.addAttribute("memberDTO", memberDTO);
            return "editprofile"; // editprofile.html로 뷰 이름 반환
        } else {
            // 회원 정보가 없는 경우 에러 페이지로 리디렉션 또는 다른 방식으로 처리
            return "redirect:/error";
        }
    }

    @PostMapping("/update")
    public String updateProfile(@ModelAttribute("memberDTO") @Valid MemberDTO memberDTO, BindingResult result,
                                Model model, Principal principal) {
        if (principal == null) {
            // 인증되지 않은 경우 로그인 페이지로 리디렉션
            return "redirect:/login";
        }

        if (result.hasErrors()) {
            return "editprofile"; // 입력 유효성 검사 에러가 있는 경우 editprofile.html로 이동
        }

        // 패스워드와 패스워드 확인이 일치하는지 확인
        if (!memberDTO.getPassword().equals(memberDTO.getPassword2())) {
            model.addAttribute("passwordError", "Passwords do not match.");
            return "editprofile"; // 패스워드 불일치 에러가 있는 경우 editprofile.html로 이동
        }

        String userId = principal.getName(); // 사용자 이름 가져오기
        editProfileService.updateMemberDTO(memberDTO, userId);
        return "redirect:/profile"; // 프로필 페이지로 리디렉션
    }

    @PostMapping("/delete")
    public String deleteProfile(Principal principal) {
        if (principal == null) {
            // 인증되지 않은 경우 로그인 페이지로 리디렉션
            return "redirect:/login";
        }

        String userId = principal.getName(); // 사용자 이름 가져오기
        editProfileService.deleteMember(userId);
        return "redirect:/logout"; // 로그아웃 처리 후 리디렉션
    }
}
