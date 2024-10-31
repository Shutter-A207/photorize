package com.shutter.photorize.domain.spot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SpotResponse {
	private Long spotId;
	private String spotName;
	private Double latitude;
	private Double longitude;

}