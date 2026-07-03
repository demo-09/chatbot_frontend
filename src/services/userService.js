// Service to handle user profile options (Simulated locally since backend doesn't support profile modifications)
const userService = {
  async updateProfile(userId, updateData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Save simulated changes in local storage
        const currentProfile = JSON.parse(localStorage.getItem(`profile_update_${userId}`)) || {};
        const newProfile = { ...currentProfile, ...updateData };
        localStorage.setItem(`profile_update_${userId}`, JSON.stringify(newProfile));
        
        resolve({
          success: true,
          message: "Profile updated successfully (Simulated)",
          user: newProfile
        });
      }, 800);
    });
  },

  async changePassword(userId, currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentPassword || !newPassword) {
          reject(new Error("Both current and new passwords are required"));
          return;
        }
        resolve({
          success: true,
          message: "Password updated successfully (Simulated)"
        });
      }, 1000);
    });
  },

  // Helper to fetch merged user profile (backend details + local updates)
  getMergedProfile(userId, backendUser) {
    if (!userId) return backendUser;
    const localUpdate = JSON.parse(localStorage.getItem(`profile_update_${userId}`));
    if (localUpdate) {
      return { ...backendUser, ...localUpdate };
    }
    return backendUser;
  }
};

export default userService;
