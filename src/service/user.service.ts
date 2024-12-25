import request from "@/utils/featch.wrapper";

async function updateUserInfo(
  params: {
    firstName: string;
    lastName: string;
    dob: Date | undefined;
    userBio: string | undefined;
    userProfilePicUri: string | undefined;
  },
  token: string | null,
) {
  try {
    return await request.post(`users/userInfo/me`, params, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {
    throw error;
  }
}

export { updateUserInfo };
