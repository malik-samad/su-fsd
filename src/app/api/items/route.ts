import { parseItemsCsvContent, readCsvContent } from "@/app/utils/csvService";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export type ItemType = {
  "created at": string;
  filename: string;
};

export async function GET(request: NextRequest) {
  const sortBy = request.nextUrl.searchParams.get("sortBy");

  // validate sortBy
  if (
    !["created at", "filename ascendent", "filename descendent", null].includes(
      sortBy as string
    )
  )
    return NextResponse.json(
      {
        error: "Bad request",
        message: "sortBy query param is not valid.",
      },
      { status: 400 }
    );

  // locate the data file
  const dataFilePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "..",
    "data.csv"
  );

  // load and parse items content
  const items = parseItemsCsvContent(await readCsvContent(dataFilePath));

  // apply sorting
  const filteredItems = items.sort((a, b) =>
    sortBy == "created at"
      ? new Date(a["created at"]).getTime() -
        new Date(b["created at"]).getTime()
      : sortBy == "filename ascendent"
      ? compareFuncForSortByFileName(
          a.filename.substring(0, a.filename.lastIndexOf(".")),
          b.filename.substring(0, b.filename.lastIndexOf("."))
        )
      : compareFuncForSortByFileName(
          b.filename.substring(0, b.filename.lastIndexOf(".")),
          a.filename.substring(0, a.filename.lastIndexOf("."))
        )
  );

  // send response
  return Response.json(filteredItems);
}

function compareFuncForSortByFileName(a: string, b: string) {
  const regex = /(\d+)|(\D+)/g;

  const partsA = a.match(regex) || []; // Split into digit and non-digit parts
  const partsB = b.match(regex) || [];

  for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
    const partA = partsA[i];
    const partB = partsB[i];

    // Check if both parts are numbers
    if (/\d/.test(partA) && /\d/.test(partB)) {
      const numA = parseInt(partA, 10);
      const numB = parseInt(partB, 10);

      // Compare numbers numerically
      if (numA !== numB) {
        return numA - numB;
      }
    } else {
      // Compare non-numeric parts lexicographically
      if (partA !== partB) {
        return partA.localeCompare(partB);
      }
    }
  }

  // If the parts are equal up to the shortest length, compare by length
  return partsA.length - partsB.length;
}
