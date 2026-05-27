"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  Shield,
  Upload,
  Info,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const DEPARTMENTS = [
  "Investment Management",
  "Client Services",
  "Operations & Technology",
  "Executive / Board",
  "Compliance / Legal",
  "Other",
];

const ASSET_TYPES = [
  { value: "temenos", label: "Temenos Transact / Core banking and portfolio management" },
  { value: "salesforce", label: "Salesforce CRM" },
  { value: "m365", label: "Microsoft 365" },
  { value: "sharepoint", label: "SharePoint Online" },
  { value: "fileserver", label: "On-premises Windows file server" },
  { value: "vpn", label: "Cisco AnyConnect VPN" },
  { value: "backup", label: "Backup system" },
  { value: "vendor", label: "Third-party vendor system" },
  { value: "network", label: "Network infrastructure" },
  { value: "logging", label: "Security logging / monitoring" },
  { value: "policy", label: "Policy / process" },
  { value: "other", label: "Other" },
];

const RISK_CATEGORIES = [
  "Cybersecurity",
  "Operational",
  "Regulatory/Compliance",
  "Third-Party",
  "Physical & Environmental",
  "People & Culture",
];

const LIKELIHOOD_OPTIONS = [
  { value: "1", label: "1 Very Low — Rare or unlikely" },
  { value: "2", label: "2 Low — Possible but uncommon" },
  { value: "3", label: "3 Moderate — Plausible" },
  { value: "4", label: "4 High — Likely" },
  { value: "5", label: "5 Very High — Expected or actively occurring" },
];

const IMPACT_OPTIONS = [
  { value: "1", label: "1 Very Low — Minimal business impact" },
  { value: "2", label: "2 Low — Limited team-level impact" },
  { value: "3", label: "3 Moderate — Department or service impact" },
  { value: "4", label: "4 High — Major operational, financial, client, or compliance impact" },
  { value: "5", label: "5 Critical — Severe business disruption, regulatory exposure, client harm, or board-level concern" },
];

const ESCALATION_CONTACTS = [
  "CISO",
  "IT Lead",
  "GRC Lead",
  "COO",
  "Vendor Manager",
  "Not yet notified",
];

const PROGRAM_FLOW_STEPS = [
  "Intake",
  "Triage",
  "Assessment",
  "Treatment",
  "Monitoring",
  "Review",
  "Closure/Escalation",
];

interface FormData {
  submitterName: string;
  submitterEmail: string;
  department: string;
  assetAffected: string;
  assetType: string;
  riskCategory: string;
  threatDescription: string;
  vulnerabilityDescription: string;
  supportingEvidence: string;
  likelihood: string;
  likelihoodJustification: string;
  impact: string;
  impactJustification: string;
  dateDiscovered: string;
  escalationContact: string;
}

interface FormErrors {
  [key: string]: string;
}

