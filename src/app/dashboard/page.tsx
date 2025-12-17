"use client";
import { getToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from 'react';

interface JwtPayload {
  sub: number; username: string; role: string; exp: number; iat: number;
}

export default function DashboardHome() {

  const token = getToken();
  let username = 'Guest';

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded.username) {
        username = decoded.username;
      }
    } catch (e) {
      console.error("Token decoding failed:", e);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Welcome, {username}</h2>
      {token && (
        <>
          <p>Your Bearer Token:</p>
          <pre className="p-2 bg-slate-100 text-xs mt-2 break-all">{token}</pre>
        </>
      )}
    </div>
  );
}