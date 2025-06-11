# feedback-app
### *Create a Next App :*
npx create-next-app@latest

### *Schemas and ZOD for validation :*
- In the src directory, create a models folder which will contain the User and Messages Schema. (For the structuring of the User and Messages)
- In the src directory, create a schemas folder which will contain the *validation schemas* for signUp, signIn, verify, acceptMessages and messages. (ZOD Validation - used for manual validation)

### *Database Connection :*
- In the src directory, create a lib folder which will contain the dbConnect.ts file used for database connection.
- Database Connection : for NextJs, always check if the database is already connected as when using NextJs, connections are made as per the user requests.

### *SignUp using Resend Email:*
- code should effectively handle both scenarios of registering a new user and updating an existing but unverified account with a new password and verification code.
```
IF existingUserByEmail EXISTS THEN
   IF existingUserByEmail.isVerified THEN
      success: false,
   ELSE
      // Save the updated user
   END IF
ELSE
   // Create a new user with provided details
   // Save the new user
END IF
```
*SetUp Resend Email*
- In the lib folder, create a resend.ts file that will contain the connection with Resend.
- Now, create a emails directory, which will contain VerificationEmail.tsx file which will contain the HTML code for email text.
- In the src directory, a helpers folder is created which contains the sendVerificationEmail.ts file having the code required to send a verification email.
- In the src directory, types folder will contain a file named ApiResponse.ts which will contain the structure of api response of messages.
- In the src directory, the app/api/sign-up folder has a route.ts file having the code for signUp route using the above pseudo code.

### *SignIn using NextAuth:* 
*[NextAuth Documentation](https://next-auth.js.org/getting-started/introduction)*
- In the src/app/api directory, create auth/[...nextauth] folder which will contain *options.ts file (code for auth using providers, pages routes, sessions and callbacks (session and jwt))* and route.ts file.
- In the types folder, a file next-auth.d.ts created to modify some data types in next-auth.
- In the src directory, we will have the middleware.ts file.

*[Shadcn Documentation](https://ui.shadcn.com/docs)*
