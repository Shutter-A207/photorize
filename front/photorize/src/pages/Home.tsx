import React from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useTexture,
  Plane,
  Points,
  PointMaterial,
  Stars,
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
      <boxBufferGeometry args={[1, 1.4, 0.02]} /> {/* 앨범 크기 조절 */}
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

  const shootingStars = Array.from({ length: 30 }, () => ({
    initialPosition: [
      THREE.MathUtils.randFloatSpread(10),
      THREE.MathUtils.randFloatSpread(5),
      THREE.MathUtils.randFloatSpread(10),
    ],
    direction: [
      THREE.MathUtils.randFloatSpread(1) * (Math.random() > 0.5 ? 1 : -1),
      -Math.abs(THREE.MathUtils.randFloat(0.2, 0.5)), // 아래로 떨어지는 효과
      THREE.MathUtils.randFloatSpread(0.5),
    ],
  }));

  return (
    <>
      <Header title="" />
      <div className="bg-[#000000] min-h-screen pt-14 pb-24">
        {/* 상단 프로필 정보 */}
        <div className="flex items-center px-4 py-4">
          <img
            src={userProfile.profileImage}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <p className="ml-3 text-lg font-black text-[#FFFFFF]">
            {userProfile.name}님의 소중한 추억들
          </p>
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
            maxDistance={10} // 최대 줌 거리 설정
          />

          {/* 바닥면 추가
          <Plane
            args={[20, 20]}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
          >
            <meshStandardMaterial color="#000000" />
          </Plane> */}

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
