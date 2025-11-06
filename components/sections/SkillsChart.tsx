"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis, Cell } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Skill {
  name: string | null;
  category: string | null;
  proficiency: string | null;
  percentage: number | null;
  yearsOfExperience: number | null;
  color: string | null;
}

interface SkillsChartProps {
  skills: Skill[];
}

export function SkillsChart({ skills }: SkillsChartProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  const groupedSkills = new Map<string, Skill[]>();
  for (const skill of skills) {
    const category = skill.category || "other";
    const existing = groupedSkills.get(category) || [];
    groupedSkills.set(category, [...existing, skill]);
  }

  const categoryColor = (cat: string) => {
    const map: Record<string, string> = {
      "ai-ml": "#9333EA", // purple-600 - IA & Machine Learning
      "ai ml": "#9333EA",
      automation: "#8B5CF6", // purple-500 - Automation tools
      backend: "#6366F1", // indigo-500 - Backend dev
      frontend: "#10B981", // emerald-500 - Frontend dev
      api: "#06B6D4", // cyan-500 - APIs & Integrations
      database: "#F59E0B", // amber-500 - Databases
      cloud: "#3B82F6", // blue-500 - Cloud platforms
      devops: "#EF4444", // red-500 - DevOps & CI/CD
      tools: "#6366F1", // indigo-500 - Tools
      "low-code": "#7C3AED", // purple-600 - Low-code platforms
      design: "#EC4899", // pink-500 - Design
      testing: "#14B8A6", // teal-500 - Testing
    };
    const key = cat.toLowerCase();
    return map[key] || "#9333EA";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from(groupedSkills.entries()).map(([category, categorySkills]) => {
        if (!categorySkills || categorySkills.length === 0) return null;

        const displayLabel = category
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        const baseColor = categoryColor(category);
        const chartData = categorySkills.map((skill) => ({
          name: skill.name || "Unknown",
          proficiency: skill.percentage || 0,
          fill: skill.color || baseColor,
        }));

        const chartConfig = {
          proficiency: {
            label: "Proficiency",
            color: baseColor,
          },
          default: {
            color: baseColor,
          },
        } satisfies ChartConfig;

        const chartHeight = Math.max(140, categorySkills.length * 32);

        return (
          <div
            key={category}
            className="group rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
          >
            <div className="border-b bg-muted/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{displayLabel}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {categorySkills.length}
                </span>
              </div>
            </div>

            <div className="p-4">
              <ChartContainer
                id={`skills-chart-${category}`}
                config={chartConfig}
                className="w-full"
                style={{ height: `${chartHeight}px` }}
              >
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  layout="vertical"
                  margin={{ left: 0, right: 28, top: 5, bottom: 5 }}
                >
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    width={85}
                    className="text-xs"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" nameKey="proficiency" labelFormatter={(value) => value} />}
                  />
                  <Bar dataKey="proficiency" radius={[0, 6, 6, 0]} barSize={18}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={String(entry.fill)} />
                    ))}
                    <LabelList
                      dataKey="proficiency"
                      position="right"
                      offset={4}
                      className="fill-foreground text-[10px] font-medium"
                      formatter={(value: number) => `${value}%`}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}
