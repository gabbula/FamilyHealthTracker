namespace FamilyHealthTracker.Api.Services;

public interface IInternetIdentityVerifier
{
    Task<bool> VerifyAsync(string? token, CancellationToken cancellationToken);
}

public class InternetIdentityVerifier : IInternetIdentityVerifier
{
    private readonly ILogger<InternetIdentityVerifier> _logger;

    public InternetIdentityVerifier(ILogger<InternetIdentityVerifier> logger)
    {
        _logger = logger;
    }

    public Task<bool> VerifyAsync(string? token, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            _logger.LogInformation("Internet Identity token missing. Using placeholder verifier.");
            return Task.FromResult(true);
        }

        _logger.LogInformation("Internet Identity verification stub executed. Replace with real verification.");
        return Task.FromResult(true);
    }
}