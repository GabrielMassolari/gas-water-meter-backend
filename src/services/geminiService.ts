import axios from 'axios';

const geminiService = {
  analyzeImage: async (base64Image: string) => {
    const response = await axios.post('https://ai.google.dev/gemini-api/vision', {
      image: base64Image,
      api_key: process.env.GEMINI_API_KEY,
    });

    console.log(response.data)

    return response.data.measure_value;
  },
};

export default geminiService;