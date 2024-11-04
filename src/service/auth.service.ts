import request from "@/utils/featch.wrapper";

async function checkUserNameAvailablity(username: string) {
  try {
    return await request.get(`auth/exists/${username}`);
  } catch (error) {
    throw error;
  }
}

async function signup(params: {
  userName: string;
  userEmail: string;
  userPassword: string;
}) {
  try {
    return await request.post(`auth/signUp`, params);
  } catch (error) {
    throw error;
  }
}

async function verifyOtp(
  body: { userEmail: string; otpValue: string },
  token: string | null,
) {
  try {
    return await request.post(`auth/verifyOtp`, body, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {
    throw error;
  }
}

async function resendOtp(token: string | null) {
  try {
    return await request.post(`auth/generateOtp`, null, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {
    throw error;
  }
}

export { checkUserNameAvailablity, signup, verifyOtp, resendOtp };
