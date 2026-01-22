import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ITSPE = process.env.ITSPE_LAYER_URL!;
const OUT_FIELDS = [
  "SSL","PREMISEADD","PRMS_WARD","NBHD","NBHDNAME","PROPTYPE","USECODE","CLASSTYPE",
  "LANDAREA","ASSESSMENT","ANNUALTAX","SALEDATE","SALEPRICE",
  "OWNERNAME","CAREOFNAME","ADDRESS1","CITYSTZIP",
  "HSTDCODE","OWNOCCT"
].join(",");

async function arcgisQuery(where: string, offset: number, count: number) {
  const url = new URL(`${ITSPE}/query`);
  url.searchParams.set("f", "json");
  url.searchParams.set("where", where);
  url.searchParams.set("outFields", OUT_FIELDS);
  url.searchParams.set("returnGeometry", "false");
  url.searchParams.set("resultOffset", String(offset));
  url.searchParams.set("resultRecordCount", String(count));
  url.searchParams.set("orderByFields", "OBJECTID ASC");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`ArcGIS ${res.status}`);
  return res.json();
}

function scoreMortgageUnder200(attrs: any): { score: number; band: string } {
  // Not strict: heuristic/probabilistic scoring (0-100)
  let score = 50;

  const salePrice = Number(attrs.SALEPRICE || 0);
  const saleDateMs = attrs.SALEDATE ? Number(attrs.SALEDATE) : null;
  const assessment = Number(attrs.ASSESSMENT || 0);
  const hstd = (attrs.HSTDCODE || "").trim();
  const ownOcc = typeof attrs.OWNOCCT === "number" ? attrs.OWNOCCT : null;

  // Older ownership -> more likely low remaining balance
  if (saleDateMs) {
    const years = (Date.now() - saleDateMs) / (1000 * 60 * 60 * 24 * 365);
    if (years >= 20) score += 20;
    else if (years >= 12) score += 12;
    else if (years >= 7) score += 6;
    else score -= 6;
  }

  // Lower historic sale price -> lower original loan
  if (salePrice > 0) {
    if (salePrice <= 300000) score += 15;
    else if (salePrice <= 500000) score += 8;
    else if (salePrice >= 900000) score -= 10;
  } else {
    score -= 5; // unknown
  }

  // Owner-occupied + homestead can mean long-term paydown (but also refi risk)
  if (hstd) score += 4;
  if (ownOcc === 1) score += 2;
  if (ownOcc === 0) score -= 2;

  // Assessment as mild proxy: very high value properties less likely <200k
  if (assessment >= 1200000) score -= 10;
  if (assessment <= 650000 && assessment > 0) score += 4;

  // clamp
  score = Math.max(0, Math.min(100, Math.round(score)));

  const band = score >= 70 ? "LIKELY" : score >= 45 ? "MAYBE" : "UNLIKELY";
  return { score, band };
}

function absenteeHeuristic(attrs: any): boolean {
  // Simple: OWNOCCT=0 is a good proxy; you can later add MAR address normalization
  return Number(attrs.OWNOCCT || 0) === 0;
}

async function upsertProperty(attrs: any) {
  const { score, band } = scoreMortgageUnder200(attrs);
  const saleDate = attrs.SALEDATE ? new Date(Number(attrs.SALEDATE)) : null;

  await prisma.property.upsert({
    where: { ssl: attrs.SSL },
    update: {
      premiseAdd: attrs.PREMISEADD,
      ward: String(attrs.PRMS_WARD || ""),
      nbhd: attrs.NBHD ? String(attrs.NBHD) : null,
      nbhdName: attrs.NBHDNAME,
      propType: attrs.PROPTYPE,
      useCode: attrs.USECODE,
      classType: attrs.CLASSTYPE,
      landArea: attrs.LANDAREA ? Number(attrs.LANDAREA) : null,
      assessment: attrs.ASSESSMENT ? Number(attrs.ASSESSMENT) : null,
      annualTax: attrs.ANNUALTAX ? Number(attrs.ANNUALTAX) : null,
      saleDate,
      salePrice: attrs.SALEPRICE ? Number(attrs.SALEPRICE) : null,
      ownerName: attrs.OWNERNAME,
      careOfName: attrs.CAREOFNAME,
      address1: attrs.ADDRESS1,
      cityStZip: attrs.CITYSTZIP,
      hstdCode: attrs.HSTDCODE,
      ownOccT: typeof attrs.OWNOCCT === "number" ? attrs.OWNOCCT : null,
      absenteeLikely: absenteeHeuristic(attrs),
      mortgageUnder200Score: score,
      mortgageUnder200Band: band,
      updatedFromItspeAt: new Date()
    },
    create: {
      ssl: attrs.SSL,
      premiseAdd: attrs.PREMISEADD,
      ward: String(attrs.PRMS_WARD || ""),
      nbhd: attrs.NBHD ? String(attrs.NBHD) : null,
      nbhdName: attrs.NBHDNAME,
      propType: attrs.PROPTYPE,
      useCode: attrs.USECODE,
      classType: attrs.CLASSTYPE,
      landArea: attrs.LANDAREA ? Number(attrs.LANDAREA) : null,
      assessment: attrs.ASSESSMENT ? Number(attrs.ASSESSMENT) : null,
      annualTax: attrs.ANNUALTAX ? Number(attrs.ANNUALTAX) : null,
      saleDate,
      salePrice: attrs.SALEPRICE ? Number(attrs.SALEPRICE) : null,
      ownerName: attrs.OWNERNAME,
      careOfName: attrs.CAREOFNAME,
      address1: attrs.ADDRESS1,
      cityStZip: attrs.CITYSTZIP,
      hstdCode: attrs.HSTDCODE,
      ownOccT: typeof attrs.OWNOCCT === "number" ? attrs.OWNOCCT : null,
      absenteeLikely: absenteeHeuristic(attrs),
      mortgageUnder200Score: score,
      mortgageUnder200Band: band,
      updatedFromItspeAt: new Date()
    }
  });
}

async function main() {
  if (!ITSPE) throw new Error("ITSPE_LAYER_URL missing");

  // Pull all wards (1-8) and all properties; refine later with additional where clauses
  const where = "PRMS_WARD IN ('1','2','3','4','5','6','7','8')";

  let offset = 0;
  const pageSize = 2000;

  while (true) {
    const data = await arcgisQuery(where, offset, pageSize);
    const feats = data.features || [];
    if (!feats.length) break;

    for (const f of feats) {
      await upsertProperty(f.attributes);
    }

    offset += feats.length;
    if (!data.exceededTransferLimit && feats.length < pageSize) break;
    console.log(`Synced ${offset}...`);
  }

  console.log("ITSPE sync complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});




