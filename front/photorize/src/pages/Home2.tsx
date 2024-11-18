import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTexture,
  OrbitControls,
  Points,
  PointMaterial,
  Stars,
} from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";
import { getUserInfo } from "../api/UserAPI";
import { fetchMainPageMemories } from "../api/MemoryAPI";

interface UserProfile {
  memberId: number;
  nickname: string;
  img: string;
}

interface Memory {
  memoryId: number;
  url: string;
  albumName: string;
}

const convertToCloudFrontUrl = (s3Url) => {
  return s3Url.replace(
    "https://photorize-upload.s3.ap-northeast-2.amazonaws.com",
    "https://d2vjxybuzd3i4m.cloudfront.net"
  );
};

// Extend Three.js objects
extend({ BoxBufferGeometry: THREE.BoxGeometry });

const Album = ({ texturePath, position, rotation, onClick }) => {
  const texture = useTexture(texturePath);

  return (
    <mesh position={position} rotation={rotation} onClick={onClick}>
      <boxBufferGeometry args={[1, 1.4, 0.02]} /> {/* 앨범 크기 조절 */}
      <boxBufferGeometry args={[1, 1.4, 0.02]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const Particles = () => {
  const points = new Float32Array(500).map(() =>
    THREE.MathUtils.randFloatSpread(5)
  );
  return (
    <Points positions={points} stride={3} frustumCulled>
      <PointMaterial size={0.05} color="#FFF021" transparent={true} />
      {/* 반짝이는 색상 */}
    </Points>
  );
};

// 개별 별똥별 컴포넌트
const ShootingStar = ({ initialPosition, direction }) => {
  const starRef = React.useRef();

  useFrame(() => {
    if (starRef.current) {
      starRef.current.position.x += direction[0] * 0.05;
      starRef.current.position.y += direction[1] * 0.05;
      starRef.current.position.z += direction[2] * 0.05;

      if (Math.abs(starRef.current.position.x) > 5) {
        starRef.current.position.set(...initialPosition);
      }
    }
  });

  return (
    <mesh ref={starRef} position={initialPosition}>
      <sphereGeometry args={[0.075, 16, 16]} />
      <meshBasicMaterial color="#FFFFFF" />
    </mesh>
  );
};

const Home2 = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserInfo();
        setUserProfile(userData);
      } catch (error) {
        console.error("유저 정보 가져오기 중 오류 발생:", error);
      }
    };

    const fetchMemories = async () => {
      try {
        const data = await fetchMainPageMemories(); // 8개의 랜덤 추억을 가져오는 API 호출
        setMemories(data.data); // API 응답에서 memories 데이터 설정
      } catch (error) {
        console.error("추억 데이터 가져오기 중 오류 발생:", error);
      }
    };

    fetchUserProfile();
    fetchMemories();
  }, []);
  const radius = 3; // 원형 배치의 반지름
  const angleStep = memories.length ? (2 * Math.PI) / memories.length : 0;

  const shootingStars = Array.from({ length: 15 }, () => {
    const direction = [
      THREE.MathUtils.randFloatSpread(1) * (Math.random() > 0.5 ? 1 : -1), // x 방향으로 랜덤하게 이동
      THREE.MathUtils.randFloat(-0.5, 0.5), // y 방향으로 랜덤하게 이동 (위, 아래 모두 가능)
      THREE.MathUtils.randFloatSpread(1) * (Math.random() > 0.5 ? 1 : -1), // z 방향으로 랜덤하게 이동
    ];

    const speed = THREE.MathUtils.randFloat(1, 2); // 속도를 다르게 설정

    return {
      initialPosition: [
        THREE.MathUtils.randFloatSpread(5),
        THREE.MathUtils.randFloatSpread(5),
        THREE.MathUtils.randFloatSpread(5),
      ],
      direction: direction.map((d) => d * speed), // 방향과 속도 설정
    };
  });

  return (
    <>
      <Header title="" />
      <div
        className="bg-[#000000] min-h-screen pt-14 pb-24 overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* 상단 프로필 정보 */}
        <div className="flex items-center justify-between px-4 py-4">
          {userProfile ? (
            <div className="flex items-center">
              <img
                src={userProfile.img}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
              <p className="ml-3 text-lg font-black text-white">
                {`${userProfile.nickname}님의 소중한 추억들`}
              </p>
            </div>
          ) : (
            <div></div>
          )}
          <img
            src="/assets/moonIcon3.png" // moonIcon 이미지 경로
            alt="Moon Icon"
            className="w-12 h-12" // 아이콘 크기
            onClick={() => navigate("/home")}
          />
        </div>

        <Canvas className="bg-[#000000]" style={{ height: "77vh" }}>
          <ambientLight intensity={2.5} />
          <pointLight position={[10, 10, 10]} />
          <directionalLight intensity={0.7} position={[-5, 5, 5]} />
          {/* OrbitControls 설정: enablePan을 false로 설정하여 시점 고정 */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            target={[0, 0, 0]}
            minDistance={5} // 초기 줌을 약간 축소한 거리 설정
            maxDistance={7} // 최대 줌 거리 설정
          />

          {/* 꽃가루 효과 */}
          <Particles />
          <Stars
            radius={10}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
          />

          {/* 여러 개의 별똥별 추가 */}
          {shootingStars.map((star, index) => (
            <ShootingStar
              key={index}
              initialPosition={star.initialPosition}
              direction={star.direction}
            />
          ))}

          {memories
            .filter((memory) => memory.url) // url이 존재하는 항목만 렌더링
            .map((memory, index) => {
              const angle = index * angleStep;
              const x = radius * Math.cos(angle);
              const z = radius * Math.sin(angle);
              const rotation = [0, -angle + 33, 0];
              const cloudFrontUrl = convertToCloudFrontUrl(memory.url);
              return (
                <Album
                  key={memory.memoryId}
                  texturePath={cloudFrontUrl}
                  position={[x, 0, z]}
                  rotation={rotation}
                  onClick={() => navigate(`/memory/${memory.memoryId}`)}
                />
              );
            })}
        </Canvas>
      </div>
      <Footer />
    </>
  );
};

export default Home2;
