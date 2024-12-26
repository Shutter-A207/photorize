import { apiRequest } from "../utils/apiUtils";

export const fetchAlarms = (pageNumber = 0) =>
  apiRequest("get", "/alarms", null, { pageNumber });

export const updateAlarmStatus = (alarmId: number, accepted: boolean) =>
  apiRequest("post", `/alarms/${alarmId}`, { accepted });

export const fetchAlarmDetail = (alarmId: number) =>
  apiRequest("get", `/alarms/${alarmId}/detail`);

export const resendAlarm = (albumId: number, memberId: number) =>
  apiRequest("post", "/alarms/resend", { albumId, memberId });