using FamilyHealthTracker.Api.Models;

namespace FamilyHealthTracker.Api.Dtos.Family;

public record FamilyMemberDto(
    Guid Id,
    string Name,
    int Age,
    Gender Gender,
    string Ethnicity,
    DateTimeOffset CreatedAt
);