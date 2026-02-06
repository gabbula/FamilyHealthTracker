using System.Security.Cryptography;
using System.Text;
using FamilyHealthTracker.Api.Options;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace FamilyHealthTracker.Api.Services;

public interface IOtpService
{
    Task<string> GenerateAndStoreAsync(Guid userId, CancellationToken cancellationToken);
    Task<bool> ValidateAsync(Guid userId, string otp, CancellationToken cancellationToken);
}

public class OtpService : IOtpService
{
    private readonly IDatabase _db;
    private readonly OtpOptions _options;

    public OtpService(IConnectionMultiplexer redis, IOptions<OtpOptions> options)
    {
        _db = redis.GetDatabase();
        _options = options.Value;
    }

    public async Task<string> GenerateAndStoreAsync(Guid userId, CancellationToken cancellationToken)
    {
        var otp = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
        var hash = HashOtp(otp);
        var key = GetKey(userId);
        await _db.StringSetAsync(key, hash, TimeSpan.FromMinutes(_options.TtlMinutes));
        return otp;
    }

    public async Task<bool> ValidateAsync(Guid userId, string otp, CancellationToken cancellationToken)
    {
        var key = GetKey(userId);
        var storedHash = await _db.StringGetAsync(key);
        if (!storedHash.HasValue)
        {
            return false;
        }

        var matches = storedHash == HashOtp(otp);
        if (matches)
        {
            await _db.KeyDeleteAsync(key);
        }

        return matches;
    }

    private string GetKey(Guid userId) => $"otp:{userId}";

    private string HashOtp(string otp)
    {
        using var sha = SHA256.Create();
        var input = Encoding.UTF8.GetBytes($"{_options.HashSecret}:{otp}");
        return Convert.ToHexString(sha.ComputeHash(input));
    }
}