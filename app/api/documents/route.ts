import { getDocuments } from "@/lib/services/document/getDocuments";
import { createDocument } from "@/lib/services/document/createDocument";
import { documentCreateSchema } from "@/lib/validations/documentValidations";
import z from "zod";

export async function GET() {
  try {
    const documents = await getDocuments();

    return Response.json(documents);
  } catch (error) {
    console.error("GET documents error:", error);

    return Response.json(
      { message: "Failed to fetch documents" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const process = documentCreateSchema.safeParse(body);

    if (!process.success) {
      return Response.json({ message: process.error.issues }, { status: 400 });
    }

    // Add missing fields: file_name, file_size, mime_type
    const document = await createDocument({
      ...process.data,
      file_name: body.file_name,
      file_size: body.file_size,
      mime_type: body.mime_type,
    });

    return Response.json(
      {
        message: "Document created successfully",
        data: document,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("ERROR:", error);

    if (error instanceof z.ZodError) {
      return Response.json({ message: error.issues }, { status: 400 });
    }

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
