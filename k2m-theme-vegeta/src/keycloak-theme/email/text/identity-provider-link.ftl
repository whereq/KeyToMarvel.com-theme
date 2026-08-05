<#ftl output_format="plainText">
${msg("identityProviderLinkSubject", identityProviderDisplayName)}

${msg("identityProviderLinkIntro", realmName, identityProviderDisplayName, identityProviderContext.username, linkExpirationFormatter(linkExpiration))}

${link}

${msg("identityProviderLinkIgnore", realmName, identityProviderDisplayName)}
