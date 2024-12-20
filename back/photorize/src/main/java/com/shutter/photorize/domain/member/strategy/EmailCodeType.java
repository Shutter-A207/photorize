package com.shutter.photorize.domain.member.strategy;

import com.shutter.photorize.infra.mail.model.EmailFormType;

import lombok.Getter;

@Getter
public enum EmailCodeType {

	SIGNUP("회원가입", EmailFormType.SIGNUP_AUTH),
	PASSWORD_CHANGE("비밀번호 변경", EmailFormType.PASSWORD_CHANGE_AUTH);
	private final String type;
	private final EmailFormType emailFormType;

	EmailCodeType(String type, EmailFormType emailFormType) {
		this.type = type;
		this.emailFormType = emailFormType;
	}

	public static EmailCodeType of(String type) {
		return EmailCodeType.valueOf(type.toUpperCase());
	}
}
