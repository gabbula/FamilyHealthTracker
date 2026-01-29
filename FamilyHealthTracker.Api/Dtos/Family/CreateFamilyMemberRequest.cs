using FamilyHealthTracker.Api.Models;

namespace FamilyHealthTracker.Api.Dtos.Family;

public record CreateFamilyMemberRequest(
    string Name,
    int Age,
    Gender Gender,
    string Ethnicity
);