namespace FamilyHealthTracker.Api.Options;

public class SendGridOptions
{
    public const string SectionName = "SendGrid";

    public string ApiKey { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
    public string FromName { get; set; } = "Family Health Tracker";
    public string OtpTemplateId { get; set; } = string.Empty;
}