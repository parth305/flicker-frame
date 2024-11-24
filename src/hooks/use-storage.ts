interface UserData {
  userEmail: string;
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  profilePicture?: string; // Optional
}

export function getStorageData() {
  // Retrieve the data from localStorage or sessionStorage
  const userDataFromStorage =
    localStorage.getItem("userData") || sessionStorage.getItem("userData");
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  // Parse the user data if available
  const userData: UserData | null = userDataFromStorage
    ? JSON.parse(userDataFromStorage)
    : null;

  // If the data is not in storage, you can return null or default values (e.g., userData = {}).
  return { userData, token };
}
