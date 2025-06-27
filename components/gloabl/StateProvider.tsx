"use client";
import { Provider } from "react-redux";
import store from "@/store/store";

export default function StateProvider({ children }: { children: React.ReactNode }) {

  // You can optionally show loading or pass user via context

  return  <Provider store={store} >
        {children}
        </Provider>;
}
