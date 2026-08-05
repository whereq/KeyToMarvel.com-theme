<#import "template.ftl" as layout>
<@layout.emailLayout>
    <h2 style="color:#00c9e4;font-size:20px;font-weight:700;margin:0 0 16px;letter-spacing:-0.01em;">
        ${msg("identityProviderLinkSubject", identityProviderDisplayName)}
    </h2>
    <p style="color:#8892b4;font-size:14px;line-height:1.7;margin:0 0 24px;">
        ${msg("identityProviderLinkIntro", realmName, identityProviderDisplayName, identityProviderContext.username, linkExpirationFormatter(linkExpiration))}
    </p>
    <a href="${link}"
       style="display:inline-block;padding:12px 28px;background:#00c9e4;color:#080a12;
              font-weight:700;font-size:13px;text-decoration:none;letter-spacing:0.08em;
              text-transform:uppercase;">
        ${msg("doLinkAccount")}
    </a>
    <p style="margin:24px 0 0;color:#555e80;font-size:12px;line-height:1.6;">
        ${msg("identityProviderLinkIgnore", realmName, identityProviderDisplayName)}
    </p>
</@layout.emailLayout>
