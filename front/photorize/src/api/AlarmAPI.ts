import axios from "./axiosConfig";

export const fetchAlarms = async (pageNumber = 0) => {
  try {
    const response = await axios.get(`/alarms`, {
      params: { pageNumber },
    });

    if (response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error("알람 리스트 조회 중 오류 발생:", error);
    throw error;
  }
};

export const updateAlarmStatus = async (alarmId: number, accepted: boolean) => {
  try {
    const response = await axios.post(`/alarms/${alarmId}`, {
      params: { accepted }, // accepted 상태를 true 또는 false로 전달
    });

    if (response.status === 200) {
      return response; // accepted 여부 반환
    }
  } catch (error) {
    console.error("알람 상태 업데이트 중 오류 발생:", error);
    throw error;
  }
};
