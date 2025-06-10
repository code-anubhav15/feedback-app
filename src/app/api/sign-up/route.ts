import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { message: "Username already exists", success: false },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });
    const verifyCode = Math.floor(Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if(existingUserByEmail.isVerified) {
        return Response.json(
          { message: "Email already exists", success: false },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;
        await existingUserByEmail.save();
      }
      
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if(!emailResponse.success){
      return Response.json(
        { message: "Error sending verification email", success: false },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "User registered successfully. Please verify your email.", success: true },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error connecting to database", error);
    return Response.json(
      { message: "Error connecting to database", success: false },
      { status: 500 }
    );
  }
}
