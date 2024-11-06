package com.shutter.photorize.domain.memory.controller;

import static com.shutter.photorize.global.constant.Number.*;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.shutter.photorize.domain.comment.dto.response.CommentResponse;
import com.shutter.photorize.domain.memory.dto.request.MemoryCreateRequest;
import com.shutter.photorize.domain.memory.dto.request.MemoryUpdateRequest;
import com.shutter.photorize.domain.memory.dto.response.MemoryDetailResponse;
import com.shutter.photorize.domain.memory.service.MemoryService;
import com.shutter.photorize.global.jwt.model.ContextMember;
import com.shutter.photorize.global.response.ApiResponse;
import com.shutter.photorize.global.response.SliceResponse;
import com.shutter.photorize.global.security.AuthUser;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/memories")
@RequiredArgsConstructor
public class MemoryController {

	private final MemoryService memoryService;

	@PostMapping
	public ResponseEntity<ApiResponse<Void>> createMemory(
		@RequestPart("memory") MemoryCreateRequest memoryCreateRequest,
		@RequestPart(value = "photo", required = false) MultipartFile photo,
		@RequestPart(value = "video", required = false) MultipartFile video,
		@AuthUser ContextMember contextMember) {

		List<MultipartFile> files = Stream.of(photo, video)
			.filter(file -> file != null && !file.isEmpty())
			.toList();

		memoryService.createMemory(contextMember.getId(), memoryCreateRequest, files);

		return ApiResponse.created();
	}

	@GetMapping("/{memoryId}")
	public ResponseEntity<ApiResponse<MemoryDetailResponse>> getDetailMemory(@PathVariable Long memoryId,
		@AuthUser ContextMember contextMember) {
		return ApiResponse.ok(memoryService.getMemoryDetail(memoryId));
	}

	@GetMapping("/{memoryId}/comments")
	public ResponseEntity<ApiResponse<SliceResponse<CommentResponse>>> getCommentsByMemoryId(
		@PathVariable Long memoryId,
		@RequestParam(defaultValue = "0") int pageNumber,
		@AuthUser ContextMember contextMember) {
		Pageable pageable = PageRequest.of(pageNumber, COMMENT_PAGE_SIZE);
		return ApiResponse.ok(memoryService.getCommentsByMemoryId(memoryId, pageable));
	}

	@PostMapping("/{memoryId}")
	public ResponseEntity<ApiResponse<Void>> updateMemory(
		@PathVariable Long memoryId,
		@RequestPart("memory") MemoryUpdateRequest memoryUpdateRequest,
		@RequestPart(value = "photo", required = false) MultipartFile photo,
		@RequestPart(value = "video", required = false) MultipartFile video,
		@AuthUser ContextMember contextMember) {

		List<MultipartFile> files = Stream.of(photo, video)
			.filter(file -> file != null && !file.isEmpty())
			.toList();

		memoryService.updateMemory(memoryId, memoryUpdateRequest, files);
		return ApiResponse.ok(null);
	}

	@DeleteMapping("/{memoryId}")
	public ResponseEntity<ApiResponse<Void>> deleteMemory(@PathVariable Long memoryId,
		@AuthUser ContextMember contextMember) {
		memoryService.deleteMemory(memoryId);
		return ApiResponse.ok(null);
	}
}
