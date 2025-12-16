import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { base64Data, mediaType, isPdf } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please add ANTHROPIC_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            isPdf ? {
              type: "document",
              source: { type: "base64", media_type: mediaType, data: base64Data }
            } : {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64Data }
            },
            {
              type: "text",
              text: `Extract DEXA scan body composition data from this ${isPdf ? 'document' : 'image/screenshot'}. I need:
1. Appendicular lean mass (arms + legs) - look for "ALM", "Appendicular", "Lean Mass" by region, or sum of left/right arm and leg lean tissue
2. Height (in cm or inches)
3. Total body fat percentage (look for "Total" or "Whole Body" fat %)
4. Date of scan (MM/DD/YYYY format if possible)

Return ONLY valid JSON in this exact format with no other text:
{
  "appendicularLeanMassKg": number,
  "heightCm": number,
  "bodyFatPercentage": number,
  "date": "MM/DD/YYYY"
}

If you cannot find a value, use null. Be precise with numbers - include decimals if shown.`
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `API error: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
    }

    return NextResponse.json(
      { error: 'Could not parse response from AI' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error parsing DEXA scan:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse DEXA scan' },
      { status: 500 }
    );
  }
}
