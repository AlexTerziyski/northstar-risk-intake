import { NextResponse } from "next/server"
import { google } from "googleapis"

function getSeverity(score: number) {
    if (score >= 20) return "Critical"
    if (score >= 12) return "High"
    if (score >= 5) return "Medium"
    return "Low"
}

function getOwner(category: string, assetType: string) {
    if (category === "Regulatory/Compliance") return "GRC Lead"
    if (category === "Third-Party" || assetType === "vendor") return "Vendor Manager"
    if (category === "Operational") return "COO Delegate"
    if (category === "Physical & Environmental") return "Facilities Manager"
    if (category === "People & Culture") return "HR Lead"
    return "IT Lead"
}

export async function POST(req: Request) {
    try {
        const data = await req.json()

        const auth = new google.auth.JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        })

        const sheets = google.sheets({ version: "v4", auth })

        const spreadsheetId = process.env.GOOGLE_SHEET_ID!
        const sheetName = "Sheet1"

        // ✅ FIX: wrap sheet name in quotes for spaces/colon
        const safeSheetName = `'${sheetName}'`

        const existingRows = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${safeSheetName}!A:A`,
        })

        const rowCount = existingRows.data.values?.length || 1
        const riskId = `R-${String(rowCount).padStart(3, "0")}`

        const likelihood = Number(data.likelihood)
        const impact = Number(data.impact)
        const riskScore = likelihood * impact
        const severity = getSeverity(riskScore)
        const owner = getOwner(data.riskCategory, data.assetType)

        const timestamp = new Date().toISOString()

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${safeSheetName}!A:Z`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[
                    riskId,
                    timestamp,
                    timestamp,
                    data.submitterName,
                    data.submitterEmail,
                    data.department,
                    data.assetAffected,
                    data.assetType,
                    data.riskCategory,
                    data.threatDescription,
                    data.vulnerabilityDescription,
                    data.likelihood,
                    data.likelihoodJustification,
                    data.impact,
                    data.impactJustification,
                    "", // Risk Score - formula in sheet
                    "", // Severity - formula in sheet
                    owner,
                    data.dateDiscovered,
                    data.supportingEvidence,
                    data.escalationContact || "",
                    "Vercel Intake Form",
                    "", // Treatment Option
                    "Not Started",
                    "", // Controls Selected
                    "", // Residual Risk Score
                    "", // Review Date
                    "Planned",
                    "", // Previous Score
                    "", // Risk Velocity - formula in sheet
                    ""  // Notes / Evidence
                ]],
            },
        })

        return NextResponse.json({ success: true, riskId })
    } catch (error) {
        console.error("Submit risk error:", error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}