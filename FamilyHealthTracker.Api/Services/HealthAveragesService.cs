using FamilyHealthTracker.Api.Models;

namespace FamilyHealthTracker.Api.Services;

public record HealthAverage(decimal WeightKg, decimal HeightM, decimal Bmi, decimal GlucoseMgDl);

public interface IHealthAveragesService
{
    Task<HealthAverage> GetAverageAsync(int age, Gender gender, string ethnicity, CancellationToken cancellationToken);
}

public class HealthAveragesService : IHealthAveragesService
{
    private readonly ILogger<HealthAveragesService> _logger;

    public HealthAveragesService(ILogger<HealthAveragesService> logger)
    {
        _logger = logger;
    }

    public Task<HealthAverage> GetAverageAsync(int age, Gender gender, string ethnicity, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Health averages stub executed. Configure external API integration.");
        return Task.FromResult(new HealthAverage(70, 1.70m, 24.2m, 95));
    }
}