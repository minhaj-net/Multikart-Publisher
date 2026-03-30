import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;

  const token = request.cookies.get("uat")?.value;

  const protectedRoutes = [
    "/account/dashboard",
    "/account/notification",
    "/account/wallet",
    "/account/bank-details",
    "/account/point",
    "/account/refund",
    "/account/order",
    "/account/addresses",
    "/wishlist",
    "/compare",
  ];

  // -----------------------------
  // Fetch settings safely
  // -----------------------------
  let settingData = null;

  try {
    const response = await fetch(`${origin}/api/settings`, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (response.ok) {
      settingData = await response.json();
    }
  } catch (error) {
    console.error("Middleware fetch error:", error);
  }

  // -----------------------------
  // Maintenance Mode
  // -----------------------------
  if (
    settingData?.values?.maintenance?.maintenance_mode &&
    path !== "/maintenance"
  ) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  if (
    !settingData?.values?.maintenance?.maintenance_mode &&
    path === "/maintenance"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // -----------------------------
  // Protected Routes
  // -----------------------------
  if (protectedRoutes.includes(path) && !token) {
    const response = NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
    response.cookies.set("showAuthToast", "true", { httpOnly: false });
    return response;
  }

  // -----------------------------
  // Checkout Logic
  // -----------------------------
  if (path === "/checkout" && !token) {
    if (!settingData?.values?.activation?.guest_checkout) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // -----------------------------
  // Auth Redirect Logic
  // -----------------------------
  if (path === "/auth/login" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path === "/auth/otp-verification" && !request.cookies.has("ue")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (
    path === "/auth/update-password" &&
    (!request.cookies.has("uo") || !request.cookies.has("ue"))
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // -----------------------------
  // Default Return (VERY IMPORTANT)
  // -----------------------------
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
