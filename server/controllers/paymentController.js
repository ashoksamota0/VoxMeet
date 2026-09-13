// import Razorpay from "razorpay";
// import { sql } from "../config/db.js";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export const createPremiumOrder = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const users = await sql`
//             SELECT name, email, plan
//             FROM users
//             WHERE id = ${userId}
//         `;

//     if (users.length === 0) {
//       return res.status(404).json({
//         error: "User not found",
//       });
//     }

//     if (users[0].plan === "premium") {
//       return res.status(400).json({
//         error: "You are already on the Premium plan",
//       });
//     }

//     const order = await razorpay.orders.create({
//       amount: 49900,
//       currency: "INR",
//       receipt: `voxmeet_${userId}_${Date.now()}`,
//       notes: {
//         userId,
//         plan: "premium",
//       },
//     });

//     res.status(201).json({
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       keyId: process.env.RAZORPAY_KEY_ID,
//       user: {
//         name: users[0].name,
//         email: users[0].email,
//       },
//     });
//   } catch (error) {
//     console.error("createPremiumOrder failed:", error);

//     res.status(500).json({
//       error: "Failed to create payment order",
//     });
//   }
// };

// import Razorpay from "razorpay";
// import { sql } from "../config/db.js";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export const createPremiumOrder = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const users = await sql`
//       SELECT name, email, plan
//       FROM users
//       WHERE id = ${userId}
//     `;

//     if (users.length === 0) {
//       return res.status(404).json({
//         error: "User not found",
//       });
//     }

//     if (users[0].plan === "premium") {
//       return res.status(400).json({
//         error: "You are already on the Premium plan",
//       });
//     }

//     const order = await razorpay.orders.create({
//       amount: 49900,
//       currency: "INR",
//       receipt: `vm_${Date.now()}`,
//       notes: {
//         userId,
//         plan: "premium",
//       },
//     });

//     res.status(201).json({
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       keyId: process.env.RAZORPAY_KEY_ID,
//       user: {
//         name: users[0].name,
//         email: users[0].email,
//       },
//     });
//   } catch (error) {
//     console.error("createPremiumOrder failed:", error);

//     res.status(500).json({
//       error: "Failed to create payment order",
//     });
//   }
// };

import crypto from "crypto";
import Razorpay from "razorpay";
import { sql } from "../config/db.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Premium order
export const createPremiumOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const users = await sql`
      SELECT name, email, plan
      FROM users
      WHERE id = ${userId}
    `;

    if (users.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (users[0].plan === "premium") {
      return res.status(400).json({
        error: "You are already on the Premium plan",
      });
    }

    const order = await razorpay.orders.create({
      amount: 49900,
      currency: "INR",
      receipt: `vm_${Date.now()}`,
      notes: {
        userId,
        plan: "premium",
      },
    });

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      user: {
        name: users[0].name,
        email: users[0].email,
      },
    });
  } catch (error) {
    console.error("createPremiumOrder failed:", error);

    res.status(500).json({
      error: "Failed to create payment order",
    });
  }
};

// Verify Premium payment
export const verifyPremiumPayment = async (req, res) => {
  try {
    const userId = req.user.id;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: "Incomplete payment verification details",
      });
    }

    // Create signature using the server-side secret
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Compare generated signature with Razorpay signature
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        error: "Payment verification failed",
      });
    }

    // Verify that this order belongs to the authenticated user
    const order = await razorpay.orders.fetch(razorpay_order_id);

    if (order.notes?.userId !== userId) {
      return res.status(403).json({
        error: "Payment order does not belong to this user",
      });
    }

    // Verify the expected Premium amount and currency
    if (Number(order.amount) !== 49900 || order.currency !== "INR") {
      return res.status(400).json({
        error: "Invalid payment order",
      });
    }

    // Activate Premium plan
    await sql`
      UPDATE users
      SET plan = 'premium',
          updated_at = NOW()
      WHERE id = ${userId}
    `;

    res.json({
      success: true,
      message: "Premium plan activated successfully",
      plan: "premium",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error("verifyPremiumPayment failed:", error);

    res.status(500).json({
      error: "Failed to verify payment",
    });
  }
};
