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

async function login(params: { userEmail: string; userPassword: string }) {
  try {
    return await request.post(`auth/login`, params);
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

async function frogotPassword(email: string) {
  try {
    return await request.get(`auth/resetPassword?email=${email}`);
  } catch (error) {
    throw error;
  }
}

async function resetPassword(password: string) {
  try {
    return await request.post(`auth/forgotPassword`, { password });
  } catch (error) {
    throw error;
  }
}

async function verifyGoogle(code: string) {
  try {
    return await request.get(`auth/verify/google?code=${code}`);
  } catch (error) {
    throw error;
  }
}

export {
  checkUserNameAvailablity,
  signup,
  verifyOtp,
  resendOtp,
  login,
  frogotPassword,
  resetPassword,
  verifyGoogle,
};
