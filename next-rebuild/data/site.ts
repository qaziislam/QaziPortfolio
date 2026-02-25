export type ProofMetric = {
  label: string;
  value: string;
  detail: string;
};

export type CaseStudy = {
  title: string;
  impact: string;
  summary: string;
  image: string;
  tags: string[];
};

export const proofMetrics: ProofMetric[] = [
  { label: "Campaign Ops", value: "$4M+/MO", detail: "Managed revenue-op systems at scale" },
  { label: "Client Surface", value: "500+", detail: "Cross-industry delivery and retention" },
  { label: "Audience", value: "112K+", detail: "Community and distribution footprint" }
];

export const caseStudies: CaseStudy[] = [
  {
    title: "Movement Narrative Engine",
    impact: "High-volume campaign execution under rapid media cycles",
    summary:
      "Built a system for field capture, social distribution, and message continuity across live civic moments.",
    image: "/images/case-01.jpg",
    tags: ["Direction", "Production Ops", "Distribution"]
  },
  {
    title: "Brand Performance Studio",
    impact: "Creative + operations blend for conversion-focused campaigns",
    summary:
      "Shipped multi-channel creative systems with stronger launch rhythm, clearer attribution, and scalable handoff.",
    image: "/images/case-02.jpg",
    tags: ["Creative Ops", "Performance", "System Design"]
  },
  {
    title: "Documentary Credibility Layer",
    impact: "Long-form narrative anchored with public record and press",
    summary:
      "Produced story architecture that balances emotional gravity with evidentiary proof and publication outcomes.",
    image: "/images/case-03.jpg",
    tags: ["Film", "Narrative", "Credibility"]
  }
];
