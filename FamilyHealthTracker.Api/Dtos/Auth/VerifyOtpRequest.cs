namespace FamilyHealthTracker.Api.Dtos.Auth;

public record VerifyOtpRequest(string Email, string Otp);