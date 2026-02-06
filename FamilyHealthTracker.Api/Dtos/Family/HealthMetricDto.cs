namespace FamilyHealthTracker.Api.Dtos.Family;

public record HealthMetricDto(
    Guid Id,
    DateTimeOffset RecordedAt,
    decimal WeightKg,
    decimal HeightM,
    decimal Bmi,
    decimal GlucoseMgDl
);