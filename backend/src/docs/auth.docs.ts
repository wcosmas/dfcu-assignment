/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and get tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's unique username
 *               password:
 *                 type: string
 *                 description: User's password
 *             example:
 *               username: "johndoe"
 *               password: "Password123!"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: User's unique identifier
 *                 username:
 *                   type: string
 *                   description: User's username
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *                 accessTokenExpiresIn:
 *                   type: number
 *                   description: Access token expiry time in seconds
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account locked or inactive
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Valid refresh token obtained during login
 *             example:
 *               refreshToken: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
 *     responses:
 *       200:
 *         description: Successfully refreshed tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: New JWT refresh token
 *                 accessTokenExpiresIn:
 *                   type: number
 *                   description: Access token expiry time in seconds
 *       401:
 *         description: Unauthorized - Invalid or expired refresh token
 *       403:
 *         description: Forbidden - Refresh token blacklisted or revoked
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user by invalidating refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Current refresh token to be invalidated
 *             example:
 *               refreshToken: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       400:
 *         description: Bad request - Missing refresh token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (optional)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - fullName
 *               - accountNumber
 *             properties:
 *               username:
 *                 type: string
 *                 description: Desired unique username
 *               password:
 *                 type: string
 *                 description: Secure password (must meet complexity requirements)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               fullName:
 *                 type: string
 *                 description: User's full name
 *               accountNumber:
 *                 type: string
 *                 description: User's 10-digit account number
 *                 pattern: '^\d{10}$'
 *             example:
 *               username: "johndoe"
 *               password: "Password123!"
 *               email: "john.doe@example.com"
 *               fullName: "John Doe"
 *               accountNumber: "1234567890"
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: User's unique identifier
 *                 username:
 *                   type: string
 *                   description: User's username
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *       400:
 *         description: Bad request - Validation errors
 *       409:
 *         description: Conflict - Username already exists
 *       500:
 *         description: Server error
 */ 