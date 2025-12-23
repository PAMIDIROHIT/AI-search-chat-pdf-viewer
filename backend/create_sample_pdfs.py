"""
Sample PDF Generator.
Creates test PDF files for the citation viewer demo.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_JUSTIFY
import os

# Ensure the data/pdfs directory exists
os.makedirs("data/pdfs", exist_ok=True)


def create_climate_research_pdf():
    """Create a sample climate research PDF."""
    doc = SimpleDocTemplate(
        "data/pdfs/climate_research.pdf",
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='Justify',
        parent=styles['Normal'],
        alignment=TA_JUSTIFY,
        spaceAfter=12
    ))
    
    story = []
    
    # Title
    story.append(Paragraph("Climate Change Research Report", styles['Title']))
    story.append(Spacer(1, 0.5*inch))
    
    # Page 1-2 content
    story.append(Paragraph("Executive Summary", styles['Heading1']))
    story.append(Paragraph(
        "This comprehensive report examines the current state of climate change research, "
        "analyzing global temperature trends, renewable energy adoption, and carbon reduction efforts. "
        "The findings presented here are based on extensive data collection and peer-reviewed studies.",
        styles['Justify']
    ))
    story.append(Spacer(1, 0.25*inch))
    
    # Page 3 content - Citation 1 target
    story.append(PageBreak())
    story.append(PageBreak())
    story.append(Paragraph("Chapter 1: Global Temperature Analysis", styles['Heading1']))
    story.append(Spacer(1, 0.25*inch))
    story.append(Paragraph(
        "Global average temperatures have increased by approximately 1.1°C since the pre-industrial era, "
        "with the rate of warming accelerating in recent decades. This warming trend is unprecedented in "
        "the historical record and is primarily attributed to anthropogenic greenhouse gas emissions.",
        styles['Justify']
    ))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph(
        "The analysis of temperature records from 1880 to present shows a clear upward trend, with the "
        "ten warmest years on record all occurring since 2010. Arctic regions have experienced the most "
        "dramatic warming, with temperatures rising at nearly twice the global average rate.",
        styles['Justify']
    ))
    
    # Pages 4-6
    story.append(PageBreak())
    story.append(Paragraph("Chapter 2: Impact Assessment", styles['Heading1']))
    story.append(Paragraph(
        "The impacts of rising temperatures are widespread and significant. Sea levels have risen by "
        "approximately 8-9 inches since 1880, with the rate of rise accelerating. Extreme weather events "
        "have become more frequent and intense, affecting communities worldwide.",
        styles['Justify']
    ))
    
    story.append(PageBreak())
    story.append(Paragraph("Chapter 3: Regional Analysis", styles['Heading1']))
    story.append(Paragraph(
        "Different regions are experiencing climate change in various ways. Coastal areas face increased "
        "flooding risks, while arid regions are experiencing more severe droughts. Agricultural zones are "
        "seeing shifts in growing seasons and crop viability.",
        styles['Justify']
    ))
    
    story.append(PageBreak())
    story.append(Paragraph("Chapter 4: Ocean Systems", styles['Heading1']))
    story.append(Paragraph(
        "Ocean temperatures have risen significantly, leading to coral bleaching events, changes in marine "
        "ecosystems, and alterations to ocean circulation patterns. Ocean acidification from absorbed CO2 "
        "poses additional threats to marine life.",
        styles['Justify']
    ))
    
    # Page 7 - Citation 2 target
    story.append(PageBreak())
    story.append(Paragraph("Chapter 5: Renewable Energy Transition", styles['Heading1']))
    story.append(Spacer(1, 0.25*inch))
    story.append(Paragraph(
        "Renewable energy capacity has grown exponentially, with solar and wind power installations "
        "increasing by 45% over the past five years. This growth has been driven by declining costs, "
        "supportive policies, and increasing corporate commitments to sustainability.",
        styles['Justify']
    ))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph(
        "Solar photovoltaic costs have decreased by over 90% since 2010, making solar power cost-competitive "
        "with fossil fuels in many markets. Wind energy has similarly seen dramatic cost reductions, "
        "particularly for offshore installations.",
        styles['Justify']
    ))
    
    # Pages 8-11
    story.append(PageBreak())
    story.append(Paragraph("Chapter 6: Technology Innovation", styles['Heading1']))
    story.append(Paragraph(
        "Advances in battery storage technology are enabling greater integration of renewable energy into "
        "power grids. Electric vehicle adoption is accelerating, with major automakers committing to "
        "all-electric lineups within the next decade.",
        styles['Justify']
    ))
    
    for i in range(3):
        story.append(PageBreak())
        story.append(Paragraph(f"Chapter {7+i}: Supporting Data", styles['Heading1']))
        story.append(Paragraph(
            f"This section contains additional supporting data and analysis for the research findings "
            f"presented in the main chapters. Data sources include satellite observations, ground-based "
            f"measurements, and computer modeling results.",
            styles['Justify']
        ))
    
    # Page 12 - Citation 3 target
    story.append(PageBreak())
    story.append(Paragraph("Chapter 10: Policy Effectiveness", styles['Heading1']))
    story.append(Spacer(1, 0.25*inch))
    story.append(Paragraph(
        "Countries with comprehensive climate policies have achieved significant reductions in carbon "
        "emissions, proving the effectiveness of coordinated action. The analysis shows that nations "
        "implementing carbon pricing, renewable energy mandates, and efficiency standards have seen "
        "measurable progress toward their climate goals.",
        styles['Justify']
    ))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph(
        "Case studies from the European Union, Nordic countries, and select Asian nations demonstrate "
        "that economic growth can be decoupled from emissions growth through effective policy frameworks. "
        "These success stories provide models for other nations seeking to address climate change.",
        styles['Justify']
    ))
    
    # Conclusion
    story.append(PageBreak())
    story.append(Paragraph("Conclusions and Recommendations", styles['Heading1']))
    story.append(Paragraph(
        "The evidence is clear that climate change is occurring and accelerating. However, the research "
        "also shows that effective solutions exist and are being implemented. Continued investment in "
        "renewable energy, improved energy efficiency, and coordinated policy action can address this "
        "global challenge.",
        styles['Justify']
    ))
    
    doc.build(story)
    print("Created: data/pdfs/climate_research.pdf")


def create_ai_technology_pdf():
    """Create a sample AI technology PDF."""
    doc = SimpleDocTemplate(
        "data/pdfs/ai_technology.pdf",
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='Justify',
        parent=styles['Normal'],
        alignment=TA_JUSTIFY,
        spaceAfter=12
    ))
    
    story = []
    
    # Title
    story.append(Paragraph("Artificial Intelligence Technology Report", styles['Title']))
    story.append(Spacer(1, 0.5*inch))
    
    # Introduction pages
    story.append(Paragraph("Introduction", styles['Heading1']))
    story.append(Paragraph(
        "This report provides a comprehensive overview of artificial intelligence technology, "
        "examining recent advances, enterprise adoption trends, and the growing focus on responsible AI development.",
        styles['Justify']
    ))
    
    for i in range(3):
        story.append(PageBreak())
        story.append(Paragraph(f"Background Section {i+1}", styles['Heading1']))
        story.append(Paragraph(
            "This section provides foundational context for understanding the current state of AI technology. "
            "The evolution of machine learning from basic statistical methods to sophisticated deep learning "
            "architectures has enabled unprecedented capabilities across multiple domains.",
            styles['Justify']
        ))
    
    # Page 5 - Citation 1 target
    story.append(PageBreak())
    story.append(Paragraph("Chapter 1: Deep Learning Advances", styles['Heading1']))
    story.append(Spacer(1, 0.25*inch))
    story.append(Paragraph(
        "Deep learning models have achieved breakthrough performance across multiple domains, with "
        "transformer architectures enabling unprecedented capabilities in language understanding. "
        "Large language models now demonstrate emergent abilities including reasoning, task generalization, "
        "and multi-step problem solving.",
        styles['Justify']
    ))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph(
        "Computer vision systems have reached and exceeded human-level performance on many benchmarks. "
        "Multi-modal models that combine vision and language understanding are opening new possibilities "
        "for AI applications across industries.",
        styles['Justify']
    ))
    
    # Supporting pages
    for i in range(9):
        story.append(PageBreak())
        story.append(Paragraph(f"Technical Deep Dive {i+1}", styles['Heading1']))
        story.append(Paragraph(
            "This section explores technical aspects of AI systems including architecture design, "
            "training methodologies, and optimization techniques. Understanding these fundamentals "
            "is essential for effective AI deployment.",
            styles['Justify']
        ))
    
    # Page 15 - Citation 2 target
    story.append(PageBreak())
    story.append(Paragraph("Chapter 5: Enterprise AI Adoption", styles['Heading1']))
    story.append(Spacer(1, 0.25*inch))
    story.append(Paragraph(
        "Enterprise AI adoption is projected to grow at a CAGR of 38%, with the global market expected "
        "to exceed $500 billion by 2025. Organizations across industries are implementing AI solutions "
        "for automation, analytics, and customer experience enhancement.",
        styles['Justify']
    ))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph(
        "Key adoption drivers include competitive pressure, labor shortages, and the demonstrated ROI "
        "of AI implementations. Companies reporting successful AI deployments cite improved efficiency, "
        "reduced costs, and enhanced decision-making capabilities.",
        styles['Justify']
    ))
    
    # More supporting pages
    for i in range(6):
        story.append(PageBreak())
        story.append(Paragraph(f"Industry Application {i+1}", styles['Heading1']))
        story.append(Paragraph(
            "AI applications are transforming industries from healthcare to finance to manufacturing. "
            "This section examines specific use cases and implementation strategies that have "
            "demonstrated measurable business value.",
            styles['Justify']
        ))
    
    # Page 22 - Citation 3 target
    story.append(PageBreak())
    story.append(Paragraph("Chapter 8: Responsible AI Development", styles['Heading1']))
    story.append(Spacer(1, 0.25*inch))
    story.append(Paragraph(
        "Responsible AI frameworks are being adopted by leading organizations to ensure ethical "
        "deployment, with focus on bias mitigation and transparency. Governance structures are "
        "being established to oversee AI development and deployment processes.",
        styles['Justify']
    ))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph(
        "Key principles of responsible AI include fairness, accountability, transparency, and privacy. "
        "Organizations are implementing audit processes, documentation standards, and stakeholder "
        "engagement practices to address AI ethics concerns.",
        styles['Justify']
    ))
    
    # Conclusion
    story.append(PageBreak())
    story.append(Paragraph("Conclusions", styles['Heading1']))
    story.append(Paragraph(
        "Artificial intelligence continues to advance rapidly, with transformative implications for "
        "business and society. Success in the AI era will require both technical excellence and "
        "commitment to responsible development practices.",
        styles['Justify']
    ))
    
    doc.build(story)
    print("Created: data/pdfs/ai_technology.pdf")


def create_research_paper_pdf():
    """Create a general research paper PDF."""
    doc = SimpleDocTemplate(
        "data/pdfs/research_paper.pdf",
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='Justify',
        parent=styles['Normal'],
        alignment=TA_JUSTIFY,
        spaceAfter=12
    ))
    
    story = []
    
    # Title
    story.append(Paragraph("General Research Paper", styles['Title']))
    story.append(Spacer(1, 0.5*inch))
    
    # Abstract
    story.append(Paragraph("Abstract", styles['Heading1']))
    story.append(Paragraph(
        "This research paper provides a comprehensive examination of the subject matter with "
        "detailed analysis and supporting evidence. The methodology employed ensures rigorous "
        "findings that contribute to the existing body of knowledge.",
        styles['Justify']
    ))
    
    # Page 2 - Citation 1 target
    story.append(PageBreak())
    story.append(Paragraph("Introduction", styles['Heading1']))
    story.append(Spacer(1, 0.25*inch))
    story.append(Paragraph(
        "This comprehensive study examines the key factors and provides detailed analysis of the "
        "subject matter with supporting evidence. The research builds upon previous work while "
        "introducing novel perspectives and methodological improvements.",
        styles['Justify']
    ))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph(
        "The importance of this research lies in its practical applications and theoretical contributions. "
        "By synthesizing multiple data sources and analytical approaches, we provide insights that "
        "advance understanding in this field.",
        styles['Justify']
    ))
    
    # Supporting pages
    for i in range(5):
        story.append(PageBreak())
        story.append(Paragraph(f"Methodology Section {i+1}", styles['Heading1']))
        story.append(Paragraph(
            "The research methodology employed in this study follows established best practices while "
            "incorporating innovative approaches where appropriate. Data collection, analysis, and "
            "validation procedures are documented in detail.",
            styles['Justify']
        ))
    
    # Page 8 - Citation 2 target
    story.append(PageBreak())
    story.append(Paragraph("Results and Analysis", styles['Heading1']))
    story.append(Spacer(1, 0.25*inch))
    story.append(Paragraph(
        "Additional research supports these findings, with multiple studies confirming the primary "
        "conclusions and extending the analysis. The convergence of evidence from diverse sources "
        "strengthens confidence in the results.",
        styles['Justify']
    ))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph(
        "Statistical analysis reveals significant patterns in the data that support the hypotheses. "
        "Effect sizes are meaningful and consistent across different subgroups analyzed in the study.",
        styles['Justify']
    ))
    
    # More supporting pages
    for i in range(5):
        story.append(PageBreak())
        story.append(Paragraph(f"Discussion Section {i+1}", styles['Heading1']))
        story.append(Paragraph(
            "The discussion section interprets the findings in the context of existing literature and "
            "theoretical frameworks. Implications for practice and policy are considered alongside "
            "suggestions for future research directions.",
            styles['Justify']
        ))
    
    # Page 14 - Citation 3 target
    story.append(PageBreak())
    story.append(Paragraph("Conclusions", styles['Heading1']))
    story.append(Spacer(1, 0.25*inch))
    story.append(Paragraph(
        "The evidence base for these conclusions is robust, with peer-reviewed sources providing "
        "validation of the key findings. The research contributes meaningfully to the field and "
        "opens avenues for continued investigation.",
        styles['Justify']
    ))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph(
        "Limitations of the current study are acknowledged, and future research directions are "
        "proposed to address gaps in understanding. The practical implications of the findings "
        "are discussed with recommendations for implementation.",
        styles['Justify']
    ))
    
    # References
    story.append(PageBreak())
    story.append(Paragraph("References", styles['Heading1']))
    story.append(Paragraph(
        "1. Smith, J. et al. (2023). Foundational Research Study. Journal of Research, 45(2), 123-145.",
        styles['Normal']
    ))
    story.append(Paragraph(
        "2. Johnson, A. & Williams, B. (2022). Comprehensive Analysis Methods. Academic Press.",
        styles['Normal']
    ))
    story.append(Paragraph(
        "3. Brown, C. (2024). Recent Developments in the Field. International Review, 12(1), 56-78.",
        styles['Normal']
    ))
    
    doc.build(story)
    print("Created: data/pdfs/research_paper.pdf")


if __name__ == "__main__":
    try:
        create_climate_research_pdf()
        create_ai_technology_pdf()
        create_research_paper_pdf()
        print("\n✅ All sample PDFs created successfully!")
    except ImportError:
        print("reportlab not installed. Creating placeholder text files instead...")
        
        # Create simple text placeholders
        os.makedirs("data/pdfs", exist_ok=True)
        
        with open("data/pdfs/README.txt", "w") as f:
            f.write("Sample PDF files would be created here.\n")
            f.write("Install reportlab: pip install reportlab\n")
            f.write("Then run: python create_sample_pdfs.py\n")
