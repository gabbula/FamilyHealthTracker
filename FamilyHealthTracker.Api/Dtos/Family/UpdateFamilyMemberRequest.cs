using FamilyHealthTracker.Api.Models;

namespace FamilyHealthTracker.Api.Dtos.Family;

public record UpdateFamilyMemberRequest(
    string Name,
    int Age,
    Gender Gender,
    string Ethnicity
);