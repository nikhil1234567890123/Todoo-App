import Constants from "expo-constants"

const LOCAL_API = "http://192.168.1.7:4000"
const PROD_API = "https://your-render-url.onrender.com"

export const API_URL =
  Constants.executionEnvironment === "storeClient"
    ? PROD_API
    : LOCAL_API
