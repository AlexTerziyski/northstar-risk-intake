"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ShieldAlert, Upload, X, FileText } from "lucide-react"

const departments = [
  "Investment Management",
  "Client Services",
  "Operations & Technology",
]

const riskCategories = [
  "Cybersecurity",
  "Operational",
  "Regulatory/Compliance",
  "Third-Party",
  "Physical",
  "People & Culture",
]

const likelihoodOptions = [
  { value: "1", label: "1 - Very Low" },
  { value: "2", label: "2 - Low" },
  { value: "3", label: "3 - Moderate" },
  { value: "4", label: "4 - High" },
  { value: "5", label: "5 - Very High" },
]

const impactOptions = [
  { value: "1", label: "1 - Very Low" },
  { value: "2", label: "2 - Low" },
  { value: "3", label: "3 - Moderate" },
  { value: "4", label: "4 - High" },
  { value: "5", label: "5 - Critical" },
]

export function RiskIntakeForm() {
  const [formData, setFormData] = useState({
    submitterName: "",
    department: "",
    assetAffected: "",
    riskCategory: "",
    threatDescription: "",
    vulnerability: "",
    likelihood: "",
    impact: "",
    dateDiscovered: "",
    supportingEvidence: "",
    escalationContactNotified: false,
  })

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showEscalationField =
    formData.impact === "4" || formData.impact === "5"

  const handleInputChange = (
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted:", { ...formData, uploadedFile })
    alert("Risk submitted successfully!")
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance">
            Cybersecurity Risk Intake
          </h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            Submit potential risks for review by the security team
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Submitter Information Section */}
          <Card className="mb-6 border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium uppercase tracking-wide text-muted-foreground">
                Submitter Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="submitterName">Submitter Name</Label>
                  <Input
                    id="submitterName"
                    placeholder="Enter your full name"
                    value={formData.submitterName}
                    onChange={(e) =>
                      handleInputChange("submitterName", e.target.value)
                    }
                    required
                    className="bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      handleInputChange("department", value)
                    }
                    required
                  >
                    <SelectTrigger id="department" className="w-full bg-card">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Details Section */}
          <Card className="mb-6 border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium uppercase tracking-wide text-muted-foreground">
                Risk Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="assetAffected">Asset Affected</Label>
                  <Input
                    id="assetAffected"
                    placeholder="e.g., Trading Platform, Client Portal"
                    value={formData.assetAffected}
                    onChange={(e) =>
                      handleInputChange("assetAffected", e.target.value)
                    }
                    required
                    className="bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskCategory">Risk Category</Label>
                  <Select
                    value={formData.riskCategory}
                    onValueChange={(value) =>
                      handleInputChange("riskCategory", value)
                    }
                    required
                  >
                    <SelectTrigger id="riskCategory" className="w-full bg-card">
                      <SelectValue placeholder="Select risk category" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="threatDescription">Threat Description</Label>
                <Textarea
                  id="threatDescription"
                  placeholder="Describe the potential threat or risk scenario..."
                  value={formData.threatDescription}
                  onChange={(e) =>
                    handleInputChange("threatDescription", e.target.value)
                  }
                  required
                  rows={4}
                  className="bg-card resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vulnerability">Vulnerability</Label>
                <Textarea
                  id="vulnerability"
                  placeholder="Describe the vulnerability that could be exploited..."
                  value={formData.vulnerability}
                  onChange={(e) =>
                    handleInputChange("vulnerability", e.target.value)
                  }
                  required
                  rows={4}
                  className="bg-card resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Assessment Section */}
          <Card className="mb-6 border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium uppercase tracking-wide text-muted-foreground">
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="likelihood">Likelihood</Label>
                  <Select
                    value={formData.likelihood}
                    onValueChange={(value) =>
                      handleInputChange("likelihood", value)
                    }
                    required
                  >
                    <SelectTrigger id="likelihood" className="w-full bg-card">
                      <SelectValue placeholder="Select likelihood" />
                    </SelectTrigger>
                    <SelectContent>
                      {likelihoodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impact">Impact</Label>
                  <Select
                    value={formData.impact}
                    onValueChange={(value) =>
                      handleInputChange("impact", value)
                    }
                    required
                  >
                    <SelectTrigger id="impact" className="w-full bg-card">
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                    <SelectContent>
                      {impactOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateDiscovered">Date Discovered</Label>
                  <Input
                    id="dateDiscovered"
                    type="date"
                    value={formData.dateDiscovered}
                    onChange={(e) =>
                      handleInputChange("dateDiscovered", e.target.value)
                    }
                    required
                    className="bg-card"
                  />
                </div>
              </div>

              {/* Conditional Escalation Field */}
              {showEscalationField && (
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="escalationContactNotified"
                      checked={formData.escalationContactNotified}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "escalationContactNotified",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor="escalationContactNotified"
                      className="text-sm font-medium text-foreground cursor-pointer"
                    >
                      Escalation Contact Notified?
                    </Label>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground ml-6">
                    High/Critical impact risks require notification to the
                    escalation contact before submission.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Supporting Evidence Section */}
          <Card className="mb-8 border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium uppercase tracking-wide text-muted-foreground">
                Supporting Evidence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="supportingEvidence">
                  Additional Context (Optional)
                </Label>
                <Textarea
                  id="supportingEvidence"
                  placeholder="Provide any additional context, links, or references..."
                  value={formData.supportingEvidence}
                  onChange={(e) =>
                    handleInputChange("supportingEvidence", e.target.value)
                  }
                  rows={3}
                  className="bg-card resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>File Upload (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors bg-card">
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-6 h-6 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {uploadedFile.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag & drop a file here, or click to browse
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Browse Files
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="px-8 font-medium"
            >
              Submit Risk
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default function Page() {
  return <RiskIntakeForm />
}