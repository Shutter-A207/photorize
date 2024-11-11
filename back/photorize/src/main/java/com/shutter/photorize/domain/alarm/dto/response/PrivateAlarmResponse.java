package com.shutter.photorize.domain.alarm.dto.response;

import java.time.LocalDateTime;

import com.shutter.photorize.domain.alarm.entity.AlarmType;
import com.shutter.photorize.domain.alarm.entity.InviteAlarm;

import lombok.Builder;
import lombok.Getter;

@Getter
public class PrivateAlarmResponse extends InviteAlarmResponse {
	private final String sender;
	private final LocalDateTime date;

	@Builder
	private PrivateAlarmResponse(Long alarmId, AlarmType type, String sender, LocalDateTime date) {
		super(alarmId, type);
		this.sender = sender;
		this.date = date;
	}

	public static PrivateAlarmResponse from(InviteAlarm inviteAlarm) {
		return PrivateAlarmResponse.builder()
			.alarmId(inviteAlarm.getId())
			.type(inviteAlarm.getType())
			.sender(inviteAlarm.getMember().getNickname())
			.date(inviteAlarm.getMemory().getDate())
			.build();
	}
}