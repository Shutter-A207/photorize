package com.shutter.photorize.domain.album.controller;

import static com.shutter.photorize.global.constant.Number.*;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.shutter.photorize.domain.album.dto.request.AlbumCreateRequest;
import com.shutter.photorize.domain.album.dto.response.AlbumDetailResponse;
import com.shutter.photorize.domain.album.dto.response.AlbumListResponse;
import com.shutter.photorize.domain.album.service.AlbumService;
import com.shutter.photorize.global.response.ApiResponse;
import com.shutter.photorize.global.response.SliceResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/albums")
public class AlbumController {

	private final AlbumService albumService;

	@PostMapping
	public ResponseEntity<ApiResponse<Void>> createAlbum(
		@RequestPart AlbumCreateRequest albumCreateRequest,
		@RequestPart(required = false) MultipartFile albumImage) {
		albumService.createPublicAlbum(albumCreateRequest, albumImage, "member1@example.com");
		return ApiResponse.created();
	}

	@GetMapping
	public ResponseEntity<ApiResponse<SliceResponse<AlbumListResponse>>> getAllalbums(
		@RequestParam(defaultValue = "0") int pageNumber,
		Long memberId) {

		Pageable pageable = PageRequest.of(pageNumber, ALBUM_BOARD_PAGE_SIZE);
		Slice<AlbumListResponse> response = albumService.getAllalbums(pageable, 1L);
		return ApiResponse.ok(SliceResponse.of(response));
	}

	@GetMapping("{/albumId}")
	public ResponseEntity<ApiResponse<SliceResponse<AlbumDetailResponse>> getAlbumDetail(
		@PathVariable Long albumId, @RequestParam(defaultValue = "0") int pageNumber, Long memberId) {

		Pageable pageable = PageRequest.of(pageNumber, ALBUM_DETAIL_PAGE_SIZE);
		SliceResponse<AlbumDetailResponse> response = albumService.getAlbumDetail(pageable, 1L, albumId);
		return ApiResponse.ok(response);
	}

}
