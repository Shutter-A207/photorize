package com.shutter.photorize.domain.album.dto.request;

import java.util.List;

import com.shutter.photorize.domain.album.entity.Album;
import com.shutter.photorize.domain.album.entity.AlbumMemberList;
import com.shutter.photorize.domain.album.entity.AlbumType;
import com.shutter.photorize.domain.album.entity.Color;
import com.shutter.photorize.domain.member.entity.Member;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AlbumCreateRequest {
	private String name;
	private Long colorId;
	private List<Long> members;

	public Album toAlbum(Member member, Color color, String name) {
		return Album.builder()
			.member(member)
			.color(color)
			.name(name)
			.type(AlbumType.PUBLIC)
			.build();
	}

	public AlbumMemberList toList(Album album, Member member, boolean status) {
		return AlbumMemberList.builder()
			.album(album)
			.member(member)
			.status(status)
			.build();
	}
}