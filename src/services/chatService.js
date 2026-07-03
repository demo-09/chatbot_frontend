import API from "../api/axios";

const chatService = {
  async getRoasts() {
    const response = await API.get("/posts");
    return response.data.posts || [];
  },

  async roastImage(imageBase64) {
    if (!imageBase64) {
      throw new Error("Please upload an image to be roasted.");
    }

    // Call backend POST /posts
    const response = await API.post("/posts", {
      image: imageBase64
    });

    return response.data;
  }
};

export default chatService;
