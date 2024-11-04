import React from "react";
import { Canvas, extend } from "@react-three/fiber";
import {
  OrbitControls,
  useTexture,
  Plane,
  Points,
  PointMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";

// Extend Three.js objects
extend({ BoxBufferGeometry: THREE.BoxGeometry });

const Album = ({ texturePath, position, rotation }) => {
  const texture = useTexture(texturePath);

  return (
    <mesh position={position} rotation={rotation}>
      <boxBufferGeometry args={[1, 1.4, 0.1]} /> {/* 앨범 크기 조절 */}
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
      <PointMaterial size={0.03} color="#FF3E5E" transparent={true} />
      {/* 반짝이는 색상 */}
    </Points>
  );
};

const Home = () => {
  const userProfile = {
    name: "조수연",
    profileImage: "/assets/test/member1.png",
  };

  const albumTextures = [
    "/assets/test/test1.png",
    "/assets/test/test2.jpg",
    "/assets/test/test3.jpg",
    "/assets/test/pose1.jpg",
    "/assets/test/pose2.jpg",
    "/assets/test/pose3.jpg",
    "/assets/test/pose4.jpg",
    "/assets/test/pose5.jpg",

    // 필요한 만큼 추가
  ];

  const radius = 3; // 원형 배치의 반지름
  const angleStep = (2 * Math.PI) / albumTextures.length;

  return (
    <>
      <Header title="" />
      <div className="bg-[#F9F9F9] min-h-screen pt-14 pb-24">
        {/* 상단 프로필 정보 */}
        <div className="flex items-center px-4 py-4">
          <img
            src={userProfile.profileImage}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <p className="ml-3 text-lg font-black text-[#343434]">
            {userProfile.name}님의 소중한 추억들
          </p>
        </div>

        <Canvas className="bg-[#F9F9F9]" style={{ height: "76vh" }}>
          <ambientLight intensity={2.5} />
          <pointLight position={[10, 10, 10]} />
          <directionalLight intensity={0.7} position={[-5, 5, 5]} />
          {/* OrbitControls 설정: enablePan을 false로 설정하여 시점 고정 */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            target={[0, 0, 0]}
            minDistance={5} // 초기 줌을 약간 축소한 거리 설정
            maxDistance={10} // 최대 줌 거리 설정
          />

          {/* 바닥면 추가 */}
          <Plane
            args={[20, 20]}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
          >
            <meshStandardMaterial color="#E0E0E0" />
          </Plane>

          {/* 꽃가루 효과 */}
          <Particles />

          {albumTextures.map((texturePath, index) => {
            const angle = index * angleStep;
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            const rotation = [0, -angle + 33, 0]; // 앨범이 바깥쪽을 향하도록 회전
            return (
              <Album
                key={index}
                texturePath={texturePath}
                position={[x, 0, z]}
                rotation={rotation}
              />
            );
          })}
        </Canvas>
      </div>
      <Footer />
    </>
  );
};

export default Home;
