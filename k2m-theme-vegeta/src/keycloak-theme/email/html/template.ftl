<#macro emailLayout>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>${msg("emailTitle", realmName)}</title>
    <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
    <style>
        body { margin:0; padding:0; background-color:#080a12; font-family:'Segoe UI',Arial,sans-serif; }
        table { border-spacing:0; border-collapse:collapse; }
        img { border:0; outline:none; text-decoration:none; display:block; }
        a { color:#00c9e4; }
        @media (prefers-color-scheme:dark) {
            body { background-color:#080a12 !important; }
        }
    </style>
</head>
<body style="margin:0;padding:0;background-color:#080a12;">

<!-- Preheader -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${msg("emailTitle", realmName)}
</div>

<!-- Wrapper -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
       style="background-color:#080a12;min-height:100vh;">
    <tr>
        <td align="center" style="padding:40px 16px;">

            <!-- Card -->
            <table role="presentation" width="100%" style="max-width:540px;" cellpadding="0" cellspacing="0">

                <!-- Header bar (backend gold accent) -->
                <tr>
                    <td style="background-color:#f5c518;height:3px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>

                <!-- Card body -->
                <tr>
                    <td style="background-color:#171a2e;border:1px solid #1a1e35;border-top:none;padding:32px 36px 28px;">

                        <!-- Brand -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                            <tr>
                                <td>
                                    <span style="color:#f5c518;font-size:11px;font-weight:700;
                                                 letter-spacing:0.2em;text-transform:uppercase;">
                                        ${realmName}
                                    </span>
                                </td>
                            </tr>
                        </table>

                        <!-- Content slot -->
                        <#nested>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background-color:#0f1120;border:1px solid #1a1e35;border-top:none;
                               padding:16px 36px;text-align:center;">
                        <p style="color:#555e80;font-size:11px;margin:0;line-height:1.6;">
                            &copy; ${.now?string("yyyy")} ${realmName}. All rights reserved.
                        </p>
                        <p style="color:#555e80;font-size:10px;margin:8px 0 0;line-height:1.6;">
                            ${msg("emailFooterNote")}
                        </p>
                    </td>
                </tr>
            </table>

        </td>
    </tr>
</table>

</body>
</html>
</#macro>
