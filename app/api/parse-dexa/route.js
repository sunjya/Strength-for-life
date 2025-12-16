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
1. Arm lean mass - look for "Arms", "Arm Lean", or sum of left + right arm lean tissue (in kg)
2. Leg lean mass - look for "Legs", "Leg Lean", or sum of left + right leg lean tissue (in kg)
3. Height (in cm or inches)
4. Age if available
5. Gender/Sex if available
6. Total body fat percentage (look for "Total" or "Whole Body" fat %)
7. Date of scan (MM/DD/YYYY format if possible)

Return ONLY valid JSON in this exact format with no other text:
{
  "armLeanMassKg": number,
  "legLeanMassKg": number,
  "heightCm": number,
  "age": number,
  "gender": "male" or "female",
  "totalBodyFatPercent": number,
  "date": "MM/DD/YYYY"
}

Important:
- Convert any values in grams to kg (divide by 1000)
- Convert any values in lbs to kg (divide by 2.205)
- Sum left and right limbs for total arm/leg values
- If you cannot find a value, use null
- Be precise with numbers - include decimals if shown.`
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
