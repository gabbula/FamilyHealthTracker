using FamilyHealthTracker.Api.Models;

namespace FamilyHealthTracker.Api.Services;

public interface IUnitConversionService
{
    (decimal WeightKg, decimal HeightM) Normalize(UnitSystem unitSystem, decimal weight, decimal height, int? heightFeet, int? heightInches);
    decimal CalculateBmi(decimal weightKg, decimal heightM);
}

public class UnitConversionService : IUnitConversionService
{
    public (decimal WeightKg, decimal HeightM) Normalize(UnitSystem unitSystem, decimal weight, decimal height, int? heightFeet, int? heightInches)
    {
        if (unitSystem == UnitSystem.Imperial)
        {
            var totalInches = heightFeet.HasValue || heightInches.HasValue
                ? ((heightFeet ?? 0) * 12) + (heightInches ?? 0)
                : (int)Math.Round(height);

            var heightM = totalInches * 0.0254m;
            var weightKg = weight * 0.45359237m;
            return (weightKg, heightM);
        }

        return (weight, height);
    }

    public decimal CalculateBmi(decimal weightKg, decimal heightM)
    {
        if (heightM <= 0)
        {
            return 0;
        }

        return Math.Round(weightKg / (heightM * heightM), 2);
    }
}