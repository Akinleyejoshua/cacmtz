import { NextResponse } from "next/server";
import { getAccounts, createAccount } from "../../services/outreach";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const accounts = await getAccounts();
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bank, name, accountNumber, type, logo, accepts, order } = body;

    if (!bank || !name || !accountNumber) {
      return NextResponse.json(
        { error: "Bank, name, and account number are required" },
        { status: 400 }
      );
    }

    const account = await createAccount({
      bank,
      name,
      accountNumber,
      type: type || "Current",
      logo: logo || "/src/img/donations/abank.png",
      accepts: Array.isArray(accepts) ? accepts : ["General offering"],
      order: typeof order === "number" ? order : 0,
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("Error creating bank account:", error);
    return NextResponse.json(
      { error: "Failed to create bank account" },
      { status: 500 }
    );
  }
}
