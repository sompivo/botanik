const DB_NAMES = [
  "0=Orchidea","1=Monstera","2=Fikus elastický","3=Aloe vera",
  "4=Zamiokulkas","5=Pothos","6=Svokrine jazyky","7=Fialka",
  "8=Kaktus","9=Begónia","10=Šéflera","11=Dracéna",
  "12=Filodendron","13=Kalatea","14=Papraď","15=Tučnolist",
  "16=Brečtan","17=Spatifilum","18=Antúrium","19=Fikus benjamín",
  "20=Yucca","21=Palma Areka","22=Aglaonema","23=Dieffenbachia",
  "24=Kroton","25=Pilea","26=Maranta","27=Haworthia",
  "28=Echeveria","29=Tradescantia","30=Kalanchoe","31=Zelenec",
  "32=Hoya","33=Alocasia","34=Cyklámen","35=Peperomia",
  "36=Levandula","37=Vianočná hviezda"
].join(",");

const DB_SIZE = 38;

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
                text: "Identify this houseplant from the photo. Match it to the closest option from this list and reply ONLY with the number ID. Nothing else, just the number.\n\n" + DB_NAMES,
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
