// app/api/identify/route.js
// Serverová funkcia — volá Anthropic API bezpečne zo servera
// API kľúč je v environment variable, nikdy sa nedostane ku klientovi

const DB = [
  {id:0,n:"Orchidea",lat:"Phalaenopsis"},
  {id:1,n:"Monstera",lat:"Monstera deliciosa"},
  {id:2,n:"Fikus elastický",lat:"Ficus elastica"},
  {id:3,n:"Aloe vera",lat:"Aloe vera"},
  {id:4,n:"Zamiokulkas",lat:"Zamioculcas zamiifolia"},
  {id:5,n:"Pothos",lat:"Epipremnum aureum"},
  {id:6,n:"Svokrine jazyky",lat:"Sansevieria"},
  {id:7,n:"Fialka",lat:"Saintpaulia"},
  {id:8,n:"Kaktus",lat:"Cactaceae"},
  {id:9,n:"Begónia",lat:"Begonia"},
  {id:10,n:"Šéflera",lat:"Schefflera"},
  {id:11,n:"Dracéna",lat:"Dracaena"},
  {id:12,n:"Filodendron",lat:"Philodendron"},
  {id:13,n:"Kalatea",lat:"Calathea"},
  {id:14,n:"Papraď",lat:"Nephrolepis"},
  {id:15,n:"Tučnolist",lat:"Crassula ovata"},
  {id:16,n:"Brečtan",lat:"Hedera helix"},
  {id:17,n:"Spatifilum",lat:"Spathiphyllum"},
  {id:18,n:"Antúrium",lat:"Anthurium"},
  {id:19,n:"Fikus benjamín",lat:"Ficus benjamina"},
  {id:20,n:"Yucca",lat:"Yucca"},
  {id:21,n:"Palma Areka",lat:"Dypsis lutescens"},
  {id:22,n:"Aglaonema",lat:"Aglaonema"},
  {id:23,n:"Dieffenbachia",lat:"Dieffenbachia"},
  {id:24,n:"Kroton",lat:"Codiaeum"},
  {id:25,n:"Pilea",lat:"Pilea peperomioides"},
  {id:26,n:"Maranta",lat:"Maranta"},
  {id:27,n:"Haworthia",lat:"Haworthia"},
  {id:28,n:"Echeveria",lat:"Echeveria"},
  {id:29,n:"Tradescantia",lat:"Tradescantia"},
  {id:30,n:"Kalanchoe",lat:"Kalanchoe"},
  {id:31,n:"Zelenec",lat:"Chlorophytum"},
  {id:32,n:"Hoya",lat:"Hoya carnosa"},
  {id:33,n:"Alocasia",lat:"Alocasia"},
  {id:34,n:"Cyklámen",lat:"Cyclamen"},
  {id:35,n:"Peperomia",lat:"Peperomia"},
  {id:36,n:"Levandula",lat:"Lavandula"},
  {id:37,n:"Vianočná hviezda",lat:"Euphorbia pulcherrima"},
];

const NAMES = DB.map(p => `${p.id}=${p.n}`).join(",");

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY nie je nastavený na serveri" },
      { status: 500 }
    );
  }

  try {
    const { image } = await request.json();

    if (!image) {
      return Response.json({ error: "Chýba obrázok" }, { status: 400 });
    }

    // Volanie Anthropic API zo servera
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 50,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: image,
                },
              },
              {
                type: "text",
                text: `Identify this houseplant from the photo. Match it to the closest option from this list and reply ONLY with the number ID. Nothing else, just the number.\n\n${NAMES}`,
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic API error:", res.status, errText);
      return Response.json(
        { error: "AI chyba: " + res.status },
        { status: 502 }
      );
    }

    const data = await res.json();
    let text = "";
    for (const block of data.content || []) {
      if (block.type === "text") text += block.text;
    }

    const match = text.trim().match(/\d+/);
    if (!match) {
      return Response.json(
        { error: "AI nevrátila platné číslo", raw: text },
        { status: 422 }
      );
    }

    const id = parseInt(match[0]);
    if (id < 0 || id >= DB.length) {
      return Response.json(
        { error: "ID mimo rozsah: " + id },
        { status: 422 }
      );
    }

    return Response.json({ id });
  } catch (err) {
    console.error("Server error:", err);
    return Response.json(
      { error: "Serverová chyba: " + err.message },
      { status: 500 }
    );
  }
}
