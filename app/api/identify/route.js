const NAMES = [
  "0=Orchidea Phalaenopsis",
  "1=Monstera deliciosa",
  "2=Fikus elasticky (Ficus elastica)",
  "3=Aloe vera",
  "4=Zamiokulkas (ZZ plant)",
  "5=Pothos / Epipremnum",
  "6=Svokrine jazyky (Sansevieria)",
  "7=Fialka (Saintpaulia)",
  "8=Kaktus gulaty",
  "9=Begonia",
  "10=Seflera (Schefflera)",
  "11=Dracena",
  "12=Filodendron srdcovy",
  "13=Kalatea (Calathea)",
  "14=Paprad (Nephrolepis)",
  "15=Tucnolist / Crassula",
  "16=Brectan (Hedera helix)",
  "17=Spatifilum (Spathiphyllum)",
  "18=Anturium",
  "19=Fikus benjamin",
  "20=Yucca",
  "21=Palma Areka",
  "22=Aglaonema",
  "23=Dieffenbachia",
  "24=Kroton (Codiaeum)",
  "25=Pilea peperomioides",
  "26=Maranta",
  "27=Haworthia",
  "28=Echeveria",
  "29=Tradescantia",
  "30=Kalanchoe",
  "31=Zelenec (Chlorophytum)",
  "32=Hoya / Voskovka",
  "33=Alocasia",
  "34=Cyklamen",
  "35=Peperomia",
  "36=Levandula",
  "37=Vianocna hviezda",
  "38=Kaktus stlpovity (Cereus)",
  "39=Opuncia",
  "40=Stromanthe",
  "41=Palma horska (Chamaedorea)",
  "42=Gerbera",
  "43=Izbovy bambus (Lucky bamboo)",
  "44=Azalka (Rhododendron)",
  "45=Fikus lyrata (Fiddle leaf fig)",
  "46=Pachira (Money tree)",
  "47=Stavel (Oxalis)",
  "48=Orchidea Dendrobium",
  "49=Orchidea Oncidium",
  "50=Orchidea Cattleya",
  "51=Strelicia (Bird of paradise)",
  "52=Kentia palma",
  "53=Monstera Adansonii",
  "54=Filodendron Birkin",
  "55=Calathea orbifolia",
  "56=Calathea medallion",
  "57=String of pearls (Senecio)",
  "58=String of hearts (Ceropegia)",
  "59=Rhipsalis",
  "60=Pustna ruza (Adenium)",
  "61=Fikus Ginseng",
  "62=Bonsai (Ficus)",
  "63=Bambus",
  "64=Kroton Petra",
  "65=Satin Pothos (Scindapsus)",
  "66=Anturium clarinervium",
  "67=Ctenanthe",
  "68=Asparagus sprengeri",
  "69=Aspidistra",
  "70=Syngonium",
  "71=Kavovnik (Coffea arabica)",
  "72=Citrus (Citron/Pomaranc)",
  "73=Mata",
  "74=Bazalka",
  "75=Rozmarin",
  "76=Euphorbia trigona",
  "77=Vianocny kaktus (Schlumbergera)",
  "78=Lithops (Zive kamene)",
  "79=Gasteria",
  "80=Sedum",
  "81=Senecio rowleyanus",
  "82=Tillandsia (Air plant)",
  "83=Bromelia Neoregelia",
  "84=Bromelia Vriesea"
].join("\n");

const DB_SIZE = 85;

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY nie je nastaveny" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const image = body.image;

    if (!image) {
      return Response.json(
        { error: "Chyba obrazok" },
        { status: 400 }
      );
    }

    const prompt = "You are an expert botanist. Carefully analyze this photo of a houseplant.\n\nLook at:\n- Leaf shape, size, color, texture, patterns\n- Stem type (woody, vine, rosette, thick/thin)\n- Flowers if present (color, shape)\n- Overall growth habit\n- Any distinctive features (holes in leaves, variegation, spines, aerial roots)\n\nThen match it to the SINGLE closest plant from this list. Consider all visual details before deciding.\n\nPlant list:\n" + NAMES + "\n\nIMPORTANT: Reply with ONLY the ID number. Nothing else. Just one number.";

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
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
                  data: image
                }
              },
              {
                type: "text",
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json(
        { error: "AI chyba: " + res.status },
        { status: 502 }
      );
    }

    const data = await res.json();
    var text = "";
    for (var i = 0; i < data.content.length; i++) {
      if (data.content[i].type === "text") {
        text = text + data.content[i].text;
      }
    }

    const match = text.trim().match(/\d+/);
    if (!match) {
      return Response.json(
        { error: "AI nevratila cislo", raw: text },
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

    return Response.json({ id: id });
  } catch (err) {
    return Response.json(
      { error: "Chyba servera: " + err.message },
      { status: 500 }
    );
  }
}
