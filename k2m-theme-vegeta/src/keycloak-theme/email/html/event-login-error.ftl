<#import "template.ftl" as layout>
<@layout.emailLayout>
    <h2 style="color:#ff4757;font-size:20px;font-weight:700;margin:0 0 16px;">
        ${msg("loginErrorEmailSubject")}
    </h2>
    <p style="color:#8892b4;font-size:14px;line-height:1.7;margin:0 0 16px;">
        ${msg("loginErrorEmailBody", event.ipAddress, event.date)}
    </p>
    <p style="color:#555e80;font-size:12px;margin:0;">
        ${msg("emailIgnoreIfNotRequested")}
    </p>
</@layout.emailLayout>
