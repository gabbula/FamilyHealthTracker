using FamilyHealthTracker.Api.Data;
using FamilyHealthTracker.Api.Extensions;
using FamilyHealthTracker.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FamilyHealthTracker.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/analytics")]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IHealthAnalyticsService _analytics;

    public AnalyticsController(AppDbContext db, IHealthAnalyticsService analytics)
    {
        _db = db;
        _analytics = analytics;
    }

    [HttpGet("{familyMemberId:guid}/trend")]
    public async Task<ActionResult> GetTrend(Guid familyMemberId, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var memberOwned = await _db.FamilyMembers.AnyAsync(x => x.Id == familyMemberId && x.UserAccountId == userId, cancellationToken);
        if (!memberOwned)
        {
            return NotFound();
        }

        var trend = await _analytics.GetTrendAsync(familyMemberId, cancellationToken);
        return Ok(trend);
    }

    [HttpGet("{familyMemberId:guid}/compare")]
    public async Task<ActionResult> Compare(Guid familyMemberId, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var memberOwned = await _db.FamilyMembers.AnyAsync(x => x.Id == familyMemberId && x.UserAccountId == userId, cancellationToken);
        if (!memberOwned)
        {
            return NotFound();
        }

        var comparison = await _analytics.CompareWithAverageAsync(familyMemberId, cancellationToken);
        return comparison is null ? NotFound() : Ok(comparison);
    }
}