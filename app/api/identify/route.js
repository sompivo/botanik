export async function POST(request) {
  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY nie je nastaveny" }, { status: 500 });
  }
  try {
    var body = await request.json();
    var image = body.image;
    if (!image) {
      return Response.json({ error: "Chyba obrazok" }, { status: 400 });
    }

    var prompt = [
      "You are a world-class botanist. Identify the houseplant in this photo.",
      "",
      "First, carefully analyze:",
      "- Leaf shape, size, color, texture, glossiness, edges",
      "- Stem type and growth pattern",
      "- Flowers if visible",
      "- Any distinctive features (holes, variegation, spines, aerial roots)",
      "",
      "Then respond with ONLY valid JSON (no markdown, no backticks, no extra text):",
      "{",
      '  "name": "Common name in Slovak",',
      '  "name_en": "Common name in English",',
      '  "latin": "Scientific/Latin name",',
      '  "confidence": "high or medium or low",',
      '  "description": "Brief description in Slovak, 1-2 sentences",',
      '  "watering": {',
      '    "direct_summer": number of days between watering,',
      '    "direct_winter": number,',
      '    "bright_summer": number,',
      '    "bright_winter": number,',
      '    "medium_summer": number,',
      '    "medium_winter": number,',
      '    "low_summer": number,',
      '    "low_winter": number',
      "  },",
      '  "tip": "One practical care tip in Slovak"',
      "}",
      "",
      "Use realistic watering intervals based on expert horticultural knowledge.",
      "If you cannot identify the plant, set confidence to low and give your best guess."
    ].join("\n");

    var res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
            { type: "text", text: prompt }
          ]
        }]
      })
    });

    if (!res.ok) {
      return Response.json({ error: "AI chyba: " + res.status }, { status: 502 });
    }

    var data = await res.json();
    var text = "";
    for (var i = 0; i < data.content.length; i++) {
      if (data.content[i].type === "text") { text = text + data.content[i].text; }
    }

    // Extract JSON from response
    var cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
    var jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "AI nevratila platne data", raw: text.substring(0, 200) }, { status: 422 });
    }

    var parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      // Try fixing common JSON issues
      var fixed = jsonMatch[0].replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
      try {
        parsed = JSON.parse(fixed);
      } catch (e2) {
        return Response.json({ error: "JSON parse zlyhalo", raw: text.substring(0, 200) }, { status: 422 });
      }
    }

    // Validate and provide defaults
    if (!parsed.name) { parsed.name = "Neznama rastlina"; }
    if (!parsed.latin) { parsed.latin = ""; }
    if (!parsed.description) { parsed.description = ""; }
    if (!parsed.confidence) { parsed.confidence = "medium"; }
    if (!parsed.tip) { parsed.tip = ""; }
    if (!parsed.watering) {
      parsed.watering = {
        direct_summer: 5, direct_winter: 9,
        bright_summer: 6, bright_winter: 11,
        medium_summer: 8, medium_winter: 14,
        low_summer: 10, low_winter: 18
      };
    }

    return Response.json({ plant: parsed });
  } catch (err) {
    return Response.json({ error: "Chyba servera: " + err.message }, { status: 500 });
  }
}
