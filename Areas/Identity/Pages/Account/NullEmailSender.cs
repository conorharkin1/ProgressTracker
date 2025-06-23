using Microsoft.AspNetCore.Identity.UI.Services;

public class NullEmailSender : IEmailSender
{
    public Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        // Do nothing - I don't want to send a confirmation email
        return Task.CompletedTask;
    }
}