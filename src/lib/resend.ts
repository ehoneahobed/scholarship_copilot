import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
    if (process.env.NODE_ENV === "development") {
        console.log("--- DEV EMAIL LOG ---");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${html}`);
        console.log("----------------------");
        return { success: true, data: { id: "dev-log-id" } };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: "Scholarship Copilot <notifications@scholarship-copilot.com>",
            to,
            subject,
            html,
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Unexpected Email Error:", err);
        return { success: false, error: err };
    }
}
