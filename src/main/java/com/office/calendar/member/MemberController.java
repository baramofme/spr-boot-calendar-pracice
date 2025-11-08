package com.office.calendar.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class MemberController {

    @Autowired
    MemberService memberService;

    @GetMapping("member/signup")
    public String signup(){

        return "signup_form";
    }

    @PostMapping("member/signup_confirm")
    public String signupConfirm(Model model){

        int result =  memberService.signupConfirm();

        model.addAttribute("signup_result", result);

        return "signup_result";
    }


}
