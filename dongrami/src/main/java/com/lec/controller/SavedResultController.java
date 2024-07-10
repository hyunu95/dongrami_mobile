package com.lec.controller;

import java.text.ParseException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.lec.dto.SavedResultDTO;
import com.lec.entity.Member;
import com.lec.entity.SavedResult;
import com.lec.service.SavedResultService;

import jakarta.servlet.http.HttpSession;

@Controller
public class SavedResultController {
	
	@Autowired
	SavedResultService savedResultService;
	
	@PostMapping("/save")
	public String saveResult(@RequestParam("userId") String userId,
							@RequestParam("webReadingId") int webReadingId,
							@RequestParam("readingTitle") String readingTitle,
							@RequestParam("subId") int subId,
							@RequestParam("cardId") int cardId
							) throws ParseException {
		
		
		savedResultService.saveResult(userId, webReadingId, readingTitle, subId, cardId);
		
		return "redirect:/index";
	}

}
