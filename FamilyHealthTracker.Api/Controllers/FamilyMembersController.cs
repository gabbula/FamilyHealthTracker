using FamilyHealthTracker.Api.Data;
using FamilyHealthTracker.Api.Dtos.Family;
using FamilyHealthTracker.Api.Extensions;
using FamilyHealthTracker.Api.Models;
using FamilyHealthTracker.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FamilyHealthTracker.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/family-members")]
public class FamilyMembersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IUnitConversionService _unitConversion;

    public FamilyMembersController(AppDbContext db, IUnitConversionService unitConversion)
    {
        _db = db;
        _unitConversion = unitConversion;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<FamilyMemberDto>>> GetAll(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var members = await _db.FamilyMembers
            .Where(x => x.UserAccountId == userId)
            .OrderBy(x => x.Name)
            .Select(x => new FamilyMemberDto(x.Id, x.Name, x.Age, x.Gender, x.Ethnicity, x.CreatedAt))
            .ToListAsync(cancellationToken);

        return Ok(members);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<FamilyMemberDto>> Get(Guid id, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var member = await _db.FamilyMembers
            .Where(x => x.UserAccountId == userId && x.Id == id)
            .Select(x => new FamilyMemberDto(x.Id, x.Name, x.Age, x.Gender, x.Ethnicity, x.CreatedAt))
            .FirstOrDefaultAsync(cancellationToken);

        return member is null ? NotFound() : Ok(member);
    }

    [HttpPost]
    public async Task<ActionResult<FamilyMemberDto>> Create(CreateFamilyMemberRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var count = await _db.FamilyMembers.CountAsync(x => x.UserAccountId == userId, cancellationToken);
        if (count >= 10)
        {
            return BadRequest(new { message = "Family member limit reached (10)." });
        }

        var member = new FamilyMember
        {
            Id = Guid.NewGuid(),
            UserAccountId = userId,
            Name = request.Name,
            Age = request.Age,
            Gender = request.Gender,
            Ethnicity = request.Ethnicity
        };

        _db.FamilyMembers.Add(member);
        await _db.SaveChangesAsync(cancellationToken);

        var dto = new FamilyMemberDto(member.Id, member.Name, member.Age, member.Gender, member.Ethnicity, member.CreatedAt);
        return CreatedAtAction(nameof(Get), new { id = member.Id }, dto);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, UpdateFamilyMemberRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var member = await _db.FamilyMembers.FirstOrDefaultAsync(x => x.UserAccountId == userId && x.Id == id, cancellationToken);
        if (member is null)
        {
            return NotFound();
        }

        member.Name = request.Name;
        member.Age = request.Age;
        member.Gender = request.Gender;
        member.Ethnicity = request.Ethnicity;

        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var member = await _db.FamilyMembers.FirstOrDefaultAsync(x => x.UserAccountId == userId && x.Id == id, cancellationToken);
        if (member is null)
        {
            return NotFound();
        }

        _db.FamilyMembers.Remove(member);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("{id:guid}/metrics")]
    public async Task<ActionResult<IReadOnlyList<HealthMetricDto>>> GetMetrics(Guid id, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var exists = await _db.FamilyMembers.AnyAsync(x => x.UserAccountId == userId && x.Id == id, cancellationToken);
        if (!exists)
        {
            return NotFound();
        }

        var metrics = await _db.HealthMetrics
            .Where(x => x.FamilyMemberId == id)
            .OrderByDescending(x => x.RecordedAt)
            .Select(x => new HealthMetricDto(x.Id, x.RecordedAt, x.WeightKg, x.HeightM, x.Bmi, x.GlucoseMgDl))
            .ToListAsync(cancellationToken);

        return Ok(metrics);
    }

    [HttpPost("{id:guid}/metrics")]
    public async Task<ActionResult<HealthMetricDto>> AddMetric(Guid id, CreateHealthMetricRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var member = await _db.FamilyMembers.FirstOrDefaultAsync(x => x.UserAccountId == userId && x.Id == id, cancellationToken);
        if (member is null)
        {
            return NotFound();
        }

        var (weightKg, heightM) = _unitConversion.Normalize(request.UnitSystem, request.Weight, request.Height, request.HeightFeet, request.HeightInches);
        var bmi = _unitConversion.CalculateBmi(weightKg, heightM);

        var metric = new HealthMetric
        {
            Id = Guid.NewGuid(),
            FamilyMemberId = id,
            RecordedAt = request.RecordedAt ?? DateTimeOffset.UtcNow,
            WeightKg = weightKg,
            HeightM = heightM,
            Bmi = bmi,
            GlucoseMgDl = request.GlucoseMgDl
        };

        _db.HealthMetrics.Add(metric);
        await _db.SaveChangesAsync(cancellationToken);

        var dto = new HealthMetricDto(metric.Id, metric.RecordedAt, metric.WeightKg, metric.HeightM, metric.Bmi, metric.GlucoseMgDl);
        return CreatedAtAction(nameof(GetMetrics), new { id }, dto);
    }
}