import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
    await dbConnect();

  try {
    const {searchParams} = new URL(req.url);
    const queryParams = {username: searchParams.get("username")};
    const result = UsernameQuerySchema.safeParse(queryParams);
    if(!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json({message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters", success: false}, {status: 400});
    }

    const {username} = result.data;

    const existingVerifiedUser = await UserModel.findOne({username, isVerified: true});

    if (existingVerifiedUser) {
      return Response.json(
        { message: "Username already exists", success: false },
        { status: 400 }
      );
    }
    return Response.json({ message: "Username is available", success: true }, { status: 200 });

  } catch (error) {
    console.log("Error checking username", error);
    return Response.json(
      { message: "Error checking username", success: false },
      { status: 500 }
    );
  }
}
