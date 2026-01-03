// const cookieToken = async (user, res) => {

//     const accessToken = await user.generateAccessToken()
//     const refreshToken = await user.generateRefreshToken()

//     user.refreshToken = refreshToken;

//     return res.status(201)
//         .json({
//             success: true,
//             message: `User created`,
//             user, accessToken, refreshToken
//         })
// }

// export { cookieToken }


const cookieToken = async (user, res, message = "User created") => {

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken;
    await user.save(); // Save the refresh token to database
    const isProduction = process.env.NODE_ENV === "production";

    const options = {
        httpOnly: true,
        secure: isProduction,  // Only secure in production
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in milliseconds
        sameSite: isProduction ? "none" : "lax" // "none" needed for Vercel<->Render
    }

    return res.status(isProduction ? 201 : 200)  // 200 for development, 201 for production
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            message,
            user, accessToken, refreshToken
        })
}

export { cookieToken }