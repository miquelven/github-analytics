import { GithubRepo } from "@/types/github";
import type { CsvRow } from "@/types/export";

export const downloadCSV = (data: CsvRow[], filename: string) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((obj) =>
    Object.values(obj)
      .map((value) => {
        if (typeof value === "string") {
          // Escape quotes and commas
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(",")
  );

  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportReposToCSV = (repos: GithubRepo[], username: string) => {
  const data = repos.map((repo) => ({
    Name: repo.name,
    Description: repo.description || "",
    Language: repo.language || "Unknown",
    Stars: repo.stargazers_count,
    Forks: repo.forks_count,
    "Created At": repo.created_at,
    "Updated At": repo.updated_at,
    URL: repo.html_url,
  }));
  downloadCSV(data, `${username}-repos`);
};

export const exportToPDF = () => {
  window.print();
};

export const exportChartToPNG = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  const svg = element.querySelector("svg");
  if (!svg) {
    console.error("SVG not found in element");
    return;
  }

  // Get SVG data
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);

  // Add namespaces if missing
  const sourceWithNs = !source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/) 
    ? source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"') 
    : source;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  // Set canvas size based on SVG size
  const svgRect = svg.getBoundingClientRect();
  const scale = 2; // For better resolution
  canvas.width = svgRect.width * scale;
  canvas.height = svgRect.height * scale;

  // Create Blob URL
  const svgBlob = new Blob([sourceWithNs], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    if (ctx) {
      // Fill background with white (since PNG handles transparency, but charts look better with bg)
      // Actually, let's check theme. But for export white is safer for printing/reports.
      // Or use transparency if preferred. Let's use transparency for now, or theme background?
      // Recharts SVGs usually don't have background rect.
      // Let's assume transparent is fine, or maybe fill with white for visibility.
      // User probably wants white background for report.
      // But dark mode?
      // Let's leave transparent/theme dependent.
      // Actually, if dark mode is on, text is white. White background will make text invisible.
      // We should probably force a background color matching the theme or just keep it transparent.
      // Let's use the computed background color of the card.
      const computedStyle = window.getComputedStyle(element);
      ctx.fillStyle = computedStyle.backgroundColor || "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      
      URL.revokeObjectURL(url);
      
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  img.onerror = (e) => {
    console.error("Error loading SVG image", e);
  };

  img.src = url;
};
