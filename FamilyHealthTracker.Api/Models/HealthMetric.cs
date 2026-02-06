namespace FamilyHealthTracker.Api.Models;

public class HealthMetric
{
    public Guid Id { get; set; }

    public Guid FamilyMemberId { get; set; }
    public FamilyMember? FamilyMember { get; set; }

    public DateTimeOffset RecordedAt { get; set; } = DateTimeOffset.UtcNow;

    public decimal WeightKg { get; set; }

    public decimal HeightM { get; set; }

    public decimal Bmi { get; set; }

    public decimal GlucoseMgDl { get; set; }
}