import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const COMMENTS_FILE = path.join(process.cwd(), "comments.json");

async function readComments() {
  try {
    const data = await fs.readFile(COMMENTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, create it with empty array
    try {
      await fs.writeFile(COMMENTS_FILE, "[]", "utf-8");
    } catch (writeErr) {
      console.error("Failed to write empty comments file:", writeErr);
    }
    return [];
  }
}

async function writeComments(comments) {
  try {
    await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save comments:", err);
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const issueId = searchParams.get("issueId");
  
  const comments = await readComments();
  const filtered = issueId ? comments.filter(c => c.issueId === issueId) : comments;
  
  return NextResponse.json(filtered);
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ error: "Expected application/json request body" }, { status: 415 });
    }

    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { issueId, name, comment } = body;
    if (!issueId || !name || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const comments = await readComments();
    const newComment = {
      id: Date.now().toString(),
      issueId,
      name,
      comment,
      timestamp: new Date().toISOString(),
    };

    comments.push(newComment);
    await writeComments(comments);

    return NextResponse.json(newComment, { status: 201 });
  } catch (err) {
    console.error("Comments POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