export function RiskIntakeForm() {
  const [formData, setFormData] = useState<FormData>({
    submitterName: "",
    submitterEmail: "",
    department: "",
    assetAffected: "",
    assetType: "",
    riskCategory: "",
    threatDescription: "",
    vulnerabilityDescription: "",
    supportingEvidence: "",
    likelihood: "",
    likelihoodJustification: "",
    impact: "",
    impactJustification: "",
    dateDiscovered: "",
    escalationContact: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const riskScore = useMemo(() => {
    if (formData.likelihood && formData.impact) {
      return parseInt(formData.likelihood) * parseInt(formData.impact);
    }
    return null;
  }, [formData.likelihood, formData.impact]);

  const severity = useMemo(() => {
    if (!riskScore) return null;
    if (riskScore >= 20) return { label: "Critical", color: "bg-severity-critical text-white" };
    if (riskScore >= 12) return { label: "High", color: "bg-severity-high text-white" };
    if (riskScore >= 5) return { label: "Medium", color: "bg-severity-medium text-foreground" };
    return { label: "Low", color: "bg-severity-low text-white" };
  }, [riskScore]);

  const requiresEscalation = useMemo(() => {
    return formData.impact === "4" || formData.impact === "5";
  }, [formData.impact]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.submitterName.trim()) newErrors.submitterName = "Name is required";
    if (!formData.submitterEmail.trim()) {
      newErrors.submitterEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.submitterEmail)) {
      newErrors.submitterEmail = "Invalid email format";
    }
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.assetAffected.trim()) newErrors.assetAffected = "Asset affected is required";
    if (!formData.assetType) newErrors.assetType = "Asset type is required";
    if (!formData.riskCategory) newErrors.riskCategory = "Risk category is required";
    if (!formData.threatDescription.trim()) newErrors.threatDescription = "Threat description is required";
    if (!formData.vulnerabilityDescription.trim()) newErrors.vulnerabilityDescription = "Vulnerability description is required";
    if (!formData.likelihood) newErrors.likelihood = "Likelihood is required";
    if (!formData.likelihoodJustification.trim()) newErrors.likelihoodJustification = "Likelihood justification is required";
    if (!formData.impact) newErrors.impact = "Impact is required";
    if (!formData.impactJustification.trim()) newErrors.impactJustification = "Impact justification is required";
    if (!formData.dateDiscovered) newErrors.dateDiscovered = "Date discovered is required";
    if (requiresEscalation && !formData.escalationContact) {
      newErrors.escalationContact = "Escalation contact is required for High/Critical impact";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-severity-low/30">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-severity-low/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-severity-low" />
              </div>
              <CardTitle className="text-2xl">Risk Submitted Successfully</CardTitle>
              <CardDescription className="text-base">
                Your risk has been submitted for review. You will receive confirmation at{" "}
                <span className="font-medium text-foreground">{formData.submitterEmail}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Next Steps:</strong>
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>A Risk ID will be assigned and sent to you via email</li>
                  <li>The risk will be reviewed according to SLA timelines</li>
                  <li>A risk owner will be assigned based on category and asset type</li>
                </ul>
              </div>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    submitterName: "",
                    submitterEmail: "",
                    department: "",
                    assetAffected: "",
                    assetType: "",
                    riskCategory: "",
                    threatDescription: "",
                    vulnerabilityDescription: "",
                    supportingEvidence: "",
                    likelihood: "",
                    likelihoodJustification: "",
                    impact: "",
                    impactJustification: "",
                    dateDiscovered: "",
                    escalationContact: "",
                  });
                }}
                className="w-full"
              >
                Submit Another Risk
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Shield className="w-8 h-8" />
            <span className="text-sm font-medium tracking-wide uppercase">NorthStar Financial Services</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Risk Intake Portal
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cybersecurity Risk Management Program — D1: Risk Intake &amp; Identification Process
          </p>
        </header>

        {/* Program Flow Info Panel */}
        <Card className="bg-muted/30 border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Info className="w-4 h-4" />
              Program Flow
            </CardTitle>
            <CardDescription className="text-xs">
              Informational only — this portal handles the Intake stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2">
              {PROGRAM_FLOW_STEPS.map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                  <Badge
                    variant={index === 0 ? "default" : "secondary"}
                    className={index === 0 ? "bg-primary" : ""}
                  >
                    {step}
                  </Badge>
                  {index < PROGRAM_FLOW_STEPS.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Submitter Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Submitter Information</CardTitle>
              <CardDescription>Your contact details for follow-up</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="submitterName">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="submitterName"
                  placeholder="Enter your full name"
                  value={formData.submitterName}
                  onChange={(e) => updateField("submitterName", e.target.value)}
                  className={errors.submitterName ? "border-destructive" : ""}
                />
                {errors.submitterName && (
                  <p className="text-xs text-destructive">{errors.submitterName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="submitterEmail">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="submitterEmail"
                  type="email"
                  placeholder="your.email@northstar.ca"
                  value={formData.submitterEmail}
                  onChange={(e) => updateField("submitterEmail", e.target.value)}
                  className={errors.submitterEmail ? "border-destructive" : ""}
                />
                {errors.submitterEmail && (
                  <p className="text-xs text-destructive">{errors.submitterEmail}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="department">
                  Department <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => updateField("department", value)}
                >
                  <SelectTrigger className={`w-full ${errors.department ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-xs text-destructive">{errors.department}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Risk Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Risk Identification</CardTitle>
              <CardDescription>Identify the asset and risk category</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetAffected">
                  Asset Affected <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="assetAffected"
                  placeholder="e.g., Production email server, Client portal"
                  value={formData.assetAffected}
                  onChange={(e) => updateField("assetAffected", e.target.value)}
                  className={errors.assetAffected ? "border-destructive" : ""}
                />
                {errors.assetAffected && (
                  <p className="text-xs text-destructive">{errors.assetAffected}</p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="assetType">
                    Asset Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.assetType}
                    onValueChange={(value) => updateField("assetType", value)}
                  >
                    <SelectTrigger className={`w-full ${errors.assetType ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSET_TYPES.map((asset) => (
                        <SelectItem key={asset.value} value={asset.value}>
                          {asset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.assetType && (
                    <p className="text-xs text-destructive">{errors.assetType}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskCategory">
                    Risk Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.riskCategory}
                    onValueChange={(value) => updateField("riskCategory", value)}
                  >
                    <SelectTrigger className={`w-full ${errors.riskCategory ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Select risk category" />
                    </SelectTrigger>
                    <SelectContent>
                      {RISK_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.riskCategory && (
                    <p className="text-xs text-destructive">{errors.riskCategory}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Threat and Vulnerability */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Threat and Vulnerability</CardTitle>
              <CardDescription>Describe the potential threat and exploitable weakness</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="threatDescription">
                  Threat Description <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">What could happen?</p>
                <Textarea
                  id="threatDescription"
                  placeholder="Describe the potential threat scenario..."
                  value={formData.threatDescription}
                  onChange={(e) => updateField("threatDescription", e.target.value)}
                  className={`min-h-[100px] ${errors.threatDescription ? "border-destructive" : ""}`}
                />
                {errors.threatDescription && (
                  <p className="text-xs text-destructive">{errors.threatDescription}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vulnerabilityDescription">
                  Vulnerability Description <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">What weakness could be exploited?</p>
                <Textarea
                  id="vulnerabilityDescription"
                  placeholder="Describe the vulnerability or weakness..."
                  value={formData.vulnerabilityDescription}
                  onChange={(e) => updateField("vulnerabilityDescription", e.target.value)}
                  className={`min-h-[100px] ${errors.vulnerabilityDescription ? "border-destructive" : ""}`}
                />
                {errors.vulnerabilityDescription && (
                  <p className="text-xs text-destructive">{errors.vulnerabilityDescription}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportingEvidence">Supporting Evidence</Label>
                <p className="text-xs text-muted-foreground">
                  Paste links, notes, screenshot references, audit findings, or incident details.
                </p>
                <Textarea
                  id="supportingEvidence"
                  placeholder="Add any supporting evidence or references..."
                  value={formData.supportingEvidence}
                  onChange={(e) => updateField("supportingEvidence", e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>File Upload (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/20">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    File upload will be available in a future release
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    For now, please reference files in the Supporting Evidence field
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Initial Risk Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">4. Initial Risk Rating</CardTitle>
              <CardDescription>Assess the likelihood and potential impact</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="likelihood">
                    Likelihood <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.likelihood}
                    onValueChange={(value) => updateField("likelihood", value)}
                  >
                    <SelectTrigger className={`w-full ${errors.likelihood ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Select likelihood" />
                    </SelectTrigger>
                    <SelectContent>
                      {LIKELIHOOD_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.likelihood && (
                    <p className="text-xs text-destructive">{errors.likelihood}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impact">
                    Impact <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.impact}
                    onValueChange={(value) => updateField("impact", value)}
                  >
                    <SelectTrigger className={`w-full ${errors.impact ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMPACT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.impact && (
                    <p className="text-xs text-destructive">{errors.impact}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="likelihoodJustification">
                  Likelihood Justification <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="likelihoodJustification"
                  placeholder="Explain why you selected this likelihood rating..."
                  value={formData.likelihoodJustification}
                  onChange={(e) => updateField("likelihoodJustification", e.target.value)}
                  className={`min-h-[80px] ${errors.likelihoodJustification ? "border-destructive" : ""}`}
                />
                {errors.likelihoodJustification && (
                  <p className="text-xs text-destructive">{errors.likelihoodJustification}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="impactJustification">
                  Impact Justification <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="impactJustification"
                  placeholder="Explain why you selected this impact rating..."
                  value={formData.impactJustification}
                  onChange={(e) => updateField("impactJustification", e.target.value)}
                  className={`min-h-[80px] ${errors.impactJustification ? "border-destructive" : ""}`}
                />
                {errors.impactJustification && (
                  <p className="text-xs text-destructive">{errors.impactJustification}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateDiscovered">
                  Date Discovered <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dateDiscovered"
                  type="date"
                  value={formData.dateDiscovered}
                  onChange={(e) => updateField("dateDiscovered", e.target.value)}
                  className={`w-full sm:w-auto ${errors.dateDiscovered ? "border-destructive" : ""}`}
                />
                {errors.dateDiscovered && (
                  <p className="text-xs text-destructive">{errors.dateDiscovered}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Conditional Escalation */}
          {requiresEscalation && (
            <Card className="border-severity-high/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-severity-high" />
                  5. Escalation Required
                </CardTitle>
                <CardDescription>High and Critical impact risks require immediate escalation notification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-severity-high/10 border-severity-high/30">
                  <AlertTriangle className="h-4 w-4 text-severity-high" />
                  <AlertTitle className="text-severity-high">Expedited Review Required</AlertTitle>
                  <AlertDescription>
                    High and Critical risks are subject to expedited intake SLA review.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label htmlFor="escalationContact">
                    Immediate Escalation Contact Notified <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.escalationContact}
                    onValueChange={(value) => updateField("escalationContact", value)}
                  >
                    <SelectTrigger className={`w-full ${errors.escalationContact ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Select escalation contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESCALATION_CONTACTS.map((contact) => (
                        <SelectItem key={contact} value={contact}>
                          {contact}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.escalationContact && (
                    <p className="text-xs text-destructive">{errors.escalationContact}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 6: Calculated Preview Panel */}
          {riskScore !== null && severity && (
            <Card className="bg-muted/30 border-muted">
              <CardHeader>
                <CardTitle className="text-lg">6. Calculated Preview</CardTitle>
                <CardDescription>
                  Preview only — the backend will calculate the official score after submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Risk Score</p>
                    <p className="text-3xl font-semibold">{riskScore}</p>
                    <p className="text-xs text-muted-foreground">
                      Likelihood ({formData.likelihood}) × Impact ({formData.impact})
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Severity</p>
                    <Badge className={`${severity.color} text-sm px-3 py-1`}>
                      {severity.label}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {severity.label === "Critical" && "Score 20–25"}
                      {severity.label === "High" && "Score 12–19"}
                      {severity.label === "Medium" && "Score 5–11"}
                      {severity.label === "Low" && "Score 1–4"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Panels Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Section 7: D2 Backend Mapping Info Panel */}
            <Card className="bg-muted/20 border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Backend Mapping (D2)
                </CardTitle>
                <CardDescription className="text-xs">
                  Fields added automatically after submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Risk ID</li>
                  <li>• Timestamp</li>
                  <li>• Date last updated</li>
                  <li>• Risk score (calculated)</li>
                  <li>• Severity (calculated)</li>
                  <li>• Intake SLA due date</li>
                  <li>• Assigned risk owner</li>
                  <li>• Treatment status: Not Started</li>
                  <li>• Review date</li>
                  <li>• Source: Vercel Intake Form</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 8: SLA Guidance Panel */}
            <Card className="bg-muted/20 border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  SLA Guidance
                </CardTitle>
                <CardDescription className="text-xs">
                  Acknowledgment timelines by severity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-xs space-y-2">
                  <li className="flex items-center gap-2">
                    <Badge className="bg-severity-critical text-white text-[10px] px-2">Critical</Badge>
                    <span className="text-muted-foreground">Acknowledged within 24 hours</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge className="bg-severity-high text-white text-[10px] px-2">High</Badge>
                    <span className="text-muted-foreground">Acknowledged within 2 business days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge className="bg-severity-medium text-foreground text-[10px] px-2">Medium</Badge>
                    <span className="text-muted-foreground">Acknowledged within 5 business days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge className="bg-severity-low text-white text-[10px] px-2">Low</Badge>
                    <span className="text-muted-foreground">Reviewed during next quarterly review</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Section 9: Ownership Guidance Panel */}
          <Card className="bg-muted/20 border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Ownership Guidance
              </CardTitle>
              <CardDescription className="text-xs">
                Risk ownership is assigned automatically after submission based on risk category and asset type.
                Submitters do not choose the owner.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                <div className="bg-background/50 rounded p-2">
                  <p className="font-medium text-foreground">Cybersecurity</p>
                  <p className="text-muted-foreground">+ M365 / VPN / logging / backups → IT Lead</p>
                </div>
                <div className="bg-background/50 rounded p-2">
                  <p className="font-medium text-foreground">Third-Party</p>
                  <p className="text-muted-foreground">+ vendor system → Vendor Manager</p>
                </div>
                <div className="bg-background/50 rounded p-2">
                  <p className="font-medium text-foreground">Regulatory/Compliance</p>
                  <p className="text-muted-foreground">→ GRC Lead</p>
                </div>
                <div className="bg-background/50 rounded p-2">
                  <p className="font-medium text-foreground">Operational</p>
                  <p className="text-muted-foreground">→ COO Delegate</p>
                </div>
                <div className="bg-background/50 rounded p-2">
                  <p className="font-medium text-foreground">Physical &amp; Environmental</p>
                  <p className="text-muted-foreground">→ Facilities Manager</p>
                </div>
                <div className="bg-background/50 rounded p-2">
                  <p className="font-medium text-foreground">People &amp; Culture</p>
                  <p className="text-muted-foreground">→ HR Lead</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 10: Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Submit Risk for Review
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                By submitting, you confirm that the information provided is accurate to the best of your knowledge.
              </p>
            </CardContent>
          </Card>
        </form>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pt-4 pb-8 border-t border-border">
          <p>NorthStar Financial Services — Cybersecurity Risk Management Program</p>
          <p className="mt-1">For questions, contact the GRC team at grc@northstar.ca</p>
        </footer>
      </div>
    </div>
  );
}

export default function Page() {
  return <RiskIntakeForm />
}