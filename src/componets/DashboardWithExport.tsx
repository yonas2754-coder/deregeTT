"use client";

import * as React from "react";
// Fluent UI v9 Imports
import {
    Button,
    Title1, 
    Caption1, 
    Spinner,
    makeStyles,
    tokens,
    shorthands,
    Card, 
} from "@fluentui/react-components";
import { CloudArrowDown24Regular } from "@fluentui/react-icons";
import PptxGenJS from "pptxgenjs";
import { DashboardCharts } from "./ChartComponents"; // Assumed

// --- Branding & Configuration ---
const BRAND_COLOR_PRIMARY = tokens.colorPaletteGreenForeground1;
const BRAND_COLOR_DARK = "#004B50"; // Dark teal/slate for contrast and professionalism
const NEUTRAL_DARK = tokens.colorNeutralForeground1;

// 🚀 Professional Typography Change: The title and period are now styled together
const REPORT_TITLE = "FSASS Task Analytics Report";
const REPORT_PERIOD_TEXT = "From Oct 27 - Nov 2, 2025 (Week 43)";
const FOOTER_TEXT = "Ethio Telecom | FSAS&S Section";

const CHART_INFO = [
    {
        key: "historyLine",
        title: "1. Historical Daily Task Volume",
        description: "Shows daily task volumes and trends over the week.",
    },
    {
        key: "handlerBar",
        title: "2. Handler Performance: Total Tasks",
        description: "Displays each handler’s total tasks completed in the week.",
    },
    {
        key: "taskDoughnut",
        title: "3. Task Classification Distribution",
        description: "Illustrates the proportion of task types in the week.",
    },
    {
        key: "zonalBar",
        title: "4. Task Volume by Zone/Region",
        description: "Compares task counts across different zones/regions.",
    },
] as const;

// --- STYLING (Enterprise Level) ---
const useStyles = makeStyles({
    pageWrapper: {
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalL),
        minHeight: "100vh",
    },
    headerBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: tokens.spacingVerticalXL,
    },
    rightControls: {
        display: "flex",
        gap: tokens.spacingHorizontalS,
        alignItems: "center",
    },
    dashboardCard: {
        ...shorthands.padding(0, 0),
        boxShadow: tokens.shadow16,
    },
    // Professional Typography: Neutral gray for secondary text
    subtitleText: {
        color: tokens.colorNeutralForeground2, 
    },
    // Style for the main report title to use the dark brand color
    reportTitle: {
        color: BRAND_COLOR_DARK, 
        fontWeight: tokens.fontWeightSemibold,
    },
    // Container for Title and Period to manage professional stacking/spacing
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        // Ensure proper spacing above the title
        ...shorthands.margin(tokens.spacingVerticalS, 0),
    }
});

type ChartImageMap = {
    historyLine?: string;
    handlerBar?: string;
    taskDoughnut?: string;
    zonalBar?: string;
};

// Utility function to load the logo (kept as is)
async function loadLogoAsBase64(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}

