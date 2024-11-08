import axios from "./axiosConfig";

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
        "Content-Type": "multipart/form-data", // FormData 전송을 위해 Content-Type 설정
      },
    });

    const token = response.headers["authorization"];
    return token ? token.replace("Bearer ", "") : null; // 토큰 반환
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
