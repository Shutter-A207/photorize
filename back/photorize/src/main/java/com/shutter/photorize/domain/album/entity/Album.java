package com.shutter.photorize.domain.album.entity;

import com.shutter.photorize.domain.member.entity.Member;
import com.shutter.photorize.global.entity.SoftDeletableEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Album extends SoftDeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "color_id", nullable = false)
	private Color color;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private AlbumType type;

	@Builder
	private Album(Member member, Color color, String name, AlbumType type) {
		this.member = member;
		this.color = color;
		this.name = name;
		this.type = type;
	}

	public static Album of(Member member, Color color, String name, AlbumType type) {
		return new Album(member, color, name, type);
	}

	public void updateName(String name) {
		this.name = name;
	}

	public void updateColor(Color color) {
		this.color = color;
	}

}
