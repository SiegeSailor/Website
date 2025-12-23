import { NextResponse } from "next/server";

export async function GET() {
  const healthStatus = {
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(healthStatus, { status: 200 });
}
