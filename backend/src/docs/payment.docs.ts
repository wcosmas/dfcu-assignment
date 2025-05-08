/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API endpoints for payment processing
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TransactionStatus:
 *       type: string
 *       enum: [PENDING, SUCCESSFUL, FAILED]
 *       description: Status of a payment transaction
 */

/**
 * @swagger
 * /api/payments/initiate:
 *   post:
 *     summary: Initiate a payment transaction
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payer
 *               - payee
 *               - amount
 *               - currency
 *             properties:
 *               payer:
 *                 type: string
 *                 description: 10-digit account number of sender
 *                 pattern: '^\d{10}$'
 *               payee:
 *                 type: string
 *                 description: 10-digit account number of recipient
 *                 pattern: '^\d{10}$'
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Payment amount (must be positive)
 *               currency:
 *                 type: string
 *                 description: Currency code (ISO)
 *                 example: "USD"
 *               payerReference:
 *                 type: string
 *                 description: Optional narration provided by the sending party
 *             example:
 *               payer: "1234567890"
 *               payee: "0987654321"
 *               amount: 150.75
 *               currency: "USD"
 *               payerReference: "Monthly rent payment"
 *     responses:
 *       200:
 *         description: Payment processed with status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionReference:
 *                   type: string
 *                   description: Unique transaction reference
 *                   example: "TRX-1625097600123-abc123"
 *                 status:
 *                   $ref: '#/components/schemas/TransactionStatus'
 *                 statusCode:
 *                   type: integer
 *                   enum: [100, 200, 400]
 *                   description: Status code (100 for PENDING, 200 for SUCCESSFUL, 400 for FAILED)
 *                 message:
 *                   type: string
 *                   description: Status message
 *                   example: "Transaction successfully processed"
 *       400:
 *         description: Bad request - Invalid input parameters
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/payments/status/{transactionReference}:
 *   get:
 *     summary: Get the status of a payment transaction
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionReference
 *         required: true
 *         description: Unique transaction reference from payment initiation
 *         schema:
 *           type: string
 *         example: "TRX-1625097600123-abc123"
 *     responses:
 *       200:
 *         description: Transaction status details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionReference:
 *                   type: string
 *                   description: Unique transaction reference
 *                   example: "TRX-1625097600123-abc123"
 *                 status:
 *                   $ref: '#/components/schemas/TransactionStatus'
 *                 statusCode:
 *                   type: integer
 *                   enum: [100, 200, 400]
 *                   description: Status code (100 for PENDING, 200 for SUCCESSFUL, 400 for FAILED)
 *                 message:
 *                   type: string
 *                   description: Status message
 *                   example: "Transaction successfully processed"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Transaction timestamp
 *                   example: "2023-05-01T15:30:45.123Z"
 *       400:
 *         description: Bad request - Invalid transaction reference format
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Not found - Transaction reference not found
 *       500:
 *         description: Server error
 */ 