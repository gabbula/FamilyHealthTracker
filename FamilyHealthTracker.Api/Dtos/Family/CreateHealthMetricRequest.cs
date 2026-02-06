using FamilyHealthTracker.Api.Models;

namespace FamilyHealthTracker.Api.Dtos.Family;

public record CreateHealthMetricRequest(
    UnitSystem UnitSystem,
    decimal Weight,
    decimal Height,
    int? HeightFeet,
    int? HeightInches,
    decimal GlucoseMgDl,
    DateTimeOffset? RecordedAt
);