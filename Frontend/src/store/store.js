import { configureStore } from "@reduxjs/toolkit"
import authslice from "./authSlice"

const store = new configureStore({
  reducer: {
    auth: authslice
  }
})

export default store