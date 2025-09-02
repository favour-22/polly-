import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import useAuth from "../useAuth";
import React from "react";

function wrapperWithContext(ctxValue: any) {
  return ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
}

describe("useAuth", () => {
  it("returns context values", () => {
    const mockSignOut = vi.fn();
    const ctxValue = { user: { email: "test@example.com" }, loading: false, signOut: mockSignOut };
    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapperWithContext(ctxValue),
    });
    expect(result.current.user.email).toBe("test@example.com");
    expect(result.current.loading).toBe(false);
    result.current.signOut();
    expect(mockSignOut).toHaveBeenCalled();
  });

  it("throws if used outside provider", () => {
    // @ts-expect-error
    const { result } = renderHook(() => useAuth());
    expect(result.error).toBeDefined();
  });
});
