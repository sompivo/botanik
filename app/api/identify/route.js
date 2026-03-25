const DB = [
  {id:0,n:"Orchidea (Phalaenopsis)"},
  {id:1,n:"Monstera deliciosa"},
  {id:2,n:"Fikus elastický (Ficus elastica)"},
  {id:3,n:"Aloe vera"},
  {id:4,n:"Zamiokulkas (ZZ plant)"},
  {id:5,n:"Pothos / Epipremnum"},
  {id:6,n:"Svokrine jazyky (Sansevieria)"},
  {id:7,n:"Fialka (Saintpaulia)"},
  {id:8,n:"Kaktus guľatý"},
  {id:9,n:"Begónia"},
  {id:10,n:"Šéflera (Schefflera)"},
  {id:11,n:"Dracéna"},
  {id:12,n:"Filodendron srdcový"},
  {id:13,n:"Kalatea (Calathea)"},
  {id:14,n:"Papraď (Nephrolepis)"},
  {id:15,n:"Tučnolist / Crassula"},
  {id:16,n:"Brečtan (Hedera helix)"},
  {id:17,n:"Spatifilum (Spathiphyllum)"},
  {id:18,n:"Antúrium"},
  {id:19,n:"Fikus benjamín"},
  {id:20,n:"Yucca"},
  {id:21,n:"Palma Areka"},
  {id:22,n:"Aglaonema"},
  {id:23,n:"Dieffenbachia"},
  {id:24,n:"Kroton (Codiaeum)"},
  {id:25,n:"Pilea peperomioides"},
  {id:26,n:"Maranta"},
  {id:27,n:"Haworthia"},
  {id:28,n:"Echeveria"},
  {id:29,n:"Tradescantia"},
  {id:30,n:"Kalanchoe"},
  {id:31,n:"Zelenec (Chlorophytum)"},
  {id:32,n:"Hoya / Voskovka"},
  {id:33,n:"Alocasia"},
  {id:34,n:"Cyklámen"},
  {id:35,n:"Peperomia"},
  {id:36,n:"Levanduľa"},
  {id:37,n:"Vianočná hviezda"},
  {id:38,n:"Kaktus stĺpovitý (Cereus)"},
  {id:39,n:"Kaktus opuncie"},
  {id:40,n:"Stromanthe"},
  {id:41,n:"Palma horská (Chamaedorea)"},
  {id:42,n:"Gerbera"},
  {id:43,n:"Izbový bambus (Lucky bamboo)"},
  {id:44,n:"Azalka (Rhododendron)"},
  {id:45,n:"Fikus lyrata (Fiddle leaf fig)"},
  {id:46,n:"Pachira (Money tree)"},
  {id:47,n:"Oxalis / Šťavel"},
  {id:48,n:"Dendrobium orchidea"},
  {id:49,n:"Oncidium orchidea"},
  {id:50,n:"Cattleya orchidea"},
  {id:51,n:"Strelícia (Bird of paradise)"},
  {id:52,n:"Kentia palma"},
  {id:53,n:"Filodendron Monstera Adansonii"},
  {id:54,n:"Filodendron Birkin"},
  {id:55,n:"Calathea orbifolia"},
  {id:56,n:"Calathea medallion"},
  {id:57,n:"String of pearls (Senecio)"},
  {id:58,n:"String of hearts (Ceropegia)"},
  {id:59,n:"Rhipsalis"},
  {id:60,n:"Adenium (Púštna ruža)"},
  {id:61,n:"Fikus microcarpa (Ginseng)"},
  {id:62,n:"Bonsai (Ficus)"},
  {id:63,n:"Bambus (Bambusa)"},
  {id:64,n:"Croton Petra"},
  {id:65,n:"Scindapsus pictus (Satin pothos)"},
  {id:66,n:"Antúrium clarinervium"},
  {id:67,n:"Ctenanthe"},
  {id:68,n:"Asparagus sprengeri"},
  {id:69,n:"Aspidistra"},
  {id:70,n:"Nephthytis / Syngonium"},
  {id:71,n:"Coffea arabica (Kávovník)"},
  {id:72,n:"Citrus (Citrón/Pomaranč)"},
  {id:73,n:"Mäta"},
  {id:74,n:"Bazalka"},
  {id:75,n:"Rozmarín"},
  {id:76,n:"Euphorbia trigona"},
  {id:77,n:"Schlumbergera (Vianočný kaktus)"},
  {id:78,n:"Lithops (Živé kamene)"},
  {id:79,n:"Gasteria"},
  {id:80,n:"Sedum"},
  {id:81,n:"Senecio rowleyanus"},
  {id:82,n:"Tillandsia (Air plant)"},
  {id:83,n:"Neoregelia (Bromélia)"},
  {id:84,n:"Vriesea (Bromélia)"},
];

const NAMES = DB.map(p => p.id + "=" + p.n).join("\n");
const DB_SIZE = DB.length;

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

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 100,
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
                text: `You are an expert botanist. Carefully analyze this photo of a houseplant.

Look at:
- Leaf shape, size, color, texture, patterns
- Stem type (woody, vine, rosette, thick/thin)
- Flowers if present (color, shape)
- Overall growth habit
- Any distinctive features (holes in leaves, variegation, spines, aerial roots)

Then match it to the SINGLE closest plant from this list. Consider all visual details before deciding.

Plant list:
${NAMES}

IMPORTANT: Reply with ONLY the ID number. Nothing else. Just one number.`,
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
    if (id < 0 || id >= DB_SIZE) {
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
