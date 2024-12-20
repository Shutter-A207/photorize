package com.shutter.photorize.domain.album.controller;

import static com.shutter.photorize.global.constant.CommonConstants.*;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shutter.photorize.domain.album.dto.request.AlbumCreateRequest;
import com.shutter.photorize.domain.album.dto.request.AlbumModifyRequest;
import com.shutter.photorize.domain.album.dto.response.AlbumCreateResponse;
import com.shutter.photorize.domain.album.dto.response.AlbumDetailResponse;
import com.shutter.photorize.domain.album.dto.response.AlbumListResponse;
import com.shutter.photorize.domain.album.dto.response.AlbumSearchResponse;
import com.shutter.photorize.domain.album.dto.response.ColorListResponse;
import com.shutter.photorize.domain.album.service.AlbumService;
import com.shutter.photorize.domain.album.service.ColorService;
import com.shutter.photorize.global.jwt.model.ContextMember;
import com.shutter.photorize.global.response.ApiResponse;
import com.shutter.photorize.global.response.SliceResponse;
import com.shutter.photorize.global.security.AuthUser;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/albums")
public class AlbumController {

	private final AlbumService albumService;
	private final ColorService colorService;

	@PostMapping
	public ResponseEntity<ApiResponse<AlbumCreateResponse>> createAlbum(
		@RequestBody @Valid AlbumCreateRequest albumCreateRequest,
		@AuthUser ContextMember contextmember) {

		AlbumCreateResponse albumCreateResponse = albumService.createPublicAlbum(albumCreateRequest,
			contextmember.getId());
		return ApiResponse.ok(albumCreateResponse);
	}

	@GetMapping
	public ResponseEntity<ApiResponse<SliceResponse<AlbumListResponse>>> getAllAlbums(
		@RequestParam(defaultValue = "0") int pageNumber,
		@AuthUser ContextMember contextmember) {

		Pageable pageable = PageRequest.of(pageNumber, ALBUM_PAGE_SIZE);
		Slice<AlbumListResponse> response = albumService.getAllalbums(pageable, contextmember.getId());
		return ApiResponse.ok(SliceResponse.of(response));
	}

	@GetMapping("/all")
	public ResponseEntity<ApiResponse<List<AlbumListResponse>>> getAllAlbums(
		@AuthUser ContextMember contextmember) {

		List<AlbumListResponse> response = albumService.getAllAlbums(contextmember.getId());
		return ApiResponse.ok(response);
	}

	@GetMapping("/{albumId}")
	public ResponseEntity<ApiResponse<SliceResponse<AlbumDetailResponse>>> getAlbumDetail(
		@PathVariable Long albumId, @RequestParam(defaultValue = "0") int pageNumber,
		@AuthUser ContextMember contextmember) {

		Pageable pageable = PageRequest.of(pageNumber, ALBUM_DETAIL_PAGE_SIZE);
		SliceResponse<AlbumDetailResponse> response = albumService.getAlbumDetail(pageable, albumId,
			contextmember.getId());
		return ApiResponse.ok(response);
	}

	@PostMapping("/{albumId}")
	public ResponseEntity<ApiResponse<Void>> modifyAlbum(
		@RequestBody @Valid AlbumModifyRequest albumModifyRequest,
		@PathVariable Long albumId,
		@AuthUser ContextMember contextmember) {
		albumService.modifyAlbum(albumModifyRequest, albumId, contextmember.getId());
		return ApiResponse.created();
	}

	@DeleteMapping("/{albumId}")
	public ResponseEntity<ApiResponse<Void>> unfollowAlbum(
		@PathVariable Long albumId,
		@AuthUser ContextMember contextmember) {
		albumService.unfollowAlbum(albumId, contextmember.getId());
		return ApiResponse.created();
	}

	@GetMapping("/colors")
	public ResponseEntity<ApiResponse<ColorListResponse>> getColors(
		@AuthUser ContextMember contextmember) {
		ColorListResponse colorListResponse = colorService.getColorList();
		return ApiResponse.ok(colorListResponse);
	}

	@GetMapping("/search")
	public ResponseEntity<ApiResponse<List<AlbumSearchResponse>>> searchAlbum(
		@RequestParam("keyword") String keyword,
		@AuthUser ContextMember contextmember) {
		List<AlbumSearchResponse> albumSearchResponses = albumService.searchAlbum(keyword, contextmember.getId());

		return ApiResponse.ok(albumSearchResponses);

	}

}