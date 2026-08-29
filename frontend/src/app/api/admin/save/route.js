import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, data } = body;

    let filePath;
    let formattedData;

    switch (type) {
      case "issues":
        filePath = path.join(process.cwd(), "src/data/issues.json");
        formattedData = JSON.stringify(data, null, 2);
        break;
      case "translations":
        filePath = path.join(process.cwd(), "src/data/translations.js");
        formattedData = `export const issueTranslations = ${JSON.stringify(data, null, 2)};\n`;
        break;
      case "about":
        filePath = path.join(process.cwd(), "src/data/about.json");
        formattedData = JSON.stringify(data, null, 2);
        break;
      case "team":
        filePath = path.join(process.cwd(), "src/data/team.json");
        formattedData = JSON.stringify(data, null, 2);
        break;
      case "contact":
        filePath = path.join(process.cwd(), "src/data/contact.json");
        formattedData = JSON.stringify(data, null, 2);
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    await fs.writeFile(filePath, formattedData, "utf8");
    return NextResponse.json({ success: true, message: `${type} saved successfully` });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
