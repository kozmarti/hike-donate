import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Email and password required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hike");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      verified: false,
      createdAt: new Date(),
    });

    // Create a verification token (expires in 1 day)
    const token = jwt.sign(
      { userId: result.insertedId, email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const verifyUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify?token=${token}`;
    console.log("Verify URL:", verifyUrl);
    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Hike&Donate" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `
       <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
<div style="text-align:center;">
      <img src="cid:hike-and-donate" alt="Hike&Donate" style="max-width:600px; display:block; margin:0 auto;" />
    </div>
        
        <div style="padding: 30px; color: #333333;">
          <h2 style="text-align: center; color: #111827;">Welcome to Hike&Donate!</h2>
          <p style="text-align: center; font-size: 16px; line-height: 1.6;">
            Thank you for signing up. Please verify your email address to activate your account and start tracking hikes.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" 
               style="background-color: #FF6078; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Verify Email
            </a>
          </div>
          
          <p style="text-align: center; font-size: 14px; color: #6b7280;">
            If you did not sign up for this account, you can safely ignore this email.
          </p>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
          &copy; ${new Date().getFullYear()} Hike&Donate. All rights reserved.
        </div>
      </div>
    </div>
  `,
  attachments: [
    {
      filename: "hike-and-donate.png",
      path: "/hike-and-donate.png",
      cid: "hike-and-donate",
    },
  ],
    });

    return new Response(JSON.stringify({ message: "Check your email to verify your account." }), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
