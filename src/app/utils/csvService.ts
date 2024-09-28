import * as fs from "fs";
import { ItemType } from "../api/items/route";

export function readCsvContent(filePath: string) {
  return fs.readFileSync(filePath, { encoding: "utf-8" });
}

export function parseItemsCsvContent(content: string): ItemType[] {
  return content.split("\n").map((row) => {
    const columns = row.split(";");

    return { "created at": columns[0], filename: columns[1] };
  });
}
