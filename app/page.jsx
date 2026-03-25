"use client";
import { useState, useRef, useCallback } from "react";

/* ═══ 85 PLANT DATABASE ═══ */
const DB = [
  {id:0,n:"Orchidea (Phalaenopsis)",lat:"Phalaenopsis",desc:"Motýľovité kvety na dlhom stonke.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:10,lw:14},tip:"Polievaj ponorením na 15 min."},
  {id:1,n:"Monstera",lat:"Monstera deliciosa",desc:"Veľké srdcovité listy s dierami.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:9,lw:14},tip:"Otrieraj listy od prachu."},
  {id:2,n:"Fikus elastický",lat:"Ficus elastica",desc:"Veľké tmavozelené lesklé listy.",w:{ds:5,dw:9,bs:6,bw:10,ms:8,mw:13,ls:10,lw:16},tip:"Nemá rada presúvanie."},
  {id:3,n:"Aloe vera",lat:"Aloe vera",desc:"Dlhé mäsité listy plné gélu.",w:{ds:8,dw:16,bs:10,bw:18,ms:12,mw:21,ls:14,lw:28},tip:"Radšej menej vody."},
  {id:4,n:"Zamiokulkas",lat:"Zamioculcas zamiifolia",desc:"Lesklé tmavozelené listy, nezničiteľný.",w:{ds:8,dw:16,bs:10,bw:18,ms:14,mw:24,ls:16,lw:30},tip:"Znesie aj zanedbanie."},
  {id:5,n:"Pothos",lat:"Epipremnum aureum",desc:"Popínavá so srdcovitými listami.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Rastie aj vo vode."},
  {id:6,n:"Svokrine jazyky",lat:"Sansevieria",desc:"Vysoké tuhé mečovité listy.",w:{ds:10,dw:18,bs:12,bw:21,ms:14,mw:25,ls:16,lw:30},tip:"Čistí vzduch aj v noci."},
  {id:7,n:"Fialka",lat:"Saintpaulia",desc:"Fialové kvietky, chlpaté listy.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:7,ls:6,lw:9},tip:"Polievaj odspodu."},
  {id:8,n:"Kaktus guľatý",lat:"Cactaceae",desc:"Guľatý s ihličkami.",w:{ds:12,dw:25,bs:14,bw:28,ms:16,mw:30,ls:20,lw:40},tip:"V zime takmer nepolievaj."},
  {id:9,n:"Begónia",lat:"Begonia",desc:"Asymetrické listy, drobné kvety.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Miluje vlhkosť."},
  {id:10,n:"Šéflera",lat:"Schefflera",desc:"Vejárovité zložené listy.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Občas otoč."},
  {id:11,n:"Dracéna",lat:"Dracaena",desc:"Úzke listy na drevnatom kmeni.",w:{ds:5,dw:9,bs:6,bw:11,ms:8,mw:14,ls:10,lw:18},tip:"Filtrovaná voda."},
  {id:12,n:"Filodendron srdcový",lat:"Philodendron",desc:"Srdcovité listy, popínavá.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Rýchlo rastie."},
  {id:13,n:"Kalatea",lat:"Calathea",desc:"Farebné vzory na listoch.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:8,ls:6,lw:10},tip:"Citlivá na tvrdú vodu."},
  {id:14,n:"Papraď",lat:"Nephrolepis",desc:"Vzdušné zelené perím-listy.",w:{ds:2,dw:4,bs:3,bw:5,ms:4,mw:6,ls:5,lw:8},tip:"Ideálna do kúpeľne."},
  {id:15,n:"Tučnolist",lat:"Crassula ovata",desc:"Mäsité listy, peňažný stromček.",w:{ds:7,dw:14,bs:8,bw:16,ms:10,mw:20,ls:12,lw:25},tip:"Veľa svetla."},
  {id:16,n:"Brečtan",lat:"Hedera helix",desc:"Popínavá, laločnaté listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Jedovatý pre zvieratá."},
  {id:17,n:"Spatifilum",lat:"Spathiphyllum",desc:"Tmavozelené listy, biele kvety.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Listy ovísnú keď má smäd."},
  {id:18,n:"Antúrium",lat:"Anthurium",desc:"Červené lesklé srdcovité kvety.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Miluje vlhkosť."},
  {id:19,n:"Fikus benjamín",lat:"Ficus benjamina",desc:"Malé oválne listy, stromček.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Nechaj na jednom mieste."},
  {id:20,n:"Yucca",lat:"Yucca",desc:"Ostré listy z hrubého kmeňa.",w:{ds:7,dw:12,bs:8,bw:14,ms:10,mw:18,ls:12,lw:21},tip:"Odolná, rada má svetlo."},
  {id:21,n:"Palma Areka",lat:"Dypsis lutescens",desc:"Palmové listy na tenkých kmeňoch.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Zvlhčuje vzduch."},
  {id:22,n:"Aglaonema",lat:"Aglaonema",desc:"Široké farebné listy.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:9,lw:15},tip:"Nízke nároky na svetlo."},
  {id:23,n:"Dieffenbachia",lat:"Dieffenbachia",desc:"Veľké zeleno-biele listy.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Jedovatá šťava!"},
  {id:24,n:"Kroton",lat:"Codiaeum",desc:"Pestré červeno-žlto-zelené listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Viac svetla = sýtejšie farby."},
  {id:25,n:"Pilea",lat:"Pilea peperomioides",desc:"Okrúhle mincovité listy.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:10,ls:8,lw:13},tip:"Tvorí odnože."},
  {id:26,n:"Maranta",lat:"Maranta",desc:"Listy s žilkami, zatvára sa na noc.",w:{ds:3,dw:5,bs:4,bw:7,ms:5,mw:8,ls:6,lw:10},tip:"Modliaca sa rastlina."},
  {id:27,n:"Haworthia",lat:"Haworthia",desc:"Malý sukulent, pruhované listy.",w:{ds:8,dw:16,bs:10,bw:18,ms:12,mw:22,ls:14,lw:28},tip:"Znesie nepriame svetlo."},
  {id:28,n:"Echeveria",lat:"Echeveria",desc:"Ružicový sukulent.",w:{ds:7,dw:14,bs:9,bw:18,ms:11,mw:21,ls:14,lw:28},tip:"Polievaj len pôdu."},
  {id:29,n:"Tradescantia",lat:"Tradescantia",desc:"Fialovo-zelené pruhované listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Zakorení za pár dní."},
  {id:30,n:"Kalanchoe",lat:"Kalanchoe",desc:"Sukulent s farebnými kvetmi.",w:{ds:7,dw:14,bs:8,bw:16,ms:10,mw:20,ls:12,lw:24},tip:"Dlho kvitnúci."},
  {id:31,n:"Zelenec",lat:"Chlorophytum",desc:"Zeleno-biele dlhé listy.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Čistí vzduch."},
  {id:32,n:"Hoya",lat:"Hoya carnosa",desc:"Mäsité listy, voskové kvety.",w:{ds:6,dw:12,bs:7,bw:14,ms:9,mw:16,ls:11,lw:20},tip:"Nepresádzaj často."},
  {id:33,n:"Alocasia",lat:"Alocasia",desc:"Veľké šípovité listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Vlhkosť a teplo."},
  {id:34,n:"Cyklámen",lat:"Cyclamen",desc:"Srdcovité listy, motýľové kvety.",w:{ds:3,dw:5,bs:3,bw:6,ms:4,mw:7,ls:5,lw:8},tip:"Kvitne v zime!"},
  {id:35,n:"Peperomia",lat:"Peperomia",desc:"Malá, mäsité okrúhle listy.",w:{ds:5,dw:9,bs:6,bw:10,ms:7,mw:12,ls:9,lw:15},tip:"Nepreliať!"},
  {id:36,n:"Levanduľa",lat:"Lavandula",desc:"Fialové kvety, krásna vôňa.",w:{ds:5,dw:10,bs:6,bw:12,ms:8,mw:14,ls:10,lw:18},tip:"Veľa slnka."},
  {id:37,n:"Vianočná hviezda",lat:"Euphorbia pulcherrima",desc:"Veľké červené listy.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:7,ls:6,lw:9},tip:"Chráň pred prievanom."},
  {id:38,n:"Kaktus stĺpovitý",lat:"Cereus",desc:"Vysoký stĺpovitý s rebrami.",w:{ds:10,dw:21,bs:12,bw:25,ms:14,mw:28,ls:18,lw:35},tip:"Priame slnko."},
  {id:39,n:"Opuncia",lat:"Opuntia",desc:"Plochý kaktus s „ušami".",w:{ds:10,dw:21,bs:12,bw:25,ms:14,mw:28,ls:18,lw:35},tip:"Veľa slnka, málo vody."},
  {id:40,n:"Stromanthe",lat:"Stromanthe sanguinea",desc:"Zelené listy, ružové naspodu.",w:{ds:3,dw:5,bs:4,bw:7,ms:5,mw:8,ls:6,lw:10},tip:"Chce vlhkosť."},
  {id:41,n:"Palma horská",lat:"Chamaedorea elegans",desc:"Kompaktná palma.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:10,ls:8,lw:13},tip:"Znesie menej svetla."},
  {id:42,n:"Gerbera",lat:"Gerbera jamesonii",desc:"Veľké pestré margaréty.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:8,ls:6,lw:10},tip:"Veľa svetla na kvitnutie."},
  {id:43,n:"Izbový bambus",lat:"Dracaena sanderiana",desc:"Lucky bamboo, zelené stonky.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:9,lw:15},tip:"Rastie aj vo vode."},
  {id:44,n:"Azalka",lat:"Rhododendron",desc:"Krík s množstvom kvetov.",w:{ds:2,dw:4,bs:3,bw:5,ms:4,mw:6,ls:5,lw:8},tip:"Kyslá pôda."},
  {id:45,n:"Fikus lyrata",lat:"Ficus lyrata",desc:"Veľké husľovité listy.",w:{ds:5,dw:9,bs:6,bw:10,ms:8,mw:13,ls:10,lw:16},tip:"Veľa nepriameho svetla."},
  {id:46,n:"Pachira",lat:"Pachira aquatica",desc:"Prepletený kmeň, dlaňovité listy.",w:{ds:5,dw:9,bs:6,bw:11,ms:7,mw:13,ls:9,lw:16},tip:"Money tree. Nepreliať."},
  {id:47,n:"Šťavel (Oxalis)",lat:"Oxalis triangularis",desc:"Trojuholníkové fialové listy.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Na noc zatvára listy."},
  {id:48,n:"Orchidea Dendrobium",lat:"Dendrobium",desc:"Orchidea s kvetmi na stonke.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Chladnejšie v noci."},
  {id:49,n:"Orchidea Oncidium",lat:"Oncidium",desc:"Drobné žlté „tancujúce" kvety.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Jasné nepriame svetlo."},
  {id:50,n:"Orchidea Cattleya",lat:"Cattleya",desc:"Veľké voňavé kvety.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:9,lw:14},tip:"Silné svetlo."},
  {id:51,n:"Strelícia",lat:"Strelitzia",desc:"Bird of Paradise, veľké listy.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Veľa svetla na kvitnutie."},
  {id:52,n:"Kentia palma",lat:"Howea forsteriana",desc:"Elegantná vysoká palma.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:8,lw:14},tip:"Znesie aj tieň."},
  {id:53,n:"Monstera Adansonii",lat:"Monstera adansonii",desc:"Menšia monstera, viac dierok.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Popínavá, daj oporu."},
  {id:54,n:"Filodendron Birkin",lat:"Philodendron Birkin",desc:"Tmavé listy s bielymi prúžkami.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Pomalý rast."},
  {id:55,n:"Calathea orbifolia",lat:"Calathea orbifolia",desc:"Veľké okrúhle pruhované listy.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:8,ls:6,lw:10},tip:"Destilovaná voda."},
  {id:56,n:"Calathea medallion",lat:"Calathea roseopicta",desc:"Ružovo-zelený vzor na listoch.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:8,ls:6,lw:10},tip:"Vysoká vlhkosť."},
  {id:57,n:"String of pearls",lat:"Senecio rowleyanus",desc:"Guľaté listky na dlhých výhonkoch.",w:{ds:7,dw:14,bs:8,bw:16,ms:10,mw:20,ls:12,lw:25},tip:"Jasné svetlo, málo vody."},
  {id:58,n:"String of hearts",lat:"Ceropegia woodii",desc:"Srdiečkové listky, tenké výhonky.",w:{ds:6,dw:12,bs:7,bw:14,ms:9,mw:16,ls:11,lw:20},tip:"Nechaj preschnúť."},
  {id:59,n:"Rhipsalis",lat:"Rhipsalis",desc:"Kaktus bez ihličiek, visiace výhonky.",w:{ds:5,dw:10,bs:6,bw:12,ms:7,mw:14,ls:9,lw:16},tip:"Trošku viac vody ako kaktus."},
  {id:60,n:"Púštna ruža",lat:"Adenium obesum",desc:"Hrubý kmeň, ružové kvety.",w:{ds:7,dw:16,bs:8,bw:18,ms:10,mw:21,ls:12,lw:28},tip:"Veľa slnka."},
  {id:61,n:"Fikus Ginseng",lat:"Ficus microcarpa",desc:"Bonsai s hrubými koreňmi.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:8,lw:14},tip:"Pravidelný strih."},
  {id:62,n:"Bonsai (Ficus)",lat:"Ficus retusa",desc:"Miniatúrny stromček.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Nikdy nenechaj vyschnúť."},
  {id:63,n:"Bambus",lat:"Bambusa",desc:"Vysoký bambus v kvetináči.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:8,ls:6,lw:10},tip:"Veľa vody v lete."},
  {id:64,n:"Kroton Petra",lat:"Codiaeum Petra",desc:"Veľké pestré listy — červené, žlté.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Rada má teplo."},
  {id:65,n:"Satin Pothos",lat:"Scindapsus pictus",desc:"Strieborné škvrny na listoch.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:8,lw:14},tip:"Menej svetla ako Pothos."},
  {id:66,n:"Antúrium clarinervium",lat:"Anthurium clarinervium",desc:"Srdcovité listy s bielymi žilkami.",w:{ds:4,dw:7,bs:5,bw:9,ms:6,mw:11,ls:7,lw:13},tip:"Vlhkosť a teplo."},
  {id:67,n:"Ctenanthe",lat:"Ctenanthe",desc:"Podobná kalatei, pruhované listy.",w:{ds:3,dw:5,bs:4,bw:7,ms:5,mw:8,ls:6,lw:10},tip:"Nepriame svetlo."},
  {id:68,n:"Asparagus",lat:"Asparagus sprengeri",desc:"Jemné ihličkovité listy.",w:{ds:3,dw:5,bs:4,bw:6,ms:5,mw:8,ls:6,lw:10},tip:"Rada má vlhkosť."},
  {id:69,n:"Aspidistra",lat:"Aspidistra elatior",desc:"Široké tmavozelené listy. Nezničiteľná.",w:{ds:6,dw:10,bs:7,bw:12,ms:8,mw:14,ls:10,lw:18},tip:"Znesie takmer čokoľvek."},
  {id:70,n:"Syngonium",lat:"Syngonium podophyllum",desc:"Šípovité listy, mení sa s vekom.",w:{ds:4,dw:7,bs:5,bw:8,ms:6,mw:10,ls:7,lw:12},tip:"Mladá kompaktná, stará popínavá."},
  {id:71,n:"Kávovník",lat:"Coffea arabica",desc:"Lesklé zelené listy, biele kvety.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Jasné nepriame svetlo."},
  {id:72,n:"Citrus",lat:"Citrus",desc:"Citrón alebo pomaranč v kvetináči.",w:{ds:3,dw:6,bs:4,bw:7,ms:5,mw:9,ls:6,lw:11},tip:"Veľa slnka a vlhkosti."},
  {id:73,n:"Mäta",lat:"Mentha",desc:"Aromatické zelené listy.",w:{ds:2,dw:4,bs:3,bw:5,ms:4,mw:6,ls:5,lw:8},tip:"Veľa vody, veľa svetla."},
  {id:74,n:"Bazalka",lat:"Ocimum basilicum",desc:"Aromatická bylinka, zelené listy.",w:{ds:2,dw:3,bs:2,bw:4,ms:3,mw:5,ls:4,lw:6},tip:"Priame slnko, teplá voda."},
  {id:75,n:"Rozmarín",lat:"Rosmarinus officinalis",desc:"Ihličkovité voňavé listy.",w:{ds:5,dw:10,bs:6,bw:12,ms:7,mw:14,ls:9,lw:18},tip:"Nechaj preschnúť medzi polievaniami."},
  {id:76,n:"Euphorbia trigona",lat:"Euphorbia trigona",desc:"Trojhranný stĺpovitý sukulent.",w:{ds:8,dw:16,bs:10,bw:18,ms:12,mw:21,ls:14,lw:28},tip:"Jedovatá šťava!"},
  {id:77,n:"Vianočný kaktus",lat:"Schlumbergera",desc:"Sploštené články, kvety na koncoch.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:8,lw:14},tip:"Kvitne v zime pri kratšom dni."},
  {id:78,n:"Lithops",lat:"Lithops",desc:"Živé kamene — malé, okrúhle.",w:{ds:14,dw:30,bs:16,bw:35,ms:18,mw:40,ls:21,lw:45},tip:"Takmer žiadna voda v zime."},
  {id:79,n:"Gasteria",lat:"Gasteria",desc:"Malý sukulent, jazykovité listy.",w:{ds:8,dw:16,bs:10,bw:18,ms:12,mw:22,ls:14,lw:28},tip:"Znesie tieň."},
  {id:80,n:"Sedum",lat:"Sedum",desc:"Drobný sukulent, rôzne tvary.",w:{ds:7,dw:14,bs:9,bw:18,ms:11,mw:21,ls:14,lw:28},tip:"Veľa svetla."},
  {id:81,n:"Senecio rowleyanus",lat:"Senecio rowleyanus",desc:"String of pearls — guľaté listky.",w:{ds:7,dw:14,bs:8,bw:16,ms:10,mw:20,ls:12,lw:25},tip:"Jasné svetlo."},
  {id:82,n:"Tillandsia",lat:"Tillandsia",desc:"Air plant — bez pôdy, rosí sa.",w:{ds:2,dw:4,bs:3,bw:5,ms:3,mw:5,ls:4,lw:6},tip:"Ponor do vody 1x týždenne."},
  {id:83,n:"Bromélia Neoregelia",lat:"Neoregelia",desc:"Farebná rozeta, kvety v strede.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:8,lw:14},tip:"Lej vodu do rozety."},
  {id:84,n:"Bromélia Vriesea",lat:"Vriesea",desc:"Lesklá rozeta, farebný kvet.",w:{ds:5,dw:8,bs:6,bw:10,ms:7,mw:12,ls:8,lw:14},tip:"Lej vodu do rozety."},
];

const LIGHTS = [
  {id:"d",label:"Priame slnko",icon:"☀️",desc:"Južné okno"},
  {id:"b",label:"Jasné nepriame",icon:"🌤",desc:"Blízko okna"},
  {id:"m",label:"Stredné",icon:"⛅",desc:"Ďalej od okna"},
  {id:"l",label:"Málo svetla",icon:"🌙",desc:"Tmavý kút"},
];

const LAST_WATERED = [
  {id:0,label:"Dnes",icon:"💧"},
  {id:1,label:"Včera",icon:"💧"},
  {id:3,label:"Pred 2-3 dňami",icon:"💦"},
  {id:5,label:"Pred 4-7 dňami",icon:"🏜️"},
  {id:-1,label:"Neviem / dávno",icon:"🤷"},
];

const TIME_OPTIONS = [
  {h:7,label:"7:00 ráno"},
  {h:8,label:"8:00 ráno"},
  {h:9,label:"9:00 ráno"},
  {h:10,label:"10:00 doobeda"},
  {h:12,label:"12:00 na obed"},
  {h:17,label:"17:00 podvečer"},
  {h:19,label:"19:00 večer"},
];

/* ═══ ICS CALENDAR ═══ */
function generateICS(plantName, intervalDays, daysUntilFirst, hour) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (d) => d.getFullYear().toString()+pad(d.getMonth()+1)+pad(d.getDate())+"T"+pad(d.getHours())+pad(d.getMinutes())+pad(d.getSeconds());

  const start = new Date(now);
  start.setDate(start.getDate() + Math.max(daysUntilFirst, 1));
  start.setHours(hour, 0, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 15);

  const until = new Date(start);
  until.setFullYear(until.getFullYear() + 1);

  return [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Botanik//SK","CALSCALE:GREGORIAN","METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:botanik-"+Date.now()+"@botanik.app",
    "DTSTART:"+fmt(start),"DTEND:"+fmt(end),
    "RRULE:FREQ=DAILY;INTERVAL="+intervalDays+";UNTIL="+fmt(until),
    "SUMMARY:🌿 Poliat "+plantName,
    "DESCRIPTION:Cas poliat "+plantName+"! Kazdych "+intervalDays+" dni.",
    "BEGIN:VALARM","TRIGGER:-PT10M","ACTION:DISPLAY","DESCRIPTION:O 10 min poliat "+plantName+"!","END:VALARM",
    "BEGIN:VALARM","TRIGGER:PT0M","ACTION:DISPLAY","DESCRIPTION:Polej "+plantName+" teraz!","END:VALARM",
    "END:VEVENT","END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS(plantName, intervalDays, daysUntilFirst, hour) {
  const ics = generateICS(plantName, intervalDays, daysUntilFirst, hour);
  const blob = new Blob([ics], {type:"text/calendar;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "polievanie-"+plantName.toLowerCase().replace(/[^a-z0-9]/gi,"-")+".ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ═══ IMAGE COMPRESSION ═══ */
function shrink(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const fr = new FileReader();
    fr.onload = e => { img.src = e.target.result; };
    fr.onerror = () => reject("Neda sa precitat");
    fr.readAsDataURL(file);
    img.onload = () => {
      const MAX = 640;
      let w = img.width, h = img.height;
      const r = Math.min(MAX/w, MAX/h, 1);
      w = Math.round(w*r); h = Math.round(h*r);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve({ b64: c.toDataURL("image/jpeg",0.55).split(",")[1], preview: c.toDataURL("image/jpeg",0.7) });
    };
    img.onerror = () => reject("Obrazok sa nenacital");
  });
}

/* ═══ APP ═══ */
export default function Home() {
  const [step, setStep] = useState("start");
  const [preview, setPreview] = useState(null);
  const [plant, setPlant] = useState(null);
  const [light, setLight] = useState(null);
  const [season, setSeason] = useState(null);
  const [days, setDays] = useState(null);
  const [lastW, setLastW] = useState(null);
  const [dUntil, setDUntil] = useState(null);
  const [hour, setHour] = useState(9);
  const [err, setErr] = useState(null);
  const [search, setSearch] = useState("");
  const [calAdded, setCalAdded] = useState(false);
  const ref = useRef();

  const onFile = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null); setStep("scan");
    try {
      const { b64, preview: p } = await shrink(file);
      setPreview(p);
      const res = await fetch("/api/identify", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:b64})});
      const data = await res.json();
      if (!res.ok || data.error) { setErr(data.error||"Nepodarilo sa"); setStep("fallback"); return; }
      const found = DB.find(p => p.id === data.id);
      if (found) { setPlant(found); setStep("confirm"); }
      else { setErr("Nenajdena"); setStep("fallback"); }
    } catch (ex) { setErr("Chyba: "+ex.message); setStep("fallback"); }
    finally { if (ref.current) ref.current.value = ""; }
  }, []);

  const pickPlant = useCallback((p) => { setPlant(p); setStep("light"); setErr(null); }, []);
  const pickLight = useCallback((id) => { setLight(id); setStep("season"); }, []);
  const pickSeason = useCallback((s) => { setSeason(s); setDays(plant?.w?.[light+s]||7); setStep("lastwater"); }, [plant, light]);
  const pickLast = useCallback((daysAgo) => {
    setLastW(daysAgo);
    let u = daysAgo === -1 ? days : Math.max(days - daysAgo, 0);
    setDUntil(u);
    setStep("time");
  }, [days]);
  const pickTime = useCallback((h) => { setHour(h); setStep("done"); setCalAdded(false); }, []);
  const reset = useCallback(() => {
    setStep("start"); setPreview(null); setPlant(null); setLight(null);
    setSeason(null); setDays(null); setLastW(null); setDUntil(null);
    setHour(9); setErr(null); setSearch(""); setCalAdded(false);
  }, []);

  const filtered = search.trim() ? DB.filter(p => (p.n+" "+p.lat+" "+p.desc).toLowerCase().includes(search.toLowerCase())) : DB;
  const li = LIGHTS.find(x => x.id === light);

  return (
    <div style={S.root}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fi{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pl{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        @keyframes sp{to{transform:rotate(360deg)}}
        .fi{animation:fi .35s ease-out both}
        .pl{animation:pl 2.5s ease-in-out infinite}
        button{cursor:pointer;font-family:'Nunito',sans-serif}
        button:active{transform:scale(.96)!important}
        input{font-family:'Nunito',sans-serif}
      `}</style>
      <div style={{position:"fixed",top:-120,left:-120,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(110,231,183,.07) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:32}}>🪴</div>
        <h1 style={S.h1}>Botanik</h1>
        <p style={S.sub}>Odfot → Rozpozname → Pripomenieme</p>
      </div>
      <div style={S.wrap} className="fi" key={step}>

        {step==="start"&&(<Cd>
          <div style={S.drop} onClick={()=>ref.current?.click()}>
            <div style={{fontSize:52,marginBottom:8}}>📸</div>
            <p style={{fontSize:17,fontWeight:700,color:"#6ee7b7"}}>Ofot kvetinu</p>
            <p style={{fontSize:13,color:"rgba(255,255,255,.3)",marginTop:6}}>AI ju rozpozna z databazy 85 rastlin</p>
          </div>
          <input ref={ref} type="file" accept="image/*" onChange={onFile} style={{display:"none"}}/>
          <div style={{width:"100%",height:1,background:"rgba(255,255,255,.06)"}}/>
          <button style={S.sec} onClick={()=>setStep("fallback")}>📋 Najdi podla nazvu</button>
        </Cd>)}

        {step==="scan"&&(<Cd>
          {preview&&<img src={preview} alt="" style={S.prev}/>}
          <div style={{width:38,height:38,borderRadius:"50%",margin:"8px auto",border:"3px solid rgba(110,231,183,.2)",borderTopColor:"#6ee7b7",animation:"sp .7s linear infinite"}}/>
          <p style={{fontSize:14,fontWeight:600,color:"#6ee7b7"}}>Analyzujem fotku…</p>
        </Cd>)}

        {step==="confirm"&&plant&&(<Cd>
          {preview&&<img src={preview} alt="" style={S.prev}/>}
          <p style={{fontSize:11,color:"#6ee7b7",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase"}}>Najdena zhoda</p>
          <h2 style={S.pn}>{plant.n}</h2>
          <p style={{fontSize:12,fontStyle:"italic",color:"rgba(255,255,255,.3)"}}>{plant.lat}</p>
          <p style={S.desc}>{plant.desc}</p>
          <button style={S.pri} onClick={()=>setStep("light")}>✓ Spravna rastlina</button>
          <button style={S.gh} onClick={()=>setStep("fallback")}>✗ Nie je to ona</button>
        </Cd>)}

        {step==="fallback"&&(<Cd>
          {err&&<div style={S.errB}>{err}</div>}
          <h3 style={S.q}>Najdi svoju rastlinu</h3>
          <input type="text" placeholder="Hladaj… (monstera, kaktus…)" value={search} onChange={e=>setSearch(e.target.value)} style={S.inp}/>
          <div style={{display:"flex",flexDirection:"column",gap:5,width:"100%",maxHeight:320,overflowY:"auto"}}>
            {filtered.map(p=>(<button key={p.id} style={S.resC} onClick={()=>pickPlant(p)}>
              <div style={{flex:1}}><p style={{fontSize:13,fontWeight:700,color:"#1a2e0d",margin:0}}>{p.n}</p><p style={{fontSize:10,color:"rgba(0,0,0,.4)",margin:0}}>{p.lat} — {p.desc}</p></div>
              <span style={{color:"#059669",fontSize:16}}>→</span>
            </button>))}
          </div>
          <button style={S.gh} onClick={reset}>← Odznova</button>
        </Cd>)}

        {step==="light"&&(<Cd>
          <h3 style={S.q}>Ake svetlo ma {plant?.n}?</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%"}}>
            {LIGHTS.map(o=>(<button key={o.id} style={S.opt} onClick={()=>pickLight(o.id)}>
              <span style={{fontSize:28}}>{o.icon}</span>
              <span style={{fontSize:13,fontWeight:700,color:"#1a2e0d"}}>{o.label}</span>
              <span style={{fontSize:10,color:"rgba(0,0,0,.4)"}}>{o.desc}</span>
            </button>))}
          </div>
        </Cd>)}

        {step==="season"&&(<Cd>
          <h3 style={S.q}>Ake je obdobie?</h3>
          <div style={{display:"flex",gap:12,width:"100%"}}>
            {[{id:"s",i:"🌻",l:"Leto / Jar"},{id:"w",i:"❄️",l:"Zima / Jesen"}].map(s=>(
              <button key={s.id} style={{...S.opt,flex:1,padding:"22px 12px"}} onClick={()=>pickSeason(s.id)}>
                <span style={{fontSize:36}}>{s.i}</span>
                <span style={{fontSize:14,fontWeight:700,color:"#1a2e0d"}}>{s.l}</span>
              </button>))}
          </div>
          <button style={S.gh} onClick={()=>setStep("light")}>← Spat</button>
        </Cd>)}

        {step==="lastwater"&&(<Cd>
          <h3 style={S.q}>Kedy bola naposledy poliata?</h3>
          <p style={{fontSize:13,color:"rgba(255,255,255,.35)",textAlign:"center"}}>Podla toho nastavime prvu pripomienku</p>
          <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
            {LAST_WATERED.map(lw=>(<button key={lw.id} style={S.lwBtn} onClick={()=>pickLast(lw.id)}>
              <span style={{fontSize:22}}>{lw.icon}</span>
              <span style={{fontSize:14,fontWeight:700,color:"#1a2e0d"}}>{lw.label}</span>
            </button>))}
          </div>
          <button style={S.gh} onClick={()=>setStep("season")}>← Spat</button>
        </Cd>)}

        {step==="time"&&(<Cd>
          <h3 style={S.q}>Kedy chces pripomienku?</h3>
          <p style={{fontSize:13,color:"rgba(255,255,255,.35)",textAlign:"center"}}>V akom case ta mame upozornit</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,width:"100%"}}>
            {TIME_OPTIONS.map(t=>(<button key={t.h} style={S.timeBtn} onClick={()=>pickTime(t.h)}>
              <span style={{fontSize:14,fontWeight:700,color:"#1a2e0d"}}>🕐 {t.label}</span>
            </button>))}
          </div>
          <button style={S.gh} onClick={()=>setStep("lastwater")}>← Spat</button>
        </Cd>)}

        {step==="done"&&days&&plant&&(<Cd>
          <div style={S.orb} className="pl">
            <span style={{fontSize:46,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#fff",lineHeight:1}}>{days}</span>
            <span style={{fontSize:13,color:"rgba(255,255,255,.7)"}}>dni</span>
          </div>
          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:21,fontWeight:600,color:"#d1fae5",textAlign:"center",lineHeight:1.4}}>
            Polievaj <em>{plant.n}</em> kazdych {days} dni
          </h2>
          <div style={S.nextBox}>
            <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,.5)"}}>
              {dUntil===0?"⚠️ Treba poliat dnes! Pripomienky od zajtra o "+hour+":00."
              :dUntil===1?"💧 Dalšie polievanie zajtra o "+hour+":00."
              :"💧 Dalšie polievanie o "+dUntil+" dni o "+hour+":00."}
            </p>
          </div>
          <div style={S.sum}>
            <SR i="🌿" l="Rastlina" v={plant.n}/>
            <SR i={li?.icon||""} l="Svetlo" v={li?.label||""}/>
            <SR i={season==="s"?"🌻":"❄️"} l="Obdobie" v={season==="s"?"Leto":"Zima"}/>
            <SR i="💧" l="Cyklus" v={"kazdych "+days+" dni"}/>
            <SR i="🕐" l="Cas" v={hour+":00"}/>
          </div>
          {plant.tip&&<div style={S.tipB}><span>💡</span><p style={{margin:0,fontSize:13,color:"#fef3c7",lineHeight:1.5}}>{plant.tip}</p></div>}
          {!calAdded?(<button style={S.calBtn} onClick={()=>{downloadICS(plant.n,days,dUntil,hour);setCalAdded(true);}}>
            📅 Pridat pripomienku do kalendara
          </button>):(<div style={S.calDone}>
            <p style={{margin:0,fontSize:14,fontWeight:600,color:"#6ee7b7"}}>✓ Subor stiahnuty!</p>
            <p style={{margin:"6px 0 0",fontSize:12,color:"rgba(255,255,255,.4)",lineHeight:1.5}}>Otvor .ics subor — na iPhone sa automaticky prida do Kalendara ako opakujuca sa pripomienka.</p>
            <button style={{...S.gh,marginTop:8,fontSize:12,color:"rgba(255,255,255,.35)"}} onClick={()=>downloadICS(plant.n,days,dUntil,hour)}>Stiahnut znova</button>
          </div>)}
          <button style={S.pri} onClick={reset}>🌱 Dalsia kvetina</button>
        </Cd>)}
      </div>
    </div>
  );
}

function Cd({children}){return <div style={S.card}>{children}</div>}
function SR({i,l,v}){return <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0"}}><span style={{fontSize:13,color:"rgba(255,255,255,.4)"}}>{i} {l}</span><span style={{fontSize:13,fontWeight:700,color:"#d1fae5"}}>{v}</span></div>}

const S = {
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
