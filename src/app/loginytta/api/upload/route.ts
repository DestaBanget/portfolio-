import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(req: Request) {
  if (!isAdminAuthenticated()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "misc";

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${folder}/${Date.now()}-${file.name.replace(/\s/g, "-")}`;

  const { error } = await supabaseAdmin.storage
    .from("writeup-images")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const { data } = supabaseAdmin.storage.from("writeup-images").getPublicUrl(filename);

  return Response.json({ url: data.publicUrl });
}
