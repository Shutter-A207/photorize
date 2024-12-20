package com.shutter.photorize.domain.album.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shutter.photorize.domain.album.entity.Album;
import com.shutter.photorize.domain.album.entity.AlbumMemberList;
import com.shutter.photorize.domain.member.entity.Member;
import com.shutter.photorize.global.error.ErrorType;
import com.shutter.photorize.global.exception.PhotorizeException;

public interface AlbumMemberListRepository extends JpaRepository<AlbumMemberList, Long> {

	default AlbumMemberList getByAlbumAndMemberOrThrow(Album album, Member member) {
		return findByAlbumAndMember(album, member).orElseThrow(
			() -> new PhotorizeException(ErrorType.NO_ALLOCATED_ALBUM));
	}

	@Query("SELECT aml FROM AlbumMemberList aml " +
		"JOIN aml.member m " +
		"WHERE aml.album = :album " +
		"ORDER BY aml.status DESC, m.nickname ASC")
	List<AlbumMemberList> findMembersByAlbum(Album album);

	boolean existsByAlbumAndMember(Album album, Member member);

	default AlbumMemberList getOrThrow(Album album, Member member) {
		return findByAlbumAndMember(album, member).orElseThrow(
			() -> new PhotorizeException(ErrorType.NO_ALLOCATED_ALBUM));
	}

	Optional<AlbumMemberList> findByAlbumAndMember(Album album, Member member);

	@Query("""
		SELECT DISTINCT aml
		FROM AlbumMemberList aml
		         JOIN Member m ON aml.member.id = m.id
		WHERE aml.album IN :albums
		  AND m != :member
		""")
	List<AlbumMemberList> findAlbumMembersByAlbumsAndMemberNot(@Param("albums") List<Album> albums,
		@Param("member") Member member);

	List<AlbumMemberList> findByAlbumAndMemberNotOrderByStatusDescMemberNicknameAsc(Album album, Member member);

}
