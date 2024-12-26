import { apiRequest } from "../utils/apiUtils";
import { requestFcmToken } from "../firebaseConfig";

interface RegisterData {
  email: string;
  nickname: string;
  password: string;
  passwordCheck: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserInfo {
  memberId: number;
  nickname: string;
  img: string;
}

interface EmailCodeData {
  email: string;
  authType: "SIGNUP" | "PASSWORD_CHANGE";
}

interface VerifyCodeData {
  email: string;
  authCode: string;
  authType: "SIGNUP" | "PASSWORD_CHANGE";
}

// 회원가입 요청
export const registerUser = (data: RegisterData) =>
  apiRequest("post", "/auth/join", data);

// 로그인 요청
export const loginUser = async (data: LoginData) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);

  const response = await apiRequest(
    "post",
    "/auth/login",
    formData,
    null,
    { "Content-Type": "multipart/form-data" }
  );

  const token = response.headers?.authorization;
  if (token) {
    const jwtToken = token.replace("Bearer ", "");
    localStorage.setItem("photorize-token", jwtToken);
    return jwtToken;
  }
  return null;
};

// 카카오 로그인
export const loginWithKakao = () => {
  const backendLoginUrl = "https://photorize.co.kr/oauth2/authorize/kakao";
  window.location.href = backendLoginUrl;
};

// FCM 토큰 발급 및 저장
export const issueAndSaveFcmToken = async (jwtToken: string) => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn("알림 권한이 거부되었습니다.");
    return;
  }

  const fcmToken = await requestFcmToken();
  if (!fcmToken) {
    console.error("FCM 토큰 발급 실패");
    return;
  }

  localStorage.setItem("fcmToken", fcmToken);
  await apiRequest("post", "/fcm", { token: fcmToken }, null, {
    Authorization: `Bearer ${jwtToken}`,
  });
};

// 유저 정보 조회
export const getUserInfo = (): Promise<UserInfo> =>
  apiRequest("get", "/members");

// 닉네임 업데이트
export const updateNickname = (nickname: string) =>
  apiRequest("post", "/members/updateNickname", { nickname });

// 닉네임 중복 확인
export const checkNicknameAvailability = (nickname: string) =>
  apiRequest("post", "/members/checkNickname", { nickname });

// 사용자 검색
export const fetchUsers = (keyword: string) =>
  apiRequest("get", "/members/search", null, { keyword });

// 프로필 이미지 업데이트
export const updateProfileImage = (imageFile: File) => {
  const formData = new FormData();
  formData.append("profileImage", imageFile);

  return apiRequest("post", "/members/updateImg", formData, null, {
    "Content-Type": "multipart/form-data",
  });
};

// 인증 코드 생성
export const generateAuthCode = (data: EmailCodeData) =>
  apiRequest("post", "/auth/email/code", data);

// 인증 코드 확인
export const verifyAuthCode = (data: VerifyCodeData) =>
  apiRequest("post", "/auth/email/verifyCode", data);

// FCM 토큰 삭제
export const deleteFcmToken = async () => {
  const fcmToken = localStorage.getItem("fcmToken");
  if (!fcmToken) {
    console.error("FCM 토큰이 없습니다.");
    return false;
  }

  await apiRequest("delete", "/fcm", { token: fcmToken });
  localStorage.removeItem("fcmToken");
  return true;
};
