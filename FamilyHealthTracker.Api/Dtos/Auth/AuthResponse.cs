namespace FamilyHealthTracker.Api.Dtos.Auth;

public record AuthResponse(string Token, DateTimeOffset ExpiresAt);