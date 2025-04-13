import { serve } from "bun";
import QRCode from "qrcode";

interface LoginData {
    token: string;
    name: string;
    premium: boolean;
    user: {
        id: string;
        brand: string;
        code: string;
        email: string;
        name: string;
        qrCode: string;
        qrCodeCompanion: string;
        premium: boolean;
        term: boolean;
        termAt: string;
        covidCertValid: boolean;
        covidCertAcceptTerm: boolean;
    };
}

serve({
    async fetch(req) {
        const url = new URL(req.url);

        if (url.pathname === '/') {
            // Serve the login page
            const html = `<html>
                <body style="display: flex; flex-direction: column; align-items: center; font-family: Arial, sans-serif;">
                    <form method="GET" action="/login" style="margin-top: 50px;">
                        <div style="margin-bottom: 16px;">
                            <label for="user" style="font-size: 16px;">Username:</label>
                            <input type="text" id="user" name="user" required style="margin-left: 8px; padding: 4px; font-size: 14px;" />
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label for="pass" style="font-size: 16px;">Password:</label>
                            <input type="password" id="pass" name="pass" required style="margin-left: 8px; padding: 4px; font-size: 14px;" />
                        </div>
                        <button type="submit" style="padding: 8px 16px; font-size: 16px;">Login</button>
                    </form>
                </body>
            </html>`;

            return new Response(html, { headers: { "Content-Type": "text/html" } });
        }

        if (url.pathname === '/login') {
            const user = url.searchParams.get("user");
            const pass = url.searchParams.get("pass");

            if (!user || !pass) {
                return new Response("Missing 'user' or 'pass' query parameters.", { status: 400 });
            }

            const authHeader = `Basic ${btoa(`${user}:${pass}`)}`;
            const loginUrl = "https://api.seeplus.inovretail.com/app-element/user/authenticate";

            try {
                // Step 1: Authenticate the user
                const loginResponse = await fetch(loginUrl, {
                    method: "POST",
                    headers: {
                        "accept": "application/json, text/plain, */*",
                        "authorization": authHeader,
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "x-requested-with": "pt.elementfitness.element",
                    },
                });

                if (!loginResponse.ok) {
                    return new Response("Login failed. Check credentials.", { status: 401 });
                }

                const loginData = await loginResponse.json() as LoginData;
                const { qrCode, qrCodeCompanion } = loginData.user;

                if (!qrCode) {
                    return new Response("Error: Main QR code is missing.", { status: 500 });
                }

                // Step 2: Generate QR codes
                const mainQrSvg = await QRCode.toDataURL(qrCode, { width: 450, errorCorrectionLevel: 'L' });
                let guestQrSvg = null;

                if (qrCodeCompanion) {
                    guestQrSvg = await QRCode.toDataURL(qrCodeCompanion, { width: 450, errorCorrectionLevel: 'L' });
                }

                // Step 3: Create the HTML response
                const html = `<html>
                    <body style="display: flex; flex-direction: column; align-items: center; font-family: Arial, sans-serif;">
                        <div style="margin-bottom: 16px; text-align: center;">
                            <p style="font-size: 16px; font-weight: bold;">Main QR</p>
                            <img src="${mainQrSvg}" alt="Main QR" style="max-width: 100%; height: auto;" />
                        </div>
                        ${guestQrSvg ? `
                        <div style="margin-bottom: 16px; text-align: center;">
                            <p style="font-size: 16px; font-weight: bold;">Guest QR</p>
                            <img src="${guestQrSvg}" alt="Guest QR" style="max-width: 100%; height: auto;" />
                        </div>` : ''}
                    </body>
                </html>`;

                return new Response(html, { headers: { "Content-Type": "text/html" } });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                return new Response(`Error: ${errorMessage}`, { status: 500 });
            }
        }

        return new Response("Not Found", { status: 404 });
    },
    port: 3000,
    idleTimeout: 10,
});