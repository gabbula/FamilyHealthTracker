using FamilyHealthTracker.Api.Data;
using FamilyHealthTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FamilyHealthTracker.Api.Services;

public record HealthComparison(HealthAverage Average, HealthMetric Latest);

public interface IHealthAnalyticsService
{
    Task<IReadOnlyList<HealthMetric>> GetTrendAsync(Guid familyMemberId, CancellationToken cancellationToken);
    Task<HealthComparison?> CompareWithAverageAsync(Guid familyMemberId, CancellationToken cancellationToken);
}

public class HealthAnalyticsService : IHealthAnalyticsService
{
    private readonly AppDbContext _db;
    private readonly IHealthAveragesService _averagesService;

    public HealthAnalyticsService(AppDbContext db, IHealthAveragesService averagesService)
    {
        _db = db;
        _averagesService = averagesService;
    }

    public async Task<IReadOnlyList<HealthMetric>> GetTrendAsync(Guid familyMemberId, CancellationToken cancellationToken)
    {
        return await _db.HealthMetrics
            .Where(x => x.FamilyMemberId == familyMemberId)
            .OrderByDescending(x => x.RecordedAt)
            .Take(60)
            .ToListAsync(cancellationToken);
    }

    public async Task<HealthComparison?> CompareWithAverageAsync(Guid familyMemberId, CancellationToken cancellationToken)
    {
        var member = await _db.FamilyMembers.FirstOrDefaultAsync(x => x.Id == familyMemberId, cancellationToken);
        if (member is null)
        {
            return null;
        }

        var latest = await _db.HealthMetrics
            .Where(x => x.FamilyMemberId == familyMemberId)
            .OrderByDescending(x => x.RecordedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (latest is null)
        {
            return null;
        }

        var avg = await _averagesService.GetAverageAsync(member.Age, member.Gender, member.Ethnicity, cancellationToken);
        return new HealthComparison(avg, latest);
    }
}