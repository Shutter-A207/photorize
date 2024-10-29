package com.shutter.photorize.domain.spot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shutter.photorize.domain.spot.entity.SpotCode;

@Repository
public interface SpotCodeRepository extends JpaRepository<SpotCode, Long> {
}
