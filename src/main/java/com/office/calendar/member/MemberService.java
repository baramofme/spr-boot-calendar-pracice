package com.office.calendar.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberService {

    @Autowired
    MemberDao memberDao;

    public int signupConfirm() {

        // 회원가입 결과 상태
        int signupResult = -1;

        // 1. 기존 회원인지 확인
        Boolean isMember = memberDao.isMember();

        // 2. 회원여부에 처리
        if(!isMember) {

            // 회원가입 진행
            int insertResult = memberDao.insertMember();

            // 인서트 결과가 있으면 가입 성공
            if(insertResult == 1) {
                signupResult = insertResult;
            } else {
                signupResult = -1;
            }

        // 회원이 기 존재함
        } else {
            signupResult = 0;
        }

        return signupResult;
    }
}
