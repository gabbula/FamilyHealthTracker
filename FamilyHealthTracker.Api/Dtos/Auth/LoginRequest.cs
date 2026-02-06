namespace FamilyHealthTracker.Api.Dtos.Auth;

public record LoginRequest(string Email, string Password, string? InternetIdentityToken);