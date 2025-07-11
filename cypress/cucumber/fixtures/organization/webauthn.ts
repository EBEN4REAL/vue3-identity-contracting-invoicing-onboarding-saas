export const webauthnRegistrationCredentials = {
  "001-webauthn-credential": {
    rp: {
      name: "Acme Inc.",
      id: "localhost",
    },
    user: {
      id: "DAg6FPgeC4FBAdbOoLX3cT2sKISuIv4xFtz6RIHQ-emXIr_KjzuUVhwa-EcQBGOyn3ptA4sZx3Dul30Lk2m4yA",
      name: "eben+webauth+19@test.com",
      displayName: "eben+webauth+19@test.com",
    },
    challenge:
      "6LolLMbzkhqeU-Y9dhDZCCWp7FBk6BSckz9nI-neRXxG5FvWhWIODJ_PzFIAK2CY468Ay4Kp5yMLT8937Afh2g",
    pubKeyCredParams: [
      {
        type: "public-key",
        alg: -7,
      },
      {
        type: "public-key",
        alg: -8,
      },
      {
        type: "public-key",
        alg: -36,
      },
      {
        type: "public-key",
        alg: -37,
      },
      {
        type: "public-key",
        alg: -38,
      },
      {
        type: "public-key",
        alg: -39,
      },
      {
        type: "public-key",
        alg: -257,
      },
      {
        type: "public-key",
        alg: -258,
      },
      {
        type: "public-key",
        alg: -259,
      },
    ],
    timeout: 60000,
    excludeCredentials: [],
    authenticatorSelection: {
      requireResidentKey: false,
      userVerification: "required",
    },
    attestation: "none",
  },
  "002-webauthnsetup-confirmed": {
    created_date: "2024-10-08T19:46:27.886038Z",
    confirmed: true,
    last_login_date: "2024-10-09T01:19:29.632176Z",
  },
  "003-webauth-registration-response": {
    id: "lJeinr-CRJzzJWefjs7hUE5Y32s",
    rawId: "lJeinr-CRJzzJWefjs7hUE5Y32s",
    response: {
      attestationObject:
        "o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YViYSZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NdAAAAAPv8MAcVTk7MjAtuAgVX170AFJSXop6_gkSc8yVnn47O4VBOWN9rpQECAyYgASFYICWkoXFmwXy9HeFILyLovUWVOCrxJJpaYtnKGWH9q8KTIlggslqSbMu8Tnf5ANclyEyz9BLjyWmb01cV_A7a6G6rTYA",
      clientDataJSON:
        "eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiR0p6TGVsZmhXa2phYy1iLWMyVEJuWXowLWtuaFBqUEwtQ0RFanBCcm1WRHFxNVgzR0hhM0lLMGFBclY0THhzb1FGdFpCNzN0U3RyUVd0R1RKeGk4Z2ciLCJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjUxNzIiLCJjcm9zc09yaWdpbiI6ZmFsc2V9",
      transports: ["hybrid", "internal"],
      publicKeyAlgorithm: -7,
      publicKey:
        "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEJaShcWbBfL0d4UgvIui9RZU4KvEkmlpi2coZYf2rwpOyWpJsy7xOd_kA1yXITLP0EuPJaZvTVxX8DtrobqtNgA",
      authenticatorData:
        "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NdAAAAAPv8MAcVTk7MjAtuAgVX170AFJSXop6_gkSc8yVnn47O4VBOWN9rpQECAyYgASFYICWkoXFmwXy9HeFILyLovUWVOCrxJJpaYtnKGWH9q8KTIlggslqSbMu8Tnf5ANclyEyz9BLjyWmb01cV_A7a6G6rTYA",
    },
    type: "public-key",
    clientExtensionResults: {},
    authenticatorAttachment: "platform",
  },
};
