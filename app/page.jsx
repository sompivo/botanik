"use client";
import { useState, useRef, useCallback } from "react";

var DB = [
  {id:0,n:"Orchidea",lat:"Phalaenopsis",desc:"Motylovite kvety na dlhom stonke.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:10,lw:14},tip:"Polievaj ponorenim na 15 min."},
  {id:1,n:"Monstera",lat:"Monstera deliciosa",desc:"Velke srdcovite listy s dierami.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:9,lw:14},tip:"Otrieraj listy od prachu."},
  {id:2,n:"Fikus elasticky",lat:"Ficus elastica",desc:"Velke tmavozelene leskle listy.",w:{ds:5,dw:9,bs:6,bw:10,ms:8,mw:13,ls:10,lw:16},tip:"Nema rada presuvanie."},
  {id:3,n:"Aloe vera",lat:"Aloe vera",desc:"Dlhe masite listy plne gelu.",w:{ds:8,dw:16,bs:10,bw:18,ms:12,mw:21,ls:14,lw:28},tip:"Radsej menej vody."},
  {id:4,n:"Zamiokulkas",lat:"Zamioculcas zamiifolia",desc:"Leskle tmavozelene listy, neznicicitelny.",w:{ds:8,dw:16,bs:10,bw:18,ms:14,mw:24,ls:16,lw:30},tip:"Znesie aj zanedbanie."},
  {id:5,n:"Pothos",lat:"Epipremnum aureum",desc:"Popinava so srdcovitymi listami.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Rastie aj vo vode."},
  {id:6,n:"Svokrine jazyky",lat:"Sansevieria",desc:"Vysoke tuhe mecovite listy.",w:{ds:10,dw:18,bs:12,bw:21,ms:14,mw:25,ls:16,lw:30},tip:"Cisti vzduch aj v noci."},
  {id:7,n:"Fialka",lat:"Saintpaulia",desc:"Fialove kvietky, chlpate listy.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:7,ls:6,lw:9},tip:"Polievaj odspodu."},
  {id:8,n:"Kaktus gulaty",lat:"Cactaceae",desc:"Gulaty s ihlickami.",w:{ds:12,dw:25,bs:14,bw:28,ms:16,mw:30,ls:20,lw:40},tip:"V zime takmer nepolievaj."},
  {id:9,n:"Begonia",lat:"Begonia",desc:"Asymetricke listy, drobne kvety.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Miluje vlhkost."},
  {id:10,n:"Seflera",lat:"Schefflera",desc:"Vejarovite zlozene listy.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Obcas otoc."},
  {id:11,n:"Dracena",lat:"Dracaena",desc:"Uzke listy na drevnatom kmeni.",w:{ds:5,dw:9,bs:6,bw:11,ms:8,mw:14,ls:10,lw:18},tip:"Filtrovana voda."},
  {id:12,n:"Filodendron",lat:"Philodendron",desc:"Srdcovite listy, popinava.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Rychlo rastie."},
  {id:13,n:"Kalatea",lat:"Calathea",desc:"Farebne vzory na listoch.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:8,ls:6,lw:10},tip:"Citliva na tvrdu vodu."},
  {id:14,n:"Paprad",lat:"Nephrolepis",desc:"Vzdusne zelene perim-listy.",w:{ds:2,dw:4,bs:3,bw:5,ms:4,mw:6,ls:5,lw:8},tip:"Idealna do kupelne."},
  {id:15,n:"Tucnolist",lat:"Crassula ovata",desc:"Masite listy, penazny stromcek.",w:{ds:7,dw:14,bs:8,bw:16,ms:10,mw:20,ls:12,lw:25},tip:"Vela svetla."},
  {id:16,n:"Brectan",lat:"Hedera helix",desc:"Popinava, lalocnate listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Jedovaty pre zvierata."},
  {id:17,n:"Spatifilum",lat:"Spathiphyllum",desc:"Tmavozelene listy, biele kvety.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Listy ovisnu ked ma smad."},
  {id:18,n:"Anturium",lat:"Anthurium",desc:"Cervene leskle srdcovite kvety.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Miluje vlhkost."},
  {id:19,n:"Fikus benjamin",lat:"Ficus benjamina",desc:"Male ovalne listy, stromcek.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Nechaj na jednom mieste."},
  {id:20,n:"Yucca",lat:"Yucca",desc:"Ostre listy z hrubeho kmena.",w:{ds:7,dw:12,bs:8,bw:14,ms:10,mw:18,ls:12,lw:21},tip:"Odolna, rada ma svetlo."},
  {id:21,n:"Palma Areka",lat:"Dypsis lutescens",desc:"Palmove listy na tenkych kmenoch.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Zvlhcuje vzduch."},
  {id:22,n:"Aglaonema",lat:"Aglaonema",desc:"Siroke farebne listy.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:9,lw:15},tip:"Nizke naroky na svetlo."},
  {id:23,n:"Dieffenbachia",lat:"Dieffenbachia",desc:"Velke zeleno-biele listy.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Jedovata stava!"},
  {id:24,n:"Kroton",lat:"Codiaeum",desc:"Pestre cerveno-zlto-zelene listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Viac svetla = sytejsie farby."},
  {id:25,n:"Pilea",lat:"Pilea peperomioides",desc:"Okruhle mincovite listy.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:10,ls:8,lw:13},tip:"Tvori odnoze."},
  {id:26,n:"Maranta",lat:"Maranta",desc:"Listy s zilkami, zatvara sa na noc.",w:{ds:3,dw:5,bs:4,bw:7,ms:5,mw:8,ls:6,lw:10},tip:"Modliaca sa rastlina."},
  {id:27,n:"Haworthia",lat:"Haworthia",desc:"Maly sukulent, pruhovane listy.",w:{ds:8,dw:16,bs:10,bw:18,ms:12,mw:22,ls:14,lw:28},tip:"Znesie nepriame svetlo."},
  {id:28,n:"Echeveria",lat:"Echeveria",desc:"Ruzicovy sukulent.",w:{ds:7,dw:14,bs:9,bw:18,ms:11,mw:21,ls:14,lw:28},tip:"Polievaj len pudu."},
  {id:29,n:"Tradescantia",lat:"Tradescantia",desc:"Fialovo-zelene pruhovane listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Zakoreni za par dni."},
  {id:30,n:"Kalanchoe",lat:"Kalanchoe",desc:"Sukulent s farebnymi kvetmi.",w:{ds:7,dw:14,bs:8,bw:16,ms:10,mw:20,ls:12,lw:24},tip:"Dlho kvitnutie."},
  {id:31,n:"Zelenec",lat:"Chlorophytum",desc:"Zeleno-biele dlhe listy.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Cisti vzduch."},
  {id:32,n:"Hoya",lat:"Hoya carnosa",desc:"Masite listy, voskove kvety.",w:{ds:6,dw:12,bs:7,bw:14,ms:9,mw:16,ls:11,lw:20},tip:"Nepresadzaj casto."},
  {id:33,n:"Alocasia",lat:"Alocasia",desc:"Velke sipovite listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Vlhkost a teplo."},
  {id:34,n:"Cyklamen",lat:"Cyclamen",desc:"Srdcovite listy, motylove kvety.",w:{ds:3,dw:5,bs:3,bw:6,ms:4,mw:7,ls:5,lw:8},tip:"Kvitne v zime!"},
  {id:35,n:"Peperomia",lat:"Peperomia",desc:"Mala, masite okruhle listy.",w:{ds:5,dw:9,bs:6,bw:10,ms:7,mw:12,ls:9,lw:15},tip:"Nepreliat!"},
  {id:36,n:"Levandula",lat:"Lavandula",desc:"Fialove kvety, krasna vona.",w:{ds:5,dw:10,bs:6,bw:12,ms:8,mw:14,ls:10,lw:18},tip:"Vela slnka."},
  {id:37,n:"Vianocna hviezda",lat:"Euphorbia pulcherrima",desc:"Velke cervene listy.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:7,ls:6,lw:9},tip:"Chran pred prievanom."},
  {id:38,n:"Kaktus stlpovity",lat:"Cereus",desc:"Vysoky stlpovity s rebrami.",w:{ds:10,dw:21,bs:12,bw:25,ms:14,mw:28,ls:18,lw:35},tip:"Priame slnko."},
  {id:39,n:"Opuncia",lat:"Opuntia",desc:"Plochy kaktus s usami.",w:{ds:10,dw:21,bs:12,bw:25,ms:14,mw:28,ls:18,lw:35},tip:"Vela slnka, malo vody."},
  {id:40,n:"Stromanthe",lat:"Stromanthe",desc:"Zelene listy, ruzove naspodu.",w:{ds:3,dw:5,bs:4,bw:7,ms:5,mw:8,ls:6,lw:10},tip:"Chce vlhkost."},
  {id:41,n:"Palma horska",lat:"Chamaedorea",desc:"Kompaktna palma.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:10,ls:8,lw:13},tip:"Znesie menej svetla."},
  {id:42,n:"Gerbera",lat:"Gerbera",desc:"Velke pestre margarety.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:8,ls:6,lw:10},tip:"Vela svetla na kvitnutie."},
  {id:43,n:"Izbovy bambus",lat:"Dracaena sanderiana",desc:"Lucky bamboo, zelene stonky.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:9,lw:15},tip:"Rastie aj vo vode."},
  {id:44,n:"Azalka",lat:"Rhododendron",desc:"Krik s mnozstvom kvetov.",w:{ds:2,dw:4,bs:3,bw:5,ms:4,mw:6,ls:5,lw:8},tip:"Kysla puda."},
  {id:45,n:"Fikus lyrata",lat:"Ficus lyrata",desc:"Velke huslovite listy.",w:{ds:5,dw:9,bs:6,bw:10,ms:8,mw:13,ls:10,lw:16},tip:"Vela nepriameho svetla."},
  {id:46,n:"Pachira",lat:"Pachira aquatica",desc:"Prepleteny kmen, dlanovite listy.",w:{ds:5,dw:9,bs:6,bw:11,ms:7,mw:13,ls:9,lw:16},tip:"Money tree. Nepreliat."},
  {id:47,n:"Stavel (Oxalis)",lat:"Oxalis",desc:"Trojuholnikove fialove listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Na noc zatvara listy."},
  {id:48,n:"Orchidea Dendrobium",lat:"Dendrobium",desc:"Orchidea s kvetmi na stonke.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Chladnejsie v noci."},
  {id:49,n:"Orchidea Oncidium",lat:"Oncidium",desc:"Drobne zlte tancujuce kvety.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Jasne nepriame svetlo."},
  {id:50,n:"Orchidea Cattleya",lat:"Cattleya",desc:"Velke vonave kvety.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:9,lw:14},tip:"Silne svetlo."},
  {id:51,n:"Strelicia",lat:"Strelitzia",desc:"Bird of Paradise, velke listy.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Vela svetla na kvitnutie."},
  {id:52,n:"Kentia palma",lat:"Howea",desc:"Elegantna vysoka palma.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:8,lw:14},tip:"Znesie aj tien."},
  {id:53,n:"Monstera Adansonii",lat:"Monstera adansonii",desc:"Mensia monstera, viac dierok.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Popinava, daj oporu."},
  {id:54,n:"Filodendron Birkin",lat:"Philodendron Birkin",desc:"Tmave listy s bielymi pruzkami.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Pomaly rast."},
  {id:55,n:"Calathea orbifolia",lat:"Calathea orbifolia",desc:"Velke okruhle pruhovane listy.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:8,ls:6,lw:10},tip:"Destilovana voda."},
  {id:56,n:"Calathea medallion",lat:"Calathea roseopicta",desc:"Ruzovo-zeleny vzor.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:8,ls:6,lw:10},tip:"Vysoka vlhkost."},
  {id:57,n:"String of pearls",lat:"Senecio rowleyanus",desc:"Gulate listky na dlhych vyhonkoch.",w:{ds:7,dw:14,bs:8,bw:16,ms:10,mw:20,ls:12,lw:25},tip:"Jasne svetlo, malo vody."},
  {id:58,n:"String of hearts",lat:"Ceropegia woodii",desc:"Srdieckovite listky, tenke vyhonky.",w:{ds:6,dw:12,bs:7,bw:14,ms:9,mw:16,ls:11,lw:20},tip:"Nechaj preschnut."},
  {id:59,n:"Rhipsalis",lat:"Rhipsalis",desc:"Kaktus bez ihliciek, visiace vyhonky.",w:{ds:5,dw:10,bs:6,bw:12,ms:7,mw:14,ls:9,lw:16},tip:"Trosku viac vody ako kaktus."},
  {id:60,n:"Pustna ruza",lat:"Adenium",desc:"Hruby kmen, ruzove kvety.",w:{ds:7,dw:16,bs:8,bw:18,ms:10,mw:21,ls:12,lw:28},tip:"Vela slnka."},
  {id:61,n:"Fikus Ginseng",lat:"Ficus microcarpa",desc:"Bonsai s hrubymi korenmi.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Pravidelny strih."},
  {id:62,n:"Bonsai",lat:"Ficus retusa",desc:"Miniaturny stromcek.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Nikdy nenechaj vyschnut."},
  {id:63,n:"Bambus",lat:"Bambusa",desc:"Vysoky bambus v kvetinaci.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:8,ls:6,lw:10},tip:"Vela vody v lete."},
  {id:64,n:"Kroton Petra",lat:"Codiaeum Petra",desc:"Velke pestre listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Rada ma teplo."},
  {id:65,n:"Satin Pothos",lat:"Scindapsus pictus",desc:"Strieborne skvrny na listoch.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:8,lw:14},tip:"Menej svetla ako Pothos."},
  {id:66,n:"Anturium clarinervium",lat:"Anthurium clarinervium",desc:"Srdcovite listy s bielymi zilkami.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:7,lw:13},tip:"Vlhkost a teplo."},
  {id:67,n:"Ctenanthe",lat:"Ctenanthe",desc:"Podobna kalatei, pruhovane listy.",w:{ds:3,dw:5,bs:4,bw:7,ms:5,mw:8,ls:6,lw:10},tip:"Nepriame svetlo."},
  {id:68,n:"Asparagus",lat:"Asparagus sprengeri",desc:"Jemne ihlickovite listy.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:8,ls:6,lw:10},tip:"Rada ma vlhkost."},
  {id:69,n:"Aspidistra",lat:"Aspidistra",desc:"Siroke tmavozelene listy. Neznicicitelna.",w:{ds:6,dw:10,bs:7,bw:12,ms:8,mw:14,ls:10,lw:18},tip:"Znesie takmer cokovek."},
  {id:70,n:"Syngonium",lat:"Syngonium",desc:"Sipovite listy, meni sa s vekom.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Mlada kompaktna, stara popinava."},
  {id:71,n:"Kavovnik",lat:"Coffea arabica",desc:"Leskle zelene listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Jasne nepriame svetlo."},
  {id:72,n:"Citrus",lat:"Citrus",desc:"Citron alebo pomaranc.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Vela slnka a vlhkosti."},
  {id:73,n:"Mata",lat:"Mentha",desc:"Aromaticke zelene listy.",w:{ds:2,dw:4,bs:3,bw:5,ms:4,mw:6,ls:5,lw:8},tip:"Vela vody, vela svetla."},
  {id:74,n:"Bazalka",lat:"Ocimum basilicum",desc:"Aromaticka bylinka.",w:{ds:2,dw:3,bs:2,bw:4,ms:3,mw:5,ls:4,lw:6},tip:"Priame slnko."},
  {id:75,n:"Rozmarin",lat:"Rosmarinus",desc:"Ihlickovite vonavy listy.",w:{ds:5,dw:10,bs:6,bw:12,ms:7,mw:14,ls:9,lw:18},tip:"Nechaj preschnut medzi polievaniami."},
  {id:76,n:"Euphorbia trigona",lat:"Euphorbia trigona",desc:"Trojhranny stlpovity sukulent.",w:{ds:8,dw:16,bs:10,bw:18,ms:12,mw:21,ls:14,lw:28},tip:"Jedovata stava!"},
  {id:77,n:"Vianocny kaktus",lat:"Schlumbergera",desc:"Splosstene clanky, kvety na koncoch.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:8,lw:14},tip:"Kvitne v zime."},
  {id:78,n:"Lithops",lat:"Lithops",desc:"Zive kamene, male okruhle.",w:{ds:14,dw:30,bs:16,bw:35,ms:18,mw:40,ls:21,lw:45},tip:"Takmer ziadna voda v zime."},
  {id:79,n:"Gasteria",lat:"Gasteria",desc:"Maly sukulent, jazykovite listy.",w:{ds:8,dw:16,bs:10,bw:18,ms:12,mw:22,ls:14,lw:28},tip:"Znesie tien."},
  {id:80,n:"Sedum",lat:"Sedum",desc:"Drobny sukulent.",w:{ds:7,dw:14,bs:9,bw:18,ms:11,mw:21,ls:14,lw:28},tip:"Vela svetla."},
  {id:81,n:"Senecio rowleyanus",lat:"Senecio",desc:"String of pearls.",w:{ds:7,dw:14,bs:8,bw:16,ms:10,mw:20,ls:12,lw:25},tip:"Jasne svetlo."},
  {id:82,n:"Tillandsia",lat:"Tillandsia",desc:"Air plant, bez pudy.",w:{ds:2,dw:4,bs:3,bw:5,ms:3,mw:5,ls:4,lw:6},tip:"Ponor do vody 1x tyzdenne."},
  {id:83,n:"Bromelia Neoregelia",lat:"Neoregelia",desc:"Farebna rozeta.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:8,lw:14},tip:"Lej vodu do rozety."},
  {id:84,n:"Bromelia Vriesea",lat:"Vriesea",desc:"Leskla rozeta, farebny kvet.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:8,lw:14},tip:"Lej vodu do rozety."},
];

var LIGHTS = [
  {id:"d",label:"Priame slnko",icon:"\u2600\uFE0F",desc:"Juzne okno"},
  {id:"b",label:"Jasne nepriame",icon:"\uD83C\uDF24",desc:"Blizko okna"},
  {id:"m",label:"Stredne",icon:"\u26C5",desc:"Dalej od okna"},
  {id:"l",label:"Malo svetla",icon:"\uD83C\uDF19",desc:"Tmavy kut"},
];

var LAST_WATERED = [
  {id:0,label:"Dnes",icon:"\uD83D\uDCA7"},
  {id:1,label:"Vcera",icon:"\uD83D\uDCA7"},
  {id:3,label:"Pred 2-3 dnami",icon:"\uD83D\uDCA6"},
  {id:5,label:"Pred 4-7 dnami",icon:"\uD83C\uDFDC\uFE0F"},
  {id:-1,label:"Neviem / davno",icon:"\uD83E\uDD37"},
];

var TIME_OPTIONS = [
  {h:7,label:"7:00 rano"},
  {h:8,label:"8:00 rano"},
  {h:9,label:"9:00 rano"},
  {h:10,label:"10:00 doobeda"},
  {h:12,label:"12:00 obed"},
  {h:17,label:"17:00 podvecer"},
  {h:19,label:"19:00 vecer"},
];

function generateICS(name, interval, untilFirst, hour) {
  var now = new Date();
  function pad(n) { return String(n).padStart(2, "0"); }
  function fmt(d) { return d.getFullYear().toString()+pad(d.getMonth()+1)+pad(d.getDate())+"T"+pad(d.getHours())+pad(d.getMinutes())+pad(d.getSeconds()); }
  var start = new Date(now);
  start.setDate(start.getDate() + Math.max(untilFirst, 1));
  start.setHours(hour, 0, 0, 0);
  var end = new Date(start);
  end.setMinutes(end.getMinutes() + 15);
  var until = new Date(start);
  until.setFullYear(until.getFullYear() + 1);
  var lines = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Botanik//SK","CALSCALE:GREGORIAN","METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:botanik-"+Date.now()+"@botanik.app",
    "DTSTART:"+fmt(start),"DTEND:"+fmt(end),
    "RRULE:FREQ=DAILY;INTERVAL="+interval+";UNTIL="+fmt(until),
    "SUMMARY:Poliat "+name,
    "DESCRIPTION:Cas poliat "+name+" kazdych "+interval+" dni.",
    "BEGIN:VALARM","TRIGGER:-PT10M","ACTION:DISPLAY","DESCRIPTION:O 10 min poliat "+name+"!","END:VALARM",
    "BEGIN:VALARM","TRIGGER:PT0M","ACTION:DISPLAY","DESCRIPTION:Polej "+name+" teraz!","END:VALARM",
    "END:VEVENT","END:VCALENDAR"
  ];
  return lines.join("\r\n");
}

function downloadICS(name, interval, untilFirst, hour) {
  var ics = generateICS(name, interval, untilFirst, hour);
  var blob = new Blob([ics], {type:"text/calendar;charset=utf-8"});
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "polievanie.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function shrink(file) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    var fr = new FileReader();
    fr.onload = function(e) { img.src = e.target.result; };
    fr.onerror = function() { reject("Neda sa precitat"); };
    fr.readAsDataURL(file);
    img.onload = function() {
      var MAX = 640;
      var w = img.width;
      var h = img.height;
      var r = Math.min(MAX/w, MAX/h, 1);
      w = Math.round(w*r);
      h = Math.round(h*r);
      var c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      var dataUrl = c.toDataURL("image/jpeg", 0.55);
      resolve({ b64: dataUrl.split(",")[1], preview: dataUrl });
    };
    img.onerror = function() { reject("Obrazok sa nenacital"); };
  });
}

export default function Home() {
  var [step, setStep] = useState("start");
  var [preview, setPreview] = useState(null);
  var [plant, setPlant] = useState(null);
  var [light, setLight] = useState(null);
  var [season, setSeason] = useState(null);
  var [days, setDays] = useState(null);
  var [dUntil, setDUntil] = useState(null);
  var [hour, setHour] = useState(9);
  var [err, setErr] = useState(null);
  var [search, setSearch] = useState("");
  var [calAdded, setCalAdded] = useState(false);
  var ref = useRef();

  var onFile = useCallback(async function(e) {
    var file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    setErr(null);
    setStep("scan");
    try {
      var data = await shrink(file);
      setPreview(data.preview);
      var res = await fetch("/api/identify", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:data.b64})});
      var json = await res.json();
      if (!res.ok || json.error) { setErr(json.error || "Nepodarilo sa"); setStep("fallback"); return; }
      var found = DB.find(function(p) { return p.id === json.id; });
      if (found) { setPlant(found); setStep("confirm"); }
      else { setErr("Nenajdena"); setStep("fallback"); }
    } catch (ex) { setErr("Chyba: " + ex.message); setStep("fallback"); }
    finally { if (ref.current) ref.current.value = ""; }
  }, []);

  var pickPlant = useCallback(function(p) { setPlant(p); setStep("light"); setErr(null); }, []);
  var pickLight = useCallback(function(id) { setLight(id); setStep("season"); }, []);
  var pickSeason = useCallback(function(s) { setSeason(s); setDays(plant && plant.w ? (plant.w[light+s] || 7) : 7); setStep("lastwater"); }, [plant, light]);
  var pickLast = useCallback(function(daysAgo) {
    var u = daysAgo === -1 ? days : Math.max(days - daysAgo, 0);
    setDUntil(u);
    setStep("time");
  }, [days]);
  var pickTime = useCallback(function(h) { setHour(h); setStep("done"); setCalAdded(false); }, []);
  var reset = useCallback(function() {
    setStep("start"); setPreview(null); setPlant(null); setLight(null);
    setSeason(null); setDays(null); setDUntil(null); setHour(9);
    setErr(null); setSearch(""); setCalAdded(false);
  }, []);

  var filtered = search.trim() ? DB.filter(function(p) { return (p.n+" "+p.lat+" "+p.desc).toLowerCase().indexOf(search.toLowerCase()) >= 0; }) : DB;
  var li = LIGHTS.find(function(x) { return x.id === light; });

  return (
    <div style={S.root}>
      <style>{
        "*{box-sizing:border-box;margin:0;padding:0}" +
        "@keyframes fi{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}" +
        "@keyframes pl{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}" +
        "@keyframes sp{to{transform:rotate(360deg)}}" +
        ".fi{animation:fi .35s ease-out both}" +
        ".pl{animation:pl 2.5s ease-in-out infinite}" +
        "button{cursor:pointer;font-family:'Nunito',sans-serif}" +
        "button:active{transform:scale(.96)!important}" +
        "input{font-family:'Nunito',sans-serif}"
      }</style>
      <div style={{position:"fixed",top:-120,left:-120,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(110,231,183,.07) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div style={{textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:32}}>&#127794;</div>
        <h1 style={S.h1}>Botanik</h1>
        <p style={S.sub}>Ofot - Rozpozname - Pripomenieme</p>
      </div>
      <div style={S.wrap} className="fi" key={step}>

        {step==="start" && (
          <Cd>
            <div style={S.drop} onClick={function(){ref.current && ref.current.click();}}>
              <div style={{fontSize:52,marginBottom:8}}>&#128248;</div>
              <p style={{fontSize:17,fontWeight:700,color:"#6ee7b7"}}>Ofot kvetinu</p>
              <p style={{fontSize:13,color:"rgba(255,255,255,.3)",marginTop:6}}>AI ju rozpozna z databazy 85 rastlin</p>
            </div>
            <input ref={ref} type="file" accept="image/*" onChange={onFile} style={{display:"none"}} />
            <div style={{width:"100%",height:1,background:"rgba(255,255,255,.06)"}} />
            <button style={S.sec} onClick={function(){setStep("fallback");}}>Najdi podla nazvu</button>
          </Cd>
        )}

        {step==="scan" && (
          <Cd>
            {preview && <img src={preview} alt="" style={S.prev} />}
            <div style={{width:38,height:38,borderRadius:"50%",margin:"8px auto",border:"3px solid rgba(110,231,183,.2)",borderTopColor:"#6ee7b7",animation:"sp .7s linear infinite"}} />
            <p style={{fontSize:14,fontWeight:600,color:"#6ee7b7"}}>Analyzujem fotku...</p>
          </Cd>
        )}

        {step==="confirm" && plant && (
          <Cd>
            {preview && <img src={preview} alt="" style={S.prev} />}
            <p style={{fontSize:11,color:"#6ee7b7",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase"}}>Najdena zhoda</p>
            <h2 style={S.pn}>{plant.n}</h2>
            <p style={{fontSize:12,fontStyle:"italic",color:"rgba(255,255,255,.3)"}}>{plant.lat}</p>
            <p style={S.desc}>{plant.desc}</p>
            <button style={S.pri} onClick={function(){setStep("light");}}>Spravna rastlina</button>
            <button style={S.gh} onClick={function(){setStep("fallback");}}>Nie je to ona</button>
          </Cd>
        )}

        {step==="fallback" && (
          <Cd>
            {err && <div style={S.errB}>{err}</div>}
            <h3 style={S.q}>Najdi svoju rastlinu</h3>
            <input type="text" placeholder="Hladaj... (monstera, kaktus...)" value={search} onChange={function(e){setSearch(e.target.value);}} style={S.inp} />
            <div style={{display:"flex",flexDirection:"column",gap:5,width:"100%",maxHeight:320,overflowY:"auto"}}>
              {filtered.map(function(p) { return (
                <button key={p.id} style={S.resC} onClick={function(){pickPlant(p);}}>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,fontWeight:700,color:"#1a2e0d",margin:0}}>{p.n}</p>
                    <p style={{fontSize:10,color:"rgba(0,0,0,.4)",margin:0}}>{p.lat} - {p.desc}</p>
                  </div>
                </button>
              ); })}
            </div>
            <button style={S.gh} onClick={reset}>Odznova</button>
          </Cd>
        )}

        {step==="light" && (
          <Cd>
            <h3 style={S.q}>Ake svetlo ma {plant ? plant.n : ""}?</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%"}}>
              {LIGHTS.map(function(o) { return (
                <button key={o.id} style={S.opt} onClick={function(){pickLight(o.id);}}>
                  <span style={{fontSize:28}}>{o.icon}</span>
                  <span style={{fontSize:13,fontWeight:700,color:"#1a2e0d"}}>{o.label}</span>
                  <span style={{fontSize:10,color:"rgba(0,0,0,.4)"}}>{o.desc}</span>
                </button>
              ); })}
            </div>
          </Cd>
        )}

        {step==="season" && (
          <Cd>
            <h3 style={S.q}>Ake je obdobie?</h3>
            <div style={{display:"flex",gap:12,width:"100%"}}>
              <button style={Object.assign({},S.opt,{flex:1,padding:"22px 12px"})} onClick={function(){pickSeason("s");}}>
                <span style={{fontSize:36}}>&#127803;</span>
                <span style={{fontSize:14,fontWeight:700,color:"#1a2e0d"}}>Leto / Jar</span>
              </button>
              <button style={Object.assign({},S.opt,{flex:1,padding:"22px 12px"})} onClick={function(){pickSeason("w");}}>
                <span style={{fontSize:36}}>&#10052;&#65039;</span>
                <span style={{fontSize:14,fontWeight:700,color:"#1a2e0d"}}>Zima / Jesen</span>
              </button>
            </div>
            <button style={S.gh} onClick={function(){setStep("light");}}>Spat</button>
          </Cd>
        )}

        {step==="lastwater" && (
          <Cd>
            <h3 style={S.q}>Kedy bola naposledy poliata?</h3>
            <p style={{fontSize:13,color:"rgba(255,255,255,.35)",textAlign:"center"}}>Podla toho nastavime prvu pripomienku</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
              {LAST_WATERED.map(function(lw) { return (
                <button key={lw.id} style={S.lwBtn} onClick={function(){pickLast(lw.id);}}>
                  <span style={{fontSize:22}}>{lw.icon}</span>
                  <span style={{fontSize:14,fontWeight:700,color:"#1a2e0d"}}>{lw.label}</span>
                </button>
              ); })}
            </div>
            <button style={S.gh} onClick={function(){setStep("season");}}>Spat</button>
          </Cd>
        )}

        {step==="time" && (
          <Cd>
            <h3 style={S.q}>Kedy chces pripomienku?</h3>
            <p style={{fontSize:13,color:"rgba(255,255,255,.35)",textAlign:"center"}}>V akom case ta mame upozornit</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,width:"100%"}}>
              {TIME_OPTIONS.map(function(t) { return (
                <button key={t.h} style={S.timeBtn} onClick={function(){pickTime(t.h);}}>
                  <span style={{fontSize:14,fontWeight:700,color:"#1a2e0d"}}>{t.label}</span>
                </button>
              ); })}
            </div>
            <button style={S.gh} onClick={function(){setStep("lastwater");}}>Spat</button>
          </Cd>
        )}

        {step==="done" && days && plant && (
          <Cd>
            <div style={S.orb} className="pl">
              <span style={{fontSize:46,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#fff",lineHeight:1}}>{days}</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,.7)"}}>dni</span>
            </div>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:21,fontWeight:600,color:"#d1fae5",textAlign:"center",lineHeight:1.4}}>
              Polievaj {plant.n} kazdych {days} dni
            </h2>
            <div style={S.nextBox}>
              <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,.5)"}}>
                {dUntil === 0 ? "Treba poliat dnes! Pripomienky od zajtra o "+hour+":00."
                : dUntil === 1 ? "Dalsie polievanie zajtra o "+hour+":00."
                : "Dalsie polievanie o "+dUntil+" dni o "+hour+":00."}
              </p>
            </div>
            <div style={S.sum}>
              <SR i="&#127807;" l="Rastlina" v={plant.n} />
              <SR i={li ? li.icon : ""} l="Svetlo" v={li ? li.label : ""} />
              <SR i={season==="s" ? "&#127803;" : "&#10052;&#65039;"} l="Obdobie" v={season==="s" ? "Leto" : "Zima"} />
              <SR i="&#128167;" l="Cyklus" v={"kazdych "+days+" dni"} />
              <SR i="&#128336;" l="Cas" v={hour+":00"} />
            </div>
            {plant.tip && <div style={S.tipB}><span>&#128161;</span><p style={{margin:0,fontSize:13,color:"#fef3c7",lineHeight:1.5}}>{plant.tip}</p></div>}
            {!calAdded ? (
              <button style={S.calBtn} onClick={function(){downloadICS(plant.n, days, dUntil, hour); setCalAdded(true);}}>
                Pridat pripomienku do kalendara
              </button>
            ) : (
              <div style={S.calDone}>
                <p style={{margin:0,fontSize:14,fontWeight:600,color:"#6ee7b7"}}>Subor stiahnuty!</p>
                <p style={{margin:"6px 0 0",fontSize:12,color:"rgba(255,255,255,.4)",lineHeight:1.5}}>Otvor .ics subor - na iPhone sa automaticky prida do Kalendara.</p>
                <button style={Object.assign({},S.gh,{marginTop:8,fontSize:12,color:"rgba(255,255,255,.35)"})} onClick={function(){downloadICS(plant.n, days, dUntil, hour);}}>Stiahnut znova</button>
              </div>
            )}
            <button style={S.pri} onClick={reset}>Dalsia kvetina</button>
          </Cd>
        )}
      </div>
    </div>
  );
}

function Cd(props) { return <div style={S.card}>{props.children}</div>; }
function SR(props) { return <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0"}}><span style={{fontSize:13,color:"rgba(255,255,255,.4)"}}>{props.i} {props.l}</span><span style={{fontSize:13,fontWeight:700,color:"#d1fae5"}}>{props.v}</span></div>; }

var S = {
  root:{minHeight:"100vh",background:"linear-gradient(170deg,#051208 0%,#0e2616 45%,#071410 100%)",fontFamily:"'Nunito',sans-serif",color:"#fff",padding:"20px 16px 48px",position:"relative",overflow:"hidden"},
  h1:{fontFamily:"'Fraunces',serif",fontSize:32,fontWeight:700,margin:"2px 0",background:"linear-gradient(135deg,#6ee7b7,#d1fae5)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  sub:{fontSize:11,color:"rgba(255,255,255,.25)",letterSpacing:".12em",textTransform:"uppercase"},
  wrap:{maxWidth:400,margin:"0 auto",position:"relative",zIndex:1},
  card:{background:"rgba(255,255,255,.06)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,.07)",borderRadius:22,padding:"22px 18px",display:"flex",flexDirection:"column",alignItems:"center",gap:14},
  drop:{width:"100%",padding:"30px 16px",border:"2px dashed rgba(110,231,183,.2)",borderRadius:16,textAlign:"center",cursor:"pointer",background:"rgba(110,231,183,.02)"},
  prev:{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:14},
  q:{fontFamily:"'Fraunces',serif",fontSize:19,fontWeight:600,color:"#d1fae5",textAlign:"center",margin:0},
  pn:{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,color:"#d1fae5",margin:0},
  desc:{fontSize:13,color:"rgba(255,255,255,.45)",textAlign:"center",lineHeight:1.5},
  pri:{width:"100%",padding:"14px",background:"linear-gradient(135deg,#059669,#047857)",color:"#fff",border:"none",borderRadius:14,fontSize:15,fontWeight:700,boxShadow:"0 4px 20px rgba(5,150,105,.3)"},
  sec:{width:"100%",padding:"12px",background:"rgba(110,231,183,.08)",color:"#6ee7b7",border:"1px solid rgba(110,231,183,.15)",borderRadius:14,fontSize:14,fontWeight:500},
  gh:{background:"none",border:"none",color:"rgba(255,255,255,.3)",fontSize:13,padding:"6px 12px"},
  opt:{display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"16px 8px",borderRadius:14,border:"1.5px solid rgba(110,231,183,.12)",background:"rgba(255,255,255,.88)"},
  inp:{width:"100%",padding:"12px 14px",borderRadius:12,border:"1px solid rgba(110,231,183,.2)",background:"rgba(255,255,255,.06)",color:"#fff",fontSize:14,outline:"none"},
  resC:{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:10,border:"1.5px solid rgba(110,231,183,.1)",background:"rgba(255,255,255,.88)",width:"100%",textAlign:"left"},
  lwBtn:{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:14,border:"1.5px solid rgba(110,231,183,.12)",background:"rgba(255,255,255,.88)",width:"100%"},
  timeBtn:{padding:"14px 12px",borderRadius:14,border:"1.5px solid rgba(110,231,183,.12)",background:"rgba(255,255,255,.88)",textAlign:"center"},
  orb:{width:118,height:118,borderRadius:"50%",background:"linear-gradient(145deg,#059669,#047857)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:"0 0 40px rgba(5,150,105,.35)"},
  sum:{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,.05)",borderRadius:12,border:"1px solid rgba(255,255,255,.06)"},
  tipB:{display:"flex",gap:8,alignItems:"flex-start",padding:"10px 14px",borderRadius:12,width:"100%",background:"rgba(251,191,36,.08)",border:"1px solid rgba(251,191,36,.1)"},
  nextBox:{width:"100%",padding:"10px 14px",borderRadius:12,background:"rgba(110,231,183,.06)",border:"1px solid rgba(110,231,183,.1)",textAlign:"center"},
  calBtn:{width:"100%",padding:"15px",background:"linear-gradient(135deg,#1a5276,#1e6f9f)",color:"#fff",border:"none",borderRadius:14,fontSize:15,fontWeight:700,boxShadow:"0 4px 20px rgba(26,82,118,.3)"},
  calDone:{width:"100%",padding:"14px 16px",borderRadius:14,background:"rgba(110,231,183,.06)",border:"1px solid rgba(110,231,183,.12)",textAlign:"center"},
  errB:{width:"100%",padding:"10px 14px",background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.18)",borderRadius:12,fontSize:13,color:"#fca5a5",textAlign:"center"},
};
