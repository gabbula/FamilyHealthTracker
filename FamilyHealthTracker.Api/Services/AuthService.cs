using FamilyHealthTracker.Api.Data;
using FamilyHealthTracker.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FamilyHealthTracker.Api.Services;

public interface IAuthService
{
    Task<UserAccount> RegisterAsync(string email, string password, string? fullName, CancellationToken cancellationToken);
    Task<UserAccount?> ValidateCredentialsAsync(string email, string password, string? internetIdentityToken, CancellationToken cancellationToken);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly PasswordHasher<UserAccount> _hasher;
    private readonly IInternetIdentityVerifier _internetIdentity;

    public AuthService(AppDbContext db, IInternetIdentityVerifier internetIdentity)
    {
        _db = db;
        _internetIdentity = internetIdentity;
        _hasher = new PasswordHasher<UserAccount>();
    }

    public async Task<UserAccount> RegisterAsync(string email, string password, string? fullName, CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        if (await _db.UserAccounts.AnyAsync(x => x.Email == normalizedEmail, cancellationToken))
        {
            throw new InvalidOperationException("Email already registered.");
        }

        var user = new UserAccount
        {
            Id = Guid.NewGuid(),
            Email = normalizedEmail,
            FullName = fullName
        };

        user.PasswordHash = _hasher.HashPassword(user, password);

        var preference = new UserPreference
        {
            Id = Guid.NewGuid(),
            UserAccountId = user.Id,
            UnitSystem = UnitSystem.Metric
        };

        _db.UserAccounts.Add(user);
        _db.UserPreferences.Add(preference);
        await _db.SaveChangesAsync(cancellationToken);

        return user;
    }

    public async Task<UserAccount?> ValidateCredentialsAsync(string email, string password, string? internetIdentityToken, CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var user = await _db.UserAccounts.FirstOrDefaultAsync(x => x.Email == normalizedEmail, cancellationToken);
        if (user is null)
        {
            return null;
        }

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, password);
        if (result == PasswordVerificationResult.Failed)
        {
            return null;
        }

        var internetIdentityValid = await _internetIdentity.VerifyAsync(internetIdentityToken, cancellationToken);
        return internetIdentityValid ? user : null;
    }
}