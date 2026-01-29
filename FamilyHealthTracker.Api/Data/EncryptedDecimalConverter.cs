using System.Globalization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FamilyHealthTracker.Api.Data;

public sealed class EncryptedDecimalConverter : ValueConverter<decimal, string>
{
    public EncryptedDecimalConverter(IDataProtector protector)
        : base(
            v => protector.Protect(v.ToString(CultureInfo.InvariantCulture)),
            v => decimal.Parse(protector.Unprotect(v), CultureInfo.InvariantCulture))
    {
    }
}