import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const formData: FormData = await req.formData();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Invalid file received." }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
  console.log("File received: ", file);

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + file.name.replaceAll(" ", "_");
  console.log(filename);
  try {
    await writeFile(
      path.join(process.cwd(), "public/uploads/" + filename),
      new Uint8Array(buffer)
    );
    return NextResponse.json({ Message: "Success" , UploadedFileName: filename, status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};