// uspsAddressService.ts

export interface AddressInput {
  streetAddress: string;
  secondaryAddress?: string;
  city?: string;
  state?: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
}

export interface ValidatedAddress {
  streetAddress: string;
  secondaryAddress?: string | null;
  city: string;
  state: string;
  ZIPCode: string;
  ZIPPlus4?: string | null;
  dpvConfirmation?: string | null; // "Y", "N", "D", etc.
  raw: any; // full USPS response if you want it
}

/**
 * validateAddress
 * Calls USPS Addresses v3 "address" endpoint to validate/standardize
 * and returns data you can use to auto-fill your form.
 */
export async function validateAddress(
  input: AddressInput
): Promise<ValidatedAddress | null> {
  const token = process.env.USPS_ACCESS_TOKEN;
  if (!token) {
    throw new Error("USPS_ACCESS_TOKEN not set in environment");
  }

  const params = new URLSearchParams();

  if (input.streetAddress) params.set("streetAddress", input.streetAddress);
  if (input.secondaryAddress)
    params.set("secondaryAddress", input.secondaryAddress);
  if (input.city) params.set("city", input.city);
  if (input.state) params.set("state", input.state);
  if (input.ZIPCode) params.set("ZIPCode", input.ZIPCode);
  if (input.ZIPPlus4) params.set("ZIPPlus4", input.ZIPPlus4);

  const url = `https://apis.usps.com/addresses/v3/address?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    // You may want better logging/error handling here
    console.error("USPS error", res.status, await res.text());
    return null;
  }

  const data = await res.json();

  // USPS example response shape:
  // {
  //   firm: null,
  //   address: { streetAddress, secondaryAddress, city, state, ZIPCode, ZIPPlus4, ... },
  //   additionalInfo: { DPVConfirmation: "Y", ... },
  //   corrections: [...],
  //   matches: [...]
  // }

  const address = data.address;
  if (!address) return null;

  return {
    streetAddress: address.streetAddress,
    secondaryAddress: address.secondaryAddress ?? null,
    city: address.city,
    state: address.state,
    ZIPCode: address.ZIPCode,
    ZIPPlus4: address.ZIPPlus4 ?? null,
    dpvConfirmation: data.additionalInfo?.DPVConfirmation ?? null,
    raw: data,
  };
}
