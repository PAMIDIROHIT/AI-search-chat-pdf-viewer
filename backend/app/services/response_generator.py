"""
Mock Response Generator Service.
Generates streaming AI responses with citations, tool calls, and generative UI components.
"""

import asyncio
import json
import random
from typing import AsyncGenerator, List, Dict, Optional
from ..models.schemas import Citation, ToolCall, StreamEvent


class ResponseGenerator:
    """
    Service for generating mock AI responses with streaming.
    Simulates AI behavior with tool calls, citations, and generative UI.
    """
    
    # Sample responses with citation placeholders and UI components
    MOCK_RESPONSES = [
        {
            "topic": "climate",
            "response": """Based on my analysis of the documents, I can provide you with comprehensive information about climate change.

According to the research data [1], global temperatures have risen significantly over the past century. The evidence shows an increase of approximately 1.1°C since the pre-industrial era, which is primarily attributed to human activities such as burning fossil fuels and deforestation.

Studies indicate [2] that renewable energy adoption is accelerating worldwide. Solar and wind power capacity has grown by over 45% in the last five years, making clean energy increasingly cost-competitive with traditional fossil fuels.

The data analysis reveals [3] that carbon reduction efforts are showing positive results in several regions. Countries implementing comprehensive climate policies have achieved measurable decreases in their carbon footprints, demonstrating that effective action is possible.""",
            "citations": [
                Citation(
                    id=1,
                    document="climate_research.pdf",
                    page=3,
                    text_snippet="Global average temperatures have increased by approximately 1.1°C since the pre-industrial era, with the rate of warming accelerating in recent decades.",
                    relevance_score=0.95
                ),
                Citation(
                    id=2,
                    document="climate_research.pdf",
                    page=7,
                    text_snippet="Renewable energy capacity has grown exponentially, with solar and wind power installations increasing by 45% over the past five years.",
                    relevance_score=0.88
                ),
                Citation(
                    id=3,
                    document="climate_research.pdf",
                    page=12,
                    text_snippet="Countries with comprehensive climate policies have achieved significant reductions in carbon emissions, proving the effectiveness of coordinated action.",
                    relevance_score=0.82
                )
            ],
            "ui_components": [
                {
                    "type": "info_card",
                    "data": {
                        "title": "Climate Statistics",
                        "icon": "🌡️",
                        "items": [
                            {"label": "Temperature Rise", "value": "+1.1°C"},
                            {"label": "Renewable Growth", "value": "+45%"},
                            {"label": "Policy Adoption", "value": "142 countries"}
                        ]
                    }
                },
                {
                    "type": "stat_card",
                    "data": {
                        "label": "Carbon Emissions Reduced",
                        "value": "12.5 GT",
                        "change": -8,
                        "icon": "📉"
                    }
                }
            ]
        },
        {
            "topic": "technology",
            "response": """I've analyzed the available documents to answer your question about artificial intelligence and technology trends.

The research indicates [1] that machine learning models have achieved remarkable progress in recent years. Deep learning architectures have revolutionized fields from natural language processing to computer vision, enabling capabilities that were previously thought impossible.

According to industry analysis [2], the adoption of AI in enterprise applications is growing rapidly. Companies are increasingly leveraging AI for automation, decision-making, and customer experience enhancement, with projected market growth exceeding $500 billion by 2025.

Technical documentation shows [3] that responsible AI development is becoming a key focus area. Organizations are implementing governance frameworks to ensure ethical AI deployment, addressing concerns around bias, transparency, and accountability.""",
            "citations": [
                Citation(
                    id=1,
                    document="ai_technology.pdf",
                    page=5,
                    text_snippet="Deep learning models have achieved breakthrough performance across multiple domains, with transformer architectures enabling unprecedented capabilities in language understanding.",
                    relevance_score=0.92
                ),
                Citation(
                    id=2,
                    document="ai_technology.pdf",
                    page=15,
                    text_snippet="Enterprise AI adoption is projected to grow at a CAGR of 38%, with the global market expected to exceed $500 billion by 2025.",
                    relevance_score=0.85
                ),
                Citation(
                    id=3,
                    document="ai_technology.pdf",
                    page=22,
                    text_snippet="Responsible AI frameworks are being adopted by leading organizations to ensure ethical deployment, with focus on bias mitigation and transparency.",
                    relevance_score=0.79
                )
            ],
            "ui_components": [
                {
                    "type": "data_table",
                    "data": {
                        "title": "AI Market Growth",
                        "headers": ["Year", "Market Size", "Growth %"],
                        "rows": [
                            ["2023", "$150B", "+32%"],
                            ["2024", "$210B", "+40%"],
                            ["2025", "$500B", "+138%"]
                        ]
                    }
                },
                {
                    "type": "progress_card",
                    "data": {
                        "label": "AI Adoption Rate",
                        "current": 72,
                        "total": 100,
                        "unit": "%"
                    }
                }
            ]
        },
        {
            "topic": "default",
            "response": """Thank you for your question. I've searched through the available documents to provide you with relevant information.

Based on my research [1], I found several key insights that address your query. The documentation provides comprehensive coverage of this topic with detailed explanations and examples.

Further analysis [2] reveals additional context that may be helpful. The sources contain well-documented information that supports the main findings and provides deeper understanding.

The evidence suggests [3] that there are multiple perspectives to consider. Review of the materials indicates thorough research has been conducted on this subject matter.""",
            "citations": [
                Citation(
                    id=1,
                    document="research_paper.pdf",
                    page=2,
                    text_snippet="This comprehensive study examines the key factors and provides detailed analysis of the subject matter with supporting evidence.",
                    relevance_score=0.88
                ),
                Citation(
                    id=2,
                    document="research_paper.pdf",
                    page=8,
                    text_snippet="Additional research supports these findings, with multiple studies confirming the primary conclusions and extending the analysis.",
                    relevance_score=0.82
                ),
                Citation(
                    id=3,
                    document="research_paper.pdf",
                    page=14,
                    text_snippet="The evidence base for these conclusions is robust, with peer-reviewed sources providing validation of the key findings.",
                    relevance_score=0.75
                )
            ],
            "ui_components": [
                {
                    "type": "info_card",
                    "data": {
                        "title": "Research Summary",
                        "icon": "📚",
                        "items": [
                            {"label": "Documents Analyzed", "value": 3},
                            {"label": "Key Findings", "value": 12},
                            {"label": "Confidence Score", "value": "85%"}
                        ]
                    }
                }
            ]
        }
    ]
    
    # Tool calls to simulate during response generation
    TOOL_CALLS = [
        ToolCall(tool="thinking", status="running", message="Analyzing your question..."),
        ToolCall(tool="searching_documents", status="running", message="Searching through available documents..."),
        ToolCall(tool="retrieving_pdf", status="running", message="Retrieving relevant PDF sections..."),
        ToolCall(tool="analyzing_content", status="running", message="Analyzing content for relevant information..."),
        ToolCall(tool="generating_response", status="running", message="Generating comprehensive response..."),
    ]
    
    def __init__(self, stream_delay: float = 0.02):
        """
        Initialize response generator.
        
        Args:
            stream_delay: Delay between streaming chunks (seconds)
        """
        self.stream_delay = stream_delay
    
    def _select_response(self, query: str) -> Dict:
        """
        Select appropriate mock response based on query content.
        
        Args:
            query: User's question
            
        Returns:
            Mock response dictionary
        """
        query_lower = query.lower()
        
        if any(word in query_lower for word in ["climate", "environment", "carbon", "renewable", "temperature"]):
            return self.MOCK_RESPONSES[0]
        elif any(word in query_lower for word in ["ai", "technology", "machine learning", "artificial", "software"]):
            return self.MOCK_RESPONSES[1]
        else:
            return self.MOCK_RESPONSES[2]
    
    async def generate_stream(self, query: str) -> AsyncGenerator[str, None]:
        """
        Generate streaming response with tool calls, citations, and UI components.
        
        Args:
            query: User's question
            
        Yields:
            SSE-formatted JSON strings
        """
        response_data = self._select_response(query)
        response_text = response_data["response"]
        citations = response_data["citations"]
        ui_components = response_data.get("ui_components", [])
        
        # Track which citations have been sent
        sent_citations = set()
        
        # Phase 1: Simulate tool calls
        for i, tool_call in enumerate(self.TOOL_CALLS):
            event = StreamEvent(
                type="tool_call",
                tool_call=tool_call
            )
            yield f"data: {event.model_dump_json()}\n\n"
            
            # Simulate tool execution time
            await asyncio.sleep(random.uniform(0.3, 0.6))
            
            # Mark tool as completed
            completed_tool = ToolCall(
                tool=tool_call.tool,
                status="completed",
                message=f"{tool_call.message.replace('...', '')} complete."
            )
            event = StreamEvent(
                type="tool_call",
                tool_call=completed_tool
            )
            yield f"data: {event.model_dump_json()}\n\n"
            await asyncio.sleep(0.1)
        
        # Phase 2: Stream UI components first (before text)
        for ui_component in ui_components:
            event = StreamEvent(
                type="ui_component",
                component_type=ui_component["type"],
                component_data=ui_component["data"]
            )
            yield f"data: {event.model_dump_json()}\n\n"
            await asyncio.sleep(0.3)
        
        # Phase 3: Stream response text character by character
        buffer = ""
        i = 0
        while i < len(response_text):
            char = response_text[i]
            buffer += char
            
            # Check for citation pattern [N]
            if char == '[' and i + 2 < len(response_text):
                # Look ahead for citation pattern
                remaining = response_text[i:]
                if remaining[1].isdigit() and remaining[2] == ']':
                    citation_num = int(remaining[1])
                    
                    # Stream the citation bracket
                    for c in remaining[:3]:
                        event = StreamEvent(type="text_chunk", content=c)
                        yield f"data: {event.model_dump_json()}\n\n"
                        await asyncio.sleep(self.stream_delay)
                    
                    i += 3
                    buffer = ""
                    
                    # Send citation event if not already sent
                    if citation_num not in sent_citations:
                        for citation in citations:
                            if citation.id == citation_num:
                                event = StreamEvent(
                                    type="citation",
                                    citation=citation
                                )
                                yield f"data: {event.model_dump_json()}\n\n"
                                sent_citations.add(citation_num)
                                await asyncio.sleep(0.1)
                                break
                    continue
            
            # Stream regular character
            event = StreamEvent(type="text_chunk", content=char)
            yield f"data: {event.model_dump_json()}\n\n"
            await asyncio.sleep(self.stream_delay)
            i += 1
        
        # Phase 4: Send completion event
        complete_event = StreamEvent(
            type="complete",
            content=response_text
        )
        yield f"data: {complete_event.model_dump_json()}\n\n"


# Global instance
response_generator = ResponseGenerator()
