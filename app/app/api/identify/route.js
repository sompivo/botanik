var NAMES = [
  "0=Orchidea Phalaenopsis",
  "1=Monstera deliciosa",
  "2=Fikus elasticky (Ficus elastica)",
  "3=Aloe vera",
  "4=Zamiokulkas (ZZ plant)",
  "5=Pothos / Epipremnum aureum",
  "6=Svokrine jazyky (Sansevieria)",
  "7=Fialka (Saintpaulia)",
  "8=Kaktus gulaty",
  "9=Begonia",
  "10=Seflera (Schefflera)",
  "11=Dracena",
  "12=Filodendron srdcovy (Philodendron)",
  "13=Kalatea (Calathea)",
  "14=Paprad (Nephrolepis)",
  "15=Tucnolist / Crassula / Penazny stromcek",
  "16=Brectan (Hedera helix)",
  "17=Spatifilum (Spathiphyllum)",
  "18=Anturium (Anthurium)",
  "19=Fikus benjamin (Ficus benjamina)",
  "20=Yucca",
  "21=Palma Areka (Dypsis lutescens)",
  "22=Aglaonema",
  "23=Dieffenbachia",
  "24=Kroton (Codiaeum variegatum)",
  "25=Pilea peperomioides",
  "26=Maranta leuconeura",
  "27=Haworthia",
  "28=Echeveria",
  "29=Tradescantia",
  "30=Kalanchoe",
  "31=Zelenec (Chlorophytum comosum)",
  "32=Hoya carnosa / Voskovka",
  "33=Alocasia",
  "34=Cyklamen (Cyclamen)",
  "35=Peperomia",
  "36=Levandula (Lavandula)",
  "37=Vianocna hviezda (Euphorbia pulcherrima)",
  "38=Kaktus stlpovity (Cereus)",
  "39=Opuncia (Opuntia)",
  "40=Stromanthe sanguinea",
  "41=Palma horska (Chamaedorea elegans)",
  "42=Gerbera",
  "43=Lucky bamboo (Dracaena sanderiana)",
  "44=Azalka (Rhododendron)",
  "45=Fikus lyrata (Fiddle leaf fig)",
  "46=Pachira aquatica (Money tree)",
  "47=Oxalis / Stavel",
  "48=Orchidea Dendrobium",
  "49=Orchidea Oncidium",
  "50=Orchidea Cattleya",
  "51=Strelicia (Bird of paradise)",
  "52=Kentia palma (Howea forsteriana)",
  "53=Monstera Adansonii (Swiss cheese vine)",
  "54=Philodendron Birkin",
  "55=Calathea orbifolia",
  "56=Calathea medallion / roseopicta",
  "57=String of pearls (Senecio rowleyanus)",
  "58=String of hearts (Ceropegia woodii)",
  "59=Rhipsalis",
  "60=Adenium / Pustna ruza",
  "61=Fikus Ginseng (Ficus microcarpa)",
  "62=Bonsai (Ficus retusa)",
  "63=Bambus (Bambusa)",
  "64=Kroton Petra",
  "65=Satin Pothos (Scindapsus pictus)",
  "66=Anthurium clarinervium",
  "67=Ctenanthe",
  "68=Asparagus sprengeri",
  "69=Aspidistra elatior",
  "70=Syngonium podophyllum",
  "71=Kavovnik (Coffea arabica)",
  "72=Citrus (Citron/Pomaranc)",
  "73=Mata (Mentha)",
  "74=Bazalka (Ocimum basilicum)",
  "75=Rozmarin (Rosmarinus)",
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

var DB_SIZE = 85;

export async function POST(request) {
  var apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY nie je nastaveny" },
      { status: 500 }
    );
  }

  try {
    var body = await request.json();
    var image = body.image;

    if (!image) {
      return Response.json(
        { error: "Chyba obrazok" },
        { status: 400 }
      );
    }

    var prompt = [
      "You are a world-class botanist identifying a houseplant from a photo.",
      "",
      "STEP 1 - Carefully describe what you see:",
      "- Leaf shape (round, oval, long, heart-shaped, arrow-shaped, needle-like, palmate, split/fenestrated)",
      "- Leaf size (tiny, small, medium, large)",
      "- Leaf color and patterns (solid green, variegated, striped, spotted, purple, silver)",
      "- Leaf texture (smooth, glossy, matte, fuzzy, waxy, leathery, succulent/thick)",
      "- Stem type (single stem, multiple stems, vine/trailing, rosette, woody trunk)",
      "- Flowers if visible (color, shape, size)",
      "- Growth habit (upright, trailing, climbing, compact, tree-like)",
      "- Any special features (aerial roots, holes in leaves, spines, tendrils)",
      "",
      "STEP 2 - Based on your description, match to the BEST plant from this list:",
      "",
      NAMES,
      "",
      "STEP 3 - Write ONLY the ID number on the very last line. Nothing else on that line."
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
      var errText = await res.text();
      return Response.json(
        { error: "AI chyba: " + res.status },
        { status: 502 }
      );
    }

    var data = await res.json();
    var text = "";
    for (var i = 0; i < data.content.length; i++) {
      if (data.content[i].type === "text") {
        text = text + data.content[i].text;
      }
    }

    var lines = text.trim().split("\n");
    var lastLine = lines[lines.length - 1].trim();
    var match = lastLine.match(/\d+/);

    if (!match) {
      var allNums = text.match(/\d+/g);
      if (allNums) {
        match = [allNums[allNums.length - 1]];
      }
    }

    if (!match) {
      return Response.json(
        { error: "AI nevratila cislo", raw: text.substring(0, 200) },
        { status: 422 }
      );
    }

    var id = parseInt(match[0]);
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
