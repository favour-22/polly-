// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import AuthForm from "../AuthForm";
// import { vi } from "vitest";

// // Mock next/navigation
// vi.mock("next/navigation", () => ({
//   useRouter: () => ({ push: vi.fn() }),
//   useSearchParams: () => ({ get: vi.fn(() => null) }),
// }));

// // Mock supabase
// const signInWithPassword = vi.fn();
// const signUp = vi.fn();
// vi.mock("@/lib/supabase", () => ({
//   supabase: {
//     auth: {
//       signInWithPassword,
//       signUp,
//     },
//   },
// }));

// describe("AuthForm", () => {
//   beforeEach(() => {
//     signInWithPassword.mockReset();
//     signUp.mockReset();
//   });

//   it("renders login form and submits successfully", async () => {
//     signInWithPassword.mockResolvedValue({ error: null });
//     render(<AuthForm mode="login" />);
//     fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: "test@example.com" } });
//     fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });
//     fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
//     await waitFor(() => {
//       expect(signInWithPassword).toHaveBeenCalledWith({ email: "test@example.com", password: "password123" });
//     });
//   });

//   it("shows error on login failure", async () => {
//     signInWithPassword.mockResolvedValue({ error: { message: "Invalid credentials" } });
//     render(<AuthForm mode="login" />);
//     fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: "fail@example.com" } });
//     fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "wrongpass" } });
//     fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
//     await waitFor(() => {
//       expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
//     });
//   });

//   it("renders register form and submits successfully", async () => {
//     signUp.mockResolvedValue({ error: null });
//     render(<AuthForm mode="register" />);
//     fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: "new@example.com" } });
//     fireEvent.change(screen.getAllByPlaceholderText(/password/i)[0], { target: { value: "newpass123" } });
//     fireEvent.change(screen.getByPlaceholderText(/repeat password/i), { target: { value: "newpass123" } });
//     fireEvent.click(screen.getByRole("button", { name: /create account/i }));
//     await waitFor(() => {
//       expect(signUp).toHaveBeenCalledWith({ email: "new@example.com", password: "newpass123" });
//     });
//   });

//   it("shows error if passwords do not match on register", async () => {
//     render(<AuthForm mode="register" />);
//     fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: "new@example.com" } });
//     fireEvent.change(screen.getAllByPlaceholderText(/password/i)[0], { target: { value: "newpass123" } });
//     fireEvent.change(screen.getByPlaceholderText(/repeat password/i), { target: { value: "different" } });
//     fireEvent.click(screen.getByRole("button", { name: /create account/i }));
//     await waitFor(() => {
//       expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
//     });
//   });
// });