export const DashboardWithExport: React.FC = () => {
    const styles = useStyles();
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [logoBase64, setLogoBase64] = React.useState<string | null>(null);

    // Load logo on mount
    React.useEffect(() => {
        loadLogoAsBase64("/photoDagm3.png")
            .then(setLogoBase64)
            .catch((e) => {
                console.warn("Failed to load logo: /photoDagm3.png. Using placeholder.", e);
                setLogoBase64(null);
            });
    }, []);

    const captureCanvasesAsBase64 = async (): Promise<ChartImageMap> => {
        if (!containerRef.current) return {};

        let canvases = Array.from(
            containerRef.current.querySelectorAll<HTMLCanvasElement>("canvas")
        );

        // Wait a bit if charts haven't fully rendered 
        if (canvases.length < CHART_INFO.length) {
            await new Promise((r) => setTimeout(r, 600));
            canvases = Array.from(
                containerRef.current.querySelectorAll<HTMLCanvasElement>("canvas")
            );
        }

        const result: ChartImageMap = {};
        const keys = CHART_INFO.map((c) => c.key) as (keyof ChartImageMap)[];

        canvases.forEach((canvas, idx) => {
            const key = keys[idx];
            if (key) {
                try {
                    if (canvas.width > 0 && canvas.height > 0) {
                        result[key] = canvas.toDataURL("image/png");
                    } else {
                        console.warn(`Canvas for key ${key} has zero dimensions and cannot be exported.`);
                    }
                } catch (err) {
                    console.warn(`Canvas toDataURL failed for key ${key}:`, err);
                }
            }
        });

        return result;
    };


    const generateBrandedPptx = async (chartsData: ChartImageMap) => {
        const pptx = new PptxGenJS();
        pptx.layout = "LAYOUT_WIDE";
        const slideWidth = 10; 
        const footerY = 5.06;
        const chartGapBottom = 0.2;
        const brandColorHex = BRAND_COLOR_PRIMARY.slice(1);
        const brandDarkHex = BRAND_COLOR_DARK.slice(1);
        const neutralDarkHex = NEUTRAL_DARK.slice(1);

        // Master slide for Enterprise Look
        pptx.defineSlideMaster({
            title: "ETHIO_MASTER",
            bkgd: "FFFFFF",
            objects: [
                // Footer strip
                { rect: { x: 0, y: "90%", w: "100%", h: "10%", fill: { color: brandColorHex } } },
                // Footer text
                { text: { text: FOOTER_TEXT, options: { x: 2.5, y: "92%", color: "FFFFFF", fontSize: 10, fontFace: "Segoe UI" } } },
                { text: { text: new Date().toLocaleDateString(), options: { x: 0.5, y: "92%", color: "FFFFFF", fontSize: 10, fontFace: "Segoe UI" } } },
            ],
        });

        // Title slide
        const titleSlide = pptx.addSlide({ masterName: "ETHIO_MASTER" });
        if(logoBase64) {
            titleSlide.addImage({ data: logoBase64, x: 0.3, y: 0.3, w: 1.62, h: 0.43 });
        }
        
        // Report Title (Prominent)
        titleSlide.addText(REPORT_TITLE, { 
            x: 0.5, y: 1.6, w: "90%", fontSize: 32, 
            color: brandDarkHex, bold: true, align: "center", fontFace: "Segoe UI" 
        });
        
        // Report Period (Formal)
        titleSlide.addText(REPORT_PERIOD_TEXT, { 
            x: 0.5, y: 3.2, w: "90%", fontSize: 20, 
            color: neutralDarkHex, align: "center", fontFace: "Segoe UI" 
        });

        // Chart slides
        CHART_INFO.forEach((info) => {
            const img = chartsData[info.key as keyof ChartImageMap];
            if (!img) return;

            const slide = pptx.addSlide({ masterName: "ETHIO_MASTER" });

            // Logo top-left
            if(logoBase64) {
                slide.addImage({ data: logoBase64, x: 0.3, y: 0.3, w: 1.62, h: 0.43 });
            }

            // Title & description
            const titleY = 1.0;
            // Title (Bold, uses BRAND_COLOR_DARK)
            slide.addText(info.title, { 
                x: 0.5, y: titleY, w: "90%", fontSize: 26, bold: true, 
                color: brandDarkHex, fontFace: "Segoe UI" 
            });
            // Description (Smaller, uses NEUTRAL_DARK)
            slide.addText(info.description, { 
                x: 0.5, y: titleY + 0.5, w: "90%", fontSize: 16, 
                color: neutralDarkHex, fontFace: "Segoe UI" 
            });

            // Compute chart size
            const chartTop = titleY + 1.2;
            const chartHeight = footerY - chartTop - chartGapBottom;
            const chartWidth = chartHeight * (16 / 9); 
            const chartX = (slideWidth - chartWidth) / 2; 

            slide.addImage({ data: img, x: chartX, y: chartTop, w: chartWidth, h: chartHeight });
        });

        // Summary slide
        const exportedCount = CHART_INFO.filter(c => chartsData[c.key as keyof ChartImageMap]).length;
        const summarySlide = pptx.addSlide({ masterName: "ETHIO_MASTER" });
        if(logoBase64) {
            summarySlide.addImage({ data: logoBase64, x: 0.3, y: 0.3, w: 1.62, h: 0.43 });
        }
        
        summarySlide.addText("Summary & Insights", { 
            x: 0.5, y: 1.2, w: "90%", fontSize: 28, bold: true, 
            color: brandDarkHex, align: "center", fontFace: "Segoe UI" 
        });
        
        summarySlide.addText(
            `Charts Exported: ${exportedCount} / ${CHART_INFO.length}\n\n- Please review each slide for detailed visuals.\n- Suggested next steps: share with stakeholders and include action items.`,
            { x: 1.0, y: 2.5, w: 8.0, h: 3.0, fontSize: 16, color: neutralDarkHex, fontFace: "Segoe UI" }
        );
        
        summarySlide.addText("Thank You!", { 
            x: 0, y: 6.6, w: "100%", fontSize: 28, bold: true, 
            color: brandDarkHex, align: "center", fontFace: "Segoe UI" 
        });

        await pptx.writeFile({ fileName: "FSASS_Task_Analytics_Report.pptx" });
    };

    const handleExport = async () => {
        if (!containerRef.current) {
            alert("Charts container not found.");
            return;
        }

        setIsGenerating(true);
        try {
            const chartsData = await captureCanvasesAsBase64();
            const exportedCount = CHART_INFO.filter(c => chartsData[c.key as keyof ChartImageMap]).length;
            
            if (exportedCount === 0) {
                alert("No chart canvases with valid data were found. Please ensure charts are rendered.");
                return;
            }
            
            await generateBrandedPptx(chartsData);
        } catch (err) {
            console.error("Export error:", err);
            alert("Failed to export PPTX. Check console for details.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.headerBar}>
                <div className={styles.titleContainer}>
                    {/* Professional Typography: Use Title1 for the main report title */}
                    <Title1 className={styles.reportTitle}>{REPORT_TITLE}</Title1>
                    {/* Use Caption1 for the period for a formal, secondary look */}
                    <Caption1 className={styles.subtitleText}>{REPORT_PERIOD_TEXT}</Caption1>
                </div>
                <div className={styles.rightControls}>
                    {/* Removed "Refresh Data" button for dynamic data assumption */}
                    <Button
                        appearance="primary"
                        onClick={handleExport}
                        disabled={isGenerating}
                        icon={isGenerating ? <Spinner size="tiny" /> : <CloudArrowDown24Regular />}
                    >
                        {isGenerating ? "Generating Report..." : "Generate Branded PPTX Report"}
                    </Button>
                </div>
            </div>

            {/* Use Fluent UI Card for a professional, elevated look around the content */}
            <Card className={styles.dashboardCard} ref={containerRef}>
                <DashboardCharts />
            </Card>
        </div>
    );
};

export default DashboardWithExport;