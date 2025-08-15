import cloudinary from "cloudinary";

// Configure Cloudinary with your server-side credentials
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { publicId } = JSON.parse(req.body);

    if (!publicId) {
      return res.status(400).json({ error: "Missing publicId" });
    }

    const result = await cloudinary.v2.uploader.destroy(publicId);
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return res.status(500).json({ error: "Failed to delete file from Cloudinary" });
  }
}