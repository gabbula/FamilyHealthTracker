using FamilyHealthTracker.Api.Options;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace FamilyHealthTracker.Api.Services;

public interface IEmailSender
{
    Task SendOtpAsync(string toEmail, string otp, CancellationToken cancellationToken);
}

public class SendGridEmailSender : IEmailSender
{
    private readonly SendGridOptions _options;
    private readonly ILogger<SendGridEmailSender> _logger;

    public SendGridEmailSender(IOptions<SendGridOptions> options, ILogger<SendGridEmailSender> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public async Task SendOtpAsync(string toEmail, string otp, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey) || string.IsNullOrWhiteSpace(_options.OtpTemplateId))
        {
            _logger.LogWarning("SendGrid not configured. Skipping OTP email.");
            return;
        }

        var client = new SendGridClient(_options.ApiKey);
        var from = new EmailAddress(_options.FromEmail, _options.FromName);
        var to = new EmailAddress(toEmail);

        var msg = MailHelper.CreateSingleTemplateEmail(from, to, _options.OtpTemplateId, new { otp });
        var response = await client.SendEmailAsync(msg, cancellationToken);

        if ((int)response.StatusCode >= 400)
        {
            _logger.LogWarning("SendGrid responded with status {StatusCode}", response.StatusCode);
        }
    }
}