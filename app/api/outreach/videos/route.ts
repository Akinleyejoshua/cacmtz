import { NextResponse } from "next/server";
import { getVideos, createVideo } from "../../services/outreach";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const videos = await getVideos();
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, youtubeUrl, youtubeUrls, order } = body;

    const urls = Array.isArray(youtubeUrls)
      ? youtubeUrls.filter(Boolean)
      : youtubeUrl
      ? [youtubeUrl]
      : [];

    if (!title || urls.length === 0) {
      return NextResponse.json(
        { error: "Title and at least one YouTube URL are required" },
        { status: 400 }
      );
    }

    const video = await createVideo({
      title,
      description: description || "",
      youtubeUrl: urls[0],
      youtubeUrls: urls,
      order: typeof order === "number" ? order : 0,
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
