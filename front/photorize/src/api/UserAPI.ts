import axios from "./axiosConfig";
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

export const registerUser = async (data: RegisterData) => {
  try {
    const response = await axios.post("/auth/join", data);
    if (response.status === 200 || response.status === 201) {
      return response.data || { status: 201 };
    }
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);
    throw error; // 에러 발생 시 예외 처리
  }
};

export const loginUser = async (data: LoginData) => {
  try {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const response = await axios.post("/auth/login", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const token = response.headers["authorization"];
    if (token) {
      const jwtToken = token.replace("Bearer ", "");
      localStorage.setItem("photorize-token", jwtToken);

      // 로그인 후 바로 홈으로 이동하게 하고, FCM 토큰 발급은 비동기로 처리
      setTimeout(() => issueAndSaveFcmToken(jwtToken), 0); // 비동기 처리

      return jwtToken;
    } else {
      return null;
    }
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    throw error;
  }
};

export const loginWithKakao = async (): Promise<void> => {
  try {
    const axiosInstance = axios.create({
      baseURL: "https://photorize.co.kr",
    });
    const response = await axiosInstance.get("/oauth2/authorize/kakao");

    if (response.status === 200) {
      console.log("카카오 로그인 요청 성공");

      const cookies = document.cookie.split("; ");
      const accessTokenCookie = cookies.find((cookie) =>
        cookie.startsWith("access_token=")
      );

      if (accessTokenCookie) {
        const accessToken = accessTokenCookie.split("=")[1];
        localStorage.setItem("photorize-token", accessToken);
        console.log("카카오 로그인 성공, 토큰 저장:", accessToken);
      } else {
        console.error("access_token 쿠키를 찾을 수 없습니다.");
      }
    }
  } catch (error) {
    console.error("카카오 로그인 요청 중 오류 발생:", error);
    throw error;
  }
};

// FCM 토큰 발급 및 서버 저장 함수
const issueAndSaveFcmToken = async (jwtToken: string) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const fcmToken = await requestFcmToken();
      if (fcmToken) {
        console.log("FCM 토큰 발급 성공:", fcmToken);
        localStorage.setItem("fcmToken", fcmToken);
        await axios.post(
          "/fcm",
          { token: fcmToken },
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );
      } else {
        console.error("FCM 토큰 발급 실패");
        console.log(fcmToken);
      }
    } else {
      console.log("알림 권한이 거부되었습니다.");
    }
  } catch (error) {
    console.error("FCM 토큰 발급 및 저장 중 오류:", error);
  }
};

export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await axios.get("/members");
    return response.data.data;
  } catch (error) {
    console.error("유저 정보 조회 중 오류 발생:", error);
    throw error;
  }
};

export const updateNickname = async (nickname: string) => {
  try {
    const response = await axios.post("/members/updateNickname", { nickname });
    if (response.status === 200) {
      return response.data.dat;
    }
  } catch (error) {
    console.error("닉네임 업데이트 중 오류 발생:", error);
    throw error;
  }
};

export const checkNicknameAvailability = async (nickname: string) => {
  try {
    const response = await axios.post("/members/checkNickname", { nickname });

    return response.data.data;
  } catch (error) {
    console.error("닉네임 중복 체크 중 오류 발생:", error);
    throw error;
  }
};

export const fetchUsers = async (keyword: string) => {
  try {
    const response = await axios.get("/members/search", {
      params: { keyword },
    });

    console.log(response.data);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("유저 전체 조회 중 오류 발생:", error);
    throw error;
  }
};

export const updateProfileImage = async (imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", imageFile);

    const response = await axios.post("/members/updateImg", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      return response.data.data.img;
    }
  } catch (error) {
    console.error("프로필 이미지 업데이트 중 오류 발생:", error);
    throw error;
  }
};

export const generateAuthCode = async (data: EmailCodeData) => {
  try {
    const response = await axios.post("/auth/email/code", data);
    if (response.status === 200) {
      return response.data.data; // true 반환
    }
  } catch (error) {
    console.error("인증번호 생성 중 오류 발생:", error);
    throw error;
  }
};

export const verifyAuthCode = async (data: VerifyCodeData) => {
  try {
    const response = await axios.post("/auth/email/verifyCode", data);
    if (response.status === 200) {
      return response.data.data; // true 반환
    }
  } catch (error) {
    console.error("인증번호 검증 중 오류 발생:", error);
    throw error;
  }
};

export const deleteFcmToken = async () => {
  try {
    const fcmToken = localStorage.getItem("fcmToken");
    if (!fcmToken) {
      console.error("FCM 토큰이 없습니다.");
      return false;
    }

    const response = await axios.delete("/fcm", {
      data: { token: fcmToken }, // FCM 토큰을 body로 전달
    });

    if (response.status === 200) {
      console.log("FCM 토큰이 삭제되었습니다.");
      localStorage.removeItem("fcmToken"); // 로컬스토리지에서 FCM 토큰 삭제
      return true;
    }
  } catch (error) {
    console.error("FCM 토큰 삭제 중 오류 발생:", error);
    throw error;
  }
};
