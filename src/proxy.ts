export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: ["/forms/:path*", "/api/forms/:path*", "/api/fields/:path*", "/api/submissions/:path*"],
};
