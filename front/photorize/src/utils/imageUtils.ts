export const toBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string); // 명시적으로 string으로 타입 캐스팅
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Base64 변환 중 오류 발생:", error);
    throw error; // 에러가 발생하면 명시적으로 던짐
  }
};
