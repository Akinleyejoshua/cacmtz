import { NextResponse } from "next/server";
import { getProjects, createProject } from "../../services/outreach";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, images, videoUrls, amount, currency, status, order } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const project = await createProject({
      title,
      description,
      images: Array.isArray(images) ? images : [],
      videoUrls: Array.isArray(videoUrls) ? videoUrls : [],
      amount: typeof amount === "number" ? amount : null,
      currency: currency || "NGN",
      status: status || "Active",
      order: typeof order === "number" ? order : 0,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
