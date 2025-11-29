// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface TokenStore {
//   access_token: string | null;
//   setAccessToken: (token: string | null) => void;
//   clearAccessToken: () => void;
// }

// export const useTokenStore = create<TokenStore>()(
//   persist(
//     (set) => ({
//       access_token: null,
//       setAccessToken: (token) => set({ access_token: token }),
//       clearAccessToken: () => set({ access_token: null }),
//     }),
//     {
//       name: "auth-token",
//     }
//   )
// );
