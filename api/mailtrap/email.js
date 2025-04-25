import { mailtrapClient, sender } from "./mailtrap.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipients = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Please verify your email address",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.log("Error sending verification email:", error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipients = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            template_uuid:"a4f23855-bdae-4917-88fe-43540b0c1ac8",
            template_variables: {
                "company_info_name": "Swipieee Dating Website",
                "name": name
            },
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.log("Error sending welcome email:", error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
}

export const sendResetPasswordEmail = async (email, resetURL) => {
    const recipients = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Reset password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Reset Password",
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.log("Error sending reset password email:", error);
        throw new Error(`Error sending reset password email: ${error.message}`);
    }
}

export const sendResetPasswordEmailSuccess = async (email) => {
    const recipients = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Reset Password",
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.log("Error sending reset password success email:", error);
        throw new Error(`Error sending reset password success email: ${error.message}`);
    }
}