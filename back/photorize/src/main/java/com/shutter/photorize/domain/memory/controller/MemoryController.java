package com.shutter.photorize.domain.memory.controller;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.shutter.photorize.domain.memory.dto.request.MemoryCreateRequest;
import com.shutter.photorize.domain.memory.service.MemoryService;
import com.shutter.photorize.global.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/memories")
@RequiredArgsConstructor
public class MemoryController {

	private final MemoryService memoryService;

	@PostMapping
	public ResponseEntity<ApiResponse<Void>> createMemory(
		@RequestPart("memory") MemoryCreateRequest memoryCreateRequest,
		@RequestPart("photo") MultipartFile photo,
		@RequestPart("video") MultipartFile video) {

		List<MultipartFile> files = Stream.of(photo, video)
			.filter(file -> file != null && !file.isEmpty())
			.toList();

		//FIXME: 추후 하드코딩 수정해야합니다.
		memoryService.createMemory(1L, memoryCreateRequest, files);

		return ApiResponse.created();
	}
}