namespace FamilyHealthTracker.Api.Options;

public class OtpOptions
{
    public const string SectionName = "Otp";

    public int TtlMinutes { get; set; } = 5;
    public string HashSecret { get; set; } = string.Empty;
}