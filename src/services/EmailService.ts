export class EmailService {
    async sendPasswordResetEmail(
        email: string,
        resetToken: string
    ): Promise<void> {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // TODO: Replace with actual email sending
        console.log('='.repeat(50));
        console.log('PASSWORD RESET EMAIL');
        console.log('='.repeat(50));
        console.log(`To: ${email}`);
        console.log(`Reset URL: ${resetUrl}`);
        console.log('='.repeat(50));
    }
}