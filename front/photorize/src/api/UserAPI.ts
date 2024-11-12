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
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const token = response.headers["authorization"];
    if (token) {
      const jwtToken = token.replace("Bearer ", "");
      localStorage.setItem("token", jwtToken);

      // 로그인 후 FCM 토큰 발급 및 서버에 저장
      await requestFcmToken(async (fcmToken) => {
        if (fcmToken) {
          console.log("FCM 토큰 발급 성공:", fcmToken);

          // 서버에 FCM 토큰 저장 요청 (POST 방식, body에 token 포함)
          await axios.post(
            "/fcm",
            { token: fcmToken },
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
        }
      });

      return jwtToken;
    } else {
      return null;
    }
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    throw error;
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
      return response.data.data;
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
